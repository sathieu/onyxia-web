import { MyServicesCard } from "app/components/pages/MyServices/MyServicesCards/MyServicesCard/MyServicesCard";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import rstudioImgUrl from "stories/assets/img/rstudio.png";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { MyServicesCard },
    "defaultContainerWidth": 400,
});

export default meta;

export const VueRegular = getStory({
    "packageIconUrl": rstudioImgUrl,
    "friendlyName": "My Rstudio",
    "packageName": "rstudio",
    "openUrl": "https://example.com",
    "monitoringUrl": "https://example.com",
    "startTime": Date.now(),
    "isOvertime": false,
    "isShared": true,
    ...logCallbacks([
        "onRequestDelete",
        "onRequestShowPostInstallInstructions",
        "onRequestShowEnv",
    ]),
});

export const VueStarting = getStory({
    "packageIconUrl": rstudioImgUrl,
    "friendlyName": "My Rstudio",
    "packageName": "rstudio",
    "openUrl": "https://example.com",
    "monitoringUrl": "https://example.com",
    "startTime": undefined,
    "isOvertime": false,
    "isShared": true,
    ...logCallbacks([
        "onRequestDelete",
        "onRequestShowPostInstallInstructions",
        "onRequestShowEnv",
    ]),
});
