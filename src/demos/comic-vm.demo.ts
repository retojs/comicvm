import { ComicVM } from "../app/ComicVM";
import * as layoutConfigButtons from "./layout-config-buttons";
import { Demo, DEMO_DEFAULT_WIDTH } from "./Demo";
import { DomElementContainer } from "../app/dom/DomElement";
import { Div } from "../app/dom/Div";
import { PanelBoundingBoxViewer } from "../app/components/PanelBoundingBoxViewer";
import { Scene } from "../app/model/Scene";
import { CoordinatesDisplay } from "../app/components/CoordinatesDisplay";

export class ComicVmDemo implements Demo {

    name = "ComicVM Demo";
    desc = "This example demonstrates how to setup a ComicVM";

    scene: Scene;

    create(container: DomElementContainer) {

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.scene = comicVM.getScene("background-demo");
                comicVM.paintScene(this.scene, container);

                layoutConfigButtons.create(container, comicVM.repaintScene.bind(comicVM));

                const panelBBox = new PanelBoundingBoxViewer(container, DEMO_DEFAULT_WIDTH, 500);

                comicVM.canvas.onClick = (event: MouseEvent) => {
                    const mousePos = comicVM.canvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);
                    const panel = this.scene.getPanelAtPosition(mousePos);
                    if (panel) {
                        panelBBox.paintBackgroundsPanelBBox(panel);
                    }
                };

                new CoordinatesDisplay(window.document.body);

            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error);
            throw(error);
        }
    }
}