import { ComicVM } from "../app/ComicVM";
import * as layoutConfigButtons from "./components/LayoutConfigButtons";
import { Demo } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { Div } from "../common/dom/Div";
import { CoordinatesDisplay } from "./components/CoordinatesDisplay";
import { PaintConfigMode, setPaintConfig } from "../app/paint/Paint.config";

export class ComicVmGuideDemo implements Demo {

    name = "ComicVM Guide";
    desc = "Learn what you can do with this Comic VM";

    comicVM: ComicVM;

    create(container: DomElementContainer) {

        setPaintConfig(PaintConfigMode.Final);

        ComicVM.loadStory("comic-vm-guide")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.comicVM = comicVM;
                this.comicVM.setupScene("1_introduction", container);
                this.repaint();

                layoutConfigButtons.create(container, this.repaint.bind(this));

                new CoordinatesDisplay(window.document.body);
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