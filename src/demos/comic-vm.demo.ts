import { ComicVM } from "../app/ComicVM";
import * as layoutConfigButtons from "./components/LayoutConfigButtons";
import { Demo } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { Div } from "../common/dom/Div";
import { DemoContext } from "./DemoContext";

export class ComicVmDemo implements Demo {

    name = "ComicVM Demo";
    desc = "This example demonstrates how to setup a ComicVM";

    comicVM: ComicVM;

    create(container: DomElementContainer) {

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.comicVM = comicVM;
                this.comicVM.setupScene("animation-demo", container);
                this.repaint();

                DemoContext.setupCanvasPositionListeners(comicVM.canvas);

                layoutConfigButtons.create(container, this.repaint.bind(this));
            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error ? error.message || "" : "");
            throw(error);
        }
    }

    repaint() {
        window.requestAnimationFrame(() => {
            this.comicVM.currentScene.executeLayout(this.comicVM.canvas).setupImages(this.comicVM.images);
            this.comicVM.repaintScene();
        });
    }
}