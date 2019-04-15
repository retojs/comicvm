import { ComicVM } from "../app/ComicVM";
import * as layoutConfigButtons from "./components/LayoutConfigButtons";
import { Demo } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { Div } from "../common/dom/Div";
import { Scene } from "../app/model/Scene";
import { CoordinatesDisplay } from "./components/CoordinatesDisplay";

export class ComicVmDemo implements Demo {

    name = "ComicVM Demo";
    desc = "This example demonstrates how to setup a ComicVM";

    scene: Scene;

    create(container: DomElementContainer) {

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.scene = comicVM.getScene("animation-demo");
                comicVM.paintScene(this.scene, container);

                layoutConfigButtons.create(container, () => comicVM.repaintScene(true));

                new CoordinatesDisplay(window.document.body);

            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error ? error.message || "" : "");
            throw(error);
        }
    }
}