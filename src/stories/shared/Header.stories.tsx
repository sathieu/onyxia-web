import { useEffect, useState } from "react";
import { Header } from "app/components/shared/Header";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import { sectionName } from "./sectionName";
import { css } from "tss-react/@emotion/css";

const defaultWidth = 1200;

function useIsCloudShellVisible() {
    const [isCloudShellVisible, setIsCloudShellVisible] = useState(false);

    useEffect(() => {
        console.log(`isCloudShellVisible set to ${isCloudShellVisible}`);
    }, [isCloudShellVisible]);

    return { isCloudShellVisible, setIsCloudShellVisible };
}

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Header },
    "defaultWidth": defaultWidth,
});

export default meta;

const propsCommon = {
    "className": css({ "height": 64, "paddingRight": (defaultWidth * 2) / 100 }),
    "logoContainerWidth": (defaultWidth * 4) / 100,
    ...logCallbacks(["onLogoClick"]),
};

const propCoreAppCommon = {
    ...propsCommon,
    "isUserLoggedIn": true,
    "useCase": "core app",
    useIsCloudShellVisible,
} as const;

export const VueUserLoggedIn = getStory({
    ...propCoreAppCommon,
    "isUserLoggedIn": true,
    ...logCallbacks(["onLogoutClick", "onSelectedProjectChange"]),
    "projects": [
        {
            "id": "project1",
            "name": "Project 1",
        },
        {
            "id": "project2",
            "name": "Project 2",
        },
        {
            "id": "project3",
            "name": "Project 3",
        },
    ],
    "selectedProjectId": "project2",
});

export const VueUserNotLoggedIn = getStory({
    ...propCoreAppCommon,
    "isUserLoggedIn": false,
    ...logCallbacks(["onLoginClick"]),
});

export const LoginPage = getStory({
    ...propsCommon,
    "useCase": "login pages",
});
