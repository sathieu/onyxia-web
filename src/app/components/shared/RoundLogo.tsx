import { memo } from "react";
import Avatar from "@mui/material/Avatar";
import { ReactComponent as FallbackSvg } from "app/assets/svg/singlePackage.svg";
import { makeStyles } from "app/theme";
import type { IconSizeName } from "onyxia-ui";

export type RoundLogoProps = {
    className?: string;
    url: string | undefined;
    size?: IconSizeName;
};

export const RoundLogo = memo((props: RoundLogoProps) => {
    const { url, size = "default", className } = props;

    const { classes, cx } = useStyles({ "iconSizeName": size });

    return (
        <Avatar src={url} className={cx(classes.root, className)}>
            <FallbackSvg className={classes.fallback} />
        </Avatar>
    );
});

const useStyles = makeStyles<{ iconSizeName: IconSizeName }>({
    "label": { RoundLogo },
})((theme, { iconSizeName }) => ({
    "fallback": {
        "fill": theme.colors.useCases.typography.textPrimary,
    },
    "root": {
        ...(() => {
            const size = theme.iconSizesInPxByName[iconSizeName];

            return {
                "width": size,
                "height": size,
            };
        })(),
    },
}));
