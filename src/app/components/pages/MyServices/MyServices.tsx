import { useEffect, useMemo, useState } from "react";
import { makeStyles, PageHeader } from "app/theme";

import { useTranslation } from "app/i18n/useTranslations";
import { MyServicesButtonBar } from "./MyServicesButtonBar";
import { MyServicesCards } from "./MyServicesCards";
import type { Props as MyServicesCardsProps } from "./MyServicesCards";
import { MyServicesSavedConfigs } from "./MyServicesSavedConfigs";
import type { Props as MyServicesSavedConfigsProps } from "./MyServicesSavedConfigs";
import { ButtonId } from "./MyServicesButtonBar";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useThunks, useSelector, selectors } from "app/libApi";
import { copyToClipboard } from "app/tools/copyToClipboard";
import { routes } from "app/routes";
import { createGroup } from "type-route";
import type { Route } from "type-route";
import { useSplashScreen } from "onyxia-ui";
import { Dialog } from "onyxia-ui/Dialog";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { Button } from "app/theme";

MyServices.routeGroup = createGroup([routes.myServices]);

type PageRoute = Route<typeof MyServices.routeGroup>;

MyServices.requireUserLoggedIn = () => true;

export type Props = {
    route: PageRoute;
    className?: string;
};

export function MyServices(props: Props) {
    const { className, route } = props;

    const { t } = useTranslation("MyServices");

    const { runningServiceThunks, restorablePackageConfigThunks, projectConfigsThunks } =
        useThunks();

    const { displayableConfigs } = useSelector(
        selectors.restorablePackageConfig.displayableConfigs,
    );

    const isRunningServicesFetching = useSelector(
        state => state.runningService.isFetching,
    );

    const { runningServices } = useSelector(selectors.runningService.runningServices);

    const { hideSplashScreen, showSplashScreen } = useSplashScreen();

    useEffect(() => {
        if (isRunningServicesFetching) {
            showSplashScreen({ "enableTransparency": true });
        } else {
            hideSplashScreen();
        }
    }, [isRunningServicesFetching]);

    const onButtonBarClick = useConstCallback((buttonId: ButtonId) => {
        switch (buttonId) {
            case "launch":
                routes.catalogExplorer().push();
                return;
            case "refresh":
                runningServiceThunks.initializeOrRefreshIfNotAlreadyFetching();
                return;
            case "password":
                projectConfigsThunks
                    .getValue({ "key": "servicePassword" })
                    .then(copyToClipboard);
                return;
            case "trash":
                setIsDialogOpen(true);
                return;
        }
    });

    useEffect(() => {
        restorablePackageConfigThunks.fetchIconsIfNotAlreadyDone();
        runningServiceThunks.initializeOrRefreshIfNotAlreadyFetching();
    }, []);

    const { isSavedConfigsExtended } = route.params;

    const { classes, cx } = useStyles({ isSavedConfigsExtended });

    const onRequestToggleIsShortVariant = useConstCallback(() =>
        routes
            .myServices({
                "isSavedConfigsExtended": !isSavedConfigsExtended,
            })
            .push(),
    );

    const onSavedConfigsCallback = useConstCallback<
        MyServicesSavedConfigsProps["callback"]
    >(({ launchLinkHref, action }) => {
        switch (action) {
            case "copy link":
                copyToClipboard(window.location.origin + launchLinkHref);
                return;
            case "delete":
                restorablePackageConfigThunks.deleteRestorablePackageConfig({
                    "restorablePackageConfig": displayableConfigs.find(
                        ({ restorablePackageConfig }) =>
                            routes.catalogLauncher({
                                ...restorablePackageConfig,
                                "autoLaunch": true,
                            }).href === launchLinkHref,
                    )!.restorablePackageConfig,
                });
                return;
        }
    });

    const savedConfigs = useMemo(
        (): MyServicesSavedConfigsProps["savedConfigs"] =>
            displayableConfigs.map(
                ({ logoUrl, friendlyName, restorablePackageConfig }) => {
                    const buildLink = (autoLaunch: boolean) =>
                        routes.catalogLauncher({
                            ...restorablePackageConfig,
                            autoLaunch,
                        }).link;

                    return {
                        logoUrl,
                        friendlyName,
                        "launchLink": buildLink(true),
                        "editLink": buildLink(false),
                    };
                },
            ),
        [displayableConfigs],
    );

    const cards = useMemo(
        (): MyServicesCardsProps["cards"] =>
            isRunningServicesFetching
                ? undefined
                : runningServices.map(
                      ({
                          id,
                          logoUrl,
                          friendlyName,
                          packageName,
                          urls,
                          startedAt,
                          monitoringUrl,
                          isStarting,
                          postInstallInstructions,
                          isShared,
                          env,
                          isOwned,
                      }) => ({
                          "serviceId": id,
                          "packageIconUrl": logoUrl,
                          friendlyName,
                          packageName,
                          "infoUrl": routes.myService({ "serviceId": id }).href,
                          "openUrl": urls[0],
                          monitoringUrl,
                          "startTime": isStarting ? undefined : startedAt,
                          "isOvertime": Date.now() - startedAt > 7 * 24 * 3600 * 1000,
                          postInstallInstructions,
                          isShared,
                          env,
                          isOwned,
                      }),
                  ),
        [runningServices, isRunningServicesFetching],
    );

    const catalogExplorerLink = useMemo(() => routes.catalogExplorer().link, []);

    const [serviceIdRequestedToBeDeleted, setServiceIdRequestedToBeDeleted] = useState<
        string | undefined
    >();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onRequestDelete = useConstCallback<MyServicesCardsProps["onRequestDelete"]>(
        ({ serviceId }) => {
            setServiceIdRequestedToBeDeleted(serviceId);
            setIsDialogOpen(true);
        },
    );

    const deletableRunningServices = useMemo(
        () => runningServices.filter(({ isOwned }) => isOwned),
        [runningServices],
    );

    const onDialogCloseFactory = useCallbackFactory(([doDelete]: [boolean]) => {
        if (doDelete) {
            if (serviceIdRequestedToBeDeleted) {
                runningServiceThunks.stopService({
                    "serviceId": serviceIdRequestedToBeDeleted,
                });
            } else {
                deletableRunningServices.map(({ id }) =>
                    runningServiceThunks.stopService({ "serviceId": id }),
                );
            }
        }

        setIsDialogOpen(false);
    });

    const isThereNonOwnedServicesShown = useMemo(
        () => !!runningServices.find(({ isOwned }) => !isOwned),
        [runningServices],
    );

    const isThereOwnedSharedServices = useMemo(
        () => !!runningServices.find(({ isOwned, isShared }) => isOwned && isShared),
        [runningServices],
    );

    return (
        <div className={cx(classes.root, className)}>
            <PageHeader
                mainIcon="services"
                title={t("text1")}
                helpTitle={t("text2")}
                helpContent={t("text3")}
                helpIcon="sentimentSatisfied"
            />
            <MyServicesButtonBar
                onClick={onButtonBarClick}
                isThereNonOwnedServicesShown={isThereNonOwnedServicesShown}
                isThereDeletableServices={deletableRunningServices.length !== 0}
            />
            <div className={classes.payload}>
                {!isSavedConfigsExtended && (
                    <MyServicesCards
                        className={classes.cards}
                        cards={cards}
                        onRequestDelete={onRequestDelete}
                        catalogExplorerLink={catalogExplorerLink}
                    />
                )}
                <MyServicesSavedConfigs
                    isShortVariant={!isSavedConfigsExtended}
                    savedConfigs={savedConfigs}
                    className={classes.savedConfigs}
                    callback={onSavedConfigsCallback}
                    onRequestToggleIsShortVariant={onRequestToggleIsShortVariant}
                />
            </div>
            <Dialog
                title={t("confirm delete title")}
                subtitle={t("confirm delete subtitle")}
                body={`${
                    isThereOwnedSharedServices
                        ? t("confirm delete body shared services")
                        : ""
                } ${t("confirm delete body")}`}
                isOpen={isDialogOpen}
                onClose={onDialogCloseFactory(false)}
                buttons={
                    <>
                        <Button onClick={onDialogCloseFactory(false)} variant="secondary">
                            {t("cancel")}
                        </Button>
                        <Button onClick={onDialogCloseFactory(true)}>
                            {t("confirm")}
                        </Button>
                    </>
                }
            />
        </div>
    );
}

export declare namespace MyServices {
    export type I18nScheme = {
        text1: undefined;
        text2: undefined;
        text3: undefined;
        "running services": undefined;
        "confirm delete title": undefined;
        "confirm delete subtitle": undefined;
        "confirm delete body": undefined;
        "confirm delete body shared services": undefined;
        cancel: undefined;
        confirm: undefined;
    };
}

const useStyles = makeStyles<{
    isSavedConfigsExtended: boolean;
}>({ "label": { MyServices } })((theme, { isSavedConfigsExtended }) => ({
    "root": {
        "height": "100%",
        "display": "flex",
        "flexDirection": "column",
    },
    "contextTypo": {
        ...theme.spacing.topBottom("margin", 4),
    },
    "payload": {
        "overflow": "hidden",
        "flex": 1,
        "display": "flex",
        "& > *": {
            "height": "100%",
        },
    },
    ...(() => {
        const ratio = 0.65;

        return {
            "cards": {
                "flex": ratio,
                "marginRight": theme.spacing(5),
            },
            "savedConfigs": {
                "flex": isSavedConfigsExtended ? 1 : 1 - ratio,
                "paddingRight": "2%",
            },
        };
    })(),
}));
