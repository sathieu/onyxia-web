import { MyServicesCards, Props } from "app/components/pages/MyServices/MyServicesCards";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/getStory";
import rstudioImgUrl from "stories/assets/img/rstudio.png";
import { css } from "tss-react/@emotion/css";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { MyServicesCards },
});

export default meta;

const url = "https://example.com";

const props: Props = {
    "className": css({ "width": 300 }),
    "cards": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => ({
        "serviceId": `rstudio-${i}`,
        "packageIconUrl": rstudioImgUrl,
        "friendlyName": "My RStudio",
        "packageName": "rstudio",
        "infoUrl": url,
        "openUrl": url + "/" + i,
        "monitoringUrl": url,
        "startTime": Date.now(),
        "isOvertime": false,
        "postInstallInstructions":
            i % 3 === 0 ? `Post install instruction ${i}` : undefined,
        "isShared": i % 2 === 0,
        "env": {
            "foo": "foo value",
            "bar": "bar value",
            "baz": "baz value",
        },
        "isOwned": i % 3 === 0,
    })),
    "catalogExplorerLink": { "href": url, "onClick": () => {} },
    ...logCallbacks(["onRequestDelete"]),
};

export const VueDefault = getStory({
    ...props,
    "className": css({ "width": 950, "height": 300 }),
});
