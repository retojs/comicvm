import * as LayoutConfigButtons from "./components/LayoutConfigButtons";
import { DomElementContainer } from "../common/dom/DomElement";
import { Demo } from "./Demo";
import { ComicVM } from "../app/ComicVM";

export class CharacterPositionDemo implements Demo {

    name = "Character Position Demo";
    desc = "This example demonstrates how character positions can be configured for the whole scene, a background or a panel";

    comicVM: ComicVM;

    create(container: DomElementContainer) {
        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.comicVM = comicVM;
                this.comicVM.setupScene("character-position-demo", container);

                LayoutConfigButtons.create(container, this.repaintScene.bind(this));

                this.repaintScene();
            });
    }

    repaintScene() {
        window.requestAnimationFrame(() => {
            this.comicVM.currentScene.executeLayout(this.comicVM.canvas).setupImages(this.comicVM.images);
            this.comicVM.repaintScene();
        });
    }
}