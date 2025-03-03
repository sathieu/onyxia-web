import { memo } from "react";
import { makeStyles } from "app/theme";
import { RoundLogo } from "app/components/shared/RoundLogo";
import { Button, Text } from "app/theme";
import { useTranslation } from "app/i18n/useTranslations";
import { IconButton } from "app/theme";
import { useConstCallback } from "powerhooks/useConstCallback";
import { TextField } from "onyxia-ui/TextField";
import type { TextFieldProps } from "onyxia-ui/TextField";
import { Tooltip } from "onyxia-ui/Tooltip";
import { capitalize } from "tsafe/capitalize";

export type Props = {
    className?: string;
    packageName: string;
    packageIconUrl?: string;
    isBookmarked: boolean;
    onIsBookmarkedValueChange(isBookmarked: boolean): void;

    friendlyName: string;
    onFriendlyNameChange(friendlyName: string): void;

    isLaunchable: boolean;

    onRequestLaunch(): void;
    onRequestCancel(): void;

    //Undefined when the configuration is the default one
    onRequestCopyLaunchUrl: (() => void) | undefined;
};

export const CatalogLauncherMainCard = memo((props: Props) => {
    const {
        className,
        packageIconUrl,
        packageName,
        isBookmarked,
        friendlyName,
        isLaunchable,
        onIsBookmarkedValueChange,
        onFriendlyNameChange,
        onRequestLaunch,
        onRequestCancel,
        onRequestCopyLaunchUrl,
    } = props;

    const { classes, cx } = useStyles();

    const { t } = useTranslation("CatalogLauncherMainCard");

    const onBookmarkIconButtonClick = useConstCallback(() =>
        onIsBookmarkedValueChange(!isBookmarked),
    );

    const onValueBeingTypedChange = useConstCallback<
        TextFieldProps["onValueBeingTypedChange"]
    >(({ value }) => onFriendlyNameChange(value));

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.aboveDivider}>
                <Text typo="object heading" className={classes.cardTitle}>
                    {t("card title")}
                </Text>
                <div style={{ "flex": 1 }} />

                {onRequestCopyLaunchUrl !== undefined && (
                    <Tooltip title={t("copy url helper text")}>
                        <IconButton iconId="link" onClick={onRequestCopyLaunchUrl} />
                    </Tooltip>
                )}
                <Tooltip title={t("save configuration")}>
                    <IconButton
                        iconId={isBookmarked ? "bookmark" : "bookmarkBorder"}
                        onClick={onBookmarkIconButtonClick}
                    />
                </Tooltip>
            </div>
            <div className={classes.belowDivider}>
                <div className={classes.logoAndTitleWrapper}>
                    {packageIconUrl !== undefined && (
                        <RoundLogo url={packageIconUrl} size="large" />
                    )}
                    <Text typo="object heading" className={classes.title}>
                        {capitalize(packageName)}
                    </Text>
                </div>
                <div className={classes.textFieldAndButtonWrapper}>
                    <TextField
                        label={t("friendly name")}
                        defaultValue={friendlyName}
                        doOnlyValidateInputAfterFistFocusLost={false}
                        selectAllTextOnFocus={true}
                        inputProps_spellCheck={false}
                        onValueBeingTypedChange={onValueBeingTypedChange}
                    />
                    <div style={{ "flex": 1 }} />
                    <Button variant="secondary" onClick={onRequestCancel}>
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onRequestLaunch}
                        className={classes.launchButton}
                        disabled={!isLaunchable}
                    >
                        {t("launch")}
                    </Button>
                </div>
            </div>
        </div>
    );
});

export declare namespace CatalogLauncherMainCard {
    export type I18nScheme = {
        "card title": undefined;
        cancel: undefined;
        launch: undefined;
        "friendly name": undefined;
        "copy url helper text": undefined;
        "save configuration": undefined;
    };
}

const useStyles = makeStyles({ "label": { CatalogLauncherMainCard } })(theme => ({
    "root": {
        "borderRadius": 8,
        "boxShadow": theme.shadows[7],
        "backgroundColor": theme.colors.useCases.surfaces.surface1,
        "display": "flex",
        "flexDirection": "column",
    },
    "aboveDivider": {
        "padding": theme.spacing({ "topBottom": 3, "rightLeft": 4 }),
        "borderBottom": `1px solid ${theme.colors.useCases.typography.textTertiary}`,
        "boxSizing": "border-box",
        "display": "flex",
    },
    "cardTitle": {
        "display": "flex",
        "alignItems": "center",
    },
    "belowDivider": {
        "padding": theme.spacing(4),
        "paddingLeft": theme.spacing(5),
        "paddingTop": theme.spacing(3),
        "flex": 1,
    },
    "logoAndTitleWrapper": {
        "display": "flex",
        "marginBottom": theme.spacing(3),
    },
    "title": {
        "display": "flex",
        "alignItems": "center",
        "marginLeft": theme.spacing(3),
    },
    "textFieldAndButtonWrapper": {
        "display": "flex",
        "alignItems": "center",
    },
    "bellowDividerLeft": {
        "flex": 1,
    },
    "bellowDividerRight": {
        "display": "flex",
        "alignItems": "flex-end",
    },
    "launchButton": {
        "marginLeft": theme.spacing(2),
    },
}));
