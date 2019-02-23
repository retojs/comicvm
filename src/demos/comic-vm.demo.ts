import { ComicVM } from "../app/ComicVM";
import * as layoutConfigButtons from "./layout-config-buttons";
import { Demo } from "./Demo";
import { DomElementContainer } from "../app/dom/DomElement";
import { Div } from "../app/dom/Div";

export class ComicVmDemo implements Demo {

    name = "ComicVM Demo";
    desc = "This example demonstrates how to setup a ComicVM";

    create(container: DomElementContainer) {

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                comicVM.paintScene(comicVM.getScene("background-demo"), container);

                layoutConfigButtons.create(container, comicVM.repaintScene.bind(comicVM));
            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error);
            throw(error);
        }
    }
}