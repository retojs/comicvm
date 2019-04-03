import { ComicVM } from "../app/ComicVM";
import { Demo } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { Div } from "../common/dom/Div";
import { PanelBoundingBoxViewer } from "./components/PanelBoundingBoxViewer";
import { Scene } from "../app/model/Scene";
import { CoordinatesDisplay } from "./components/CoordinatesDisplay";
import { ComicVmCanvas } from "../app/paint/ComicVmCanvas";
import { Heading } from "../common/dom/Heading";
import { PanelPropertiesEditor } from "./components/PanelPropertiesEditor";

export class BackgroundImageSizeDemo implements Demo {

    name = "Background Image Size Demo";
    desc = "This example demonstrates how the background image size is calculated";

    comicVM: ComicVM;
    scene: Scene;

    panelBBoxViewer: PanelBoundingBoxViewer;
    coordsDisplay: CoordinatesDisplay;
    panelPropertiesEditor: PanelPropertiesEditor;

    comicWidth = 360;
    panelBBoxViewerWidth = 700;

    create(container: DomElementContainer) {

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.comicVM = comicVM;
                this.scene = comicVM.getScene("background-demo");

                const root = new Div(container, "background-image-demo",
                    new Heading(null, 2, "Panel Bounding Box")
                );
                const comicVmCanvas = new ComicVmCanvas(root);
                comicVmCanvas.class = "panel-selection-page";
                comicVmCanvas.setDimensions(
                    this.comicWidth,
                    Math.round(this.comicWidth * Math.sqrt(2))
                );
                comicVM.paintScene(this.scene, comicVmCanvas);

                this.panelBBoxViewer = new PanelBoundingBoxViewer(
                    root,
                    this.panelBBoxViewerWidth,
                    Math.round(this.comicWidth * Math.sqrt(2))
                );

                this.panelPropertiesEditor = new PanelPropertiesEditor(this.panelBBoxViewer,
                    () => {
                        this.scene.executeLayout(comicVmCanvas).setupImages(comicVM.story.images);
                        comicVM.currentScene.executeLayout(comicVmCanvas).setupImages(comicVM.story.images);
                        comicVM.repaintScene();
                        this.panelBBoxViewer.repaint();
                    }
                );

                this.coordsDisplay = new CoordinatesDisplay(window.document.body);

                this.setupPanelSelection();
            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error);
            throw(error);
        }
    }

    setupPanelSelection() {

        this.comicVM.canvas.onClick = (event: MouseEvent) => {
            const mousePos = this.comicVM.canvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);

            //  this.coordsDisplay.setContent(`<div>canvas pos: (${mousePos.x}, ${mousePos.y})</div>`);

            const panel = this.scene.getPanelAtPosition(mousePos);
            if (panel) {
                this.panelPropertiesEditor.setPanel(panel);
                this.panelBBoxViewer.paint(panel);
            }
        };
    }
}