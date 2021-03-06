import { ComicVM } from "../app/ComicVM";
import { Demo } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { Div } from "../common/dom/Div";
import { PanelBoundingBoxViewer } from "./components/PanelBoundingBoxViewer";
import { ComicVmCanvas } from "../app/paint/ComicVmCanvas";
import { Heading } from "../common/dom/Heading";
import { PanelPropertiesEditor } from "./components/PanelPropertiesEditor";
import { Panel } from "../app/model/Panel";
import { PaintStyleConfig } from "../common/style/PaintStyle";
import { PageConfig } from "../app/layout/Layout.config";
import { DemoContext } from "./DemoContext";

const SELECTED_PANEL_BORDER = PaintStyleConfig.stroke("teal", 16);

export class BackgroundImageSizeDemo implements Demo {

    name = "Background Image Size Demo";
    desc = "This example demonstrates how the background image size is calculated";

    comicVM: ComicVM;

    selectedPanel: Panel;

    root: Div;
    panelBBoxViewer: PanelBoundingBoxViewer;
    panelPropertiesEditor: PanelPropertiesEditor;

    comicWidth = 360;
    panelBBoxViewerWidth = 840;

    create(container: DomElementContainer) {

        this.root = new Div(container, "background-image-demo",
            new Heading(null, 2, "Panel Bounding Box")
        );

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.comicVM = comicVM;
                this.comicVM.setCurrentScene("animation-demo");

                this.setupPanelSelection();

                this.panelBBoxViewer = new PanelBoundingBoxViewer(
                    this.root,
                    this.panelBBoxViewerWidth,
                    Math.round(this.comicWidth * PageConfig.proportion)
                );

                DemoContext.setupCanvasPositionListeners(this.panelBBoxViewer.canvas);

                this.panelPropertiesEditor = new PanelPropertiesEditor(this.panelBBoxViewer,
                    () => {
                        this.repaintPanelSelection();
                        this.panelBBoxViewer.paint();
                    }
                );

                this.selectPanel(this.comicVM.currentScene.panels[0]);
            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error ? error.message || "" : "");
            throw(error);
        }
    }

    setupPanelSelection() {
        const panelSelectionCanvas = new ComicVmCanvas(this.root, this.comicVM.currentScene);
        panelSelectionCanvas.class = "panel-selection-page";
        panelSelectionCanvas.setDimensions(
            this.comicWidth,
            Math.round(this.comicWidth * PageConfig.proportion)
        );
        this.comicVM.paintCurrentScene(panelSelectionCanvas);

        this.setupPanelSelectionListeners();

        panelSelectionCanvas.domElement.focus();
    }

    setupPanelSelectionListeners() {
        this.comicVM.canvas.onClick = (event: MouseEvent) => {
            const mousePos = this.comicVM.canvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);
            this.selectPanel(this.comicVM.currentScene.getPanelAtPosition(mousePos));
        };

        // select next / previous panel hitting space / shift-space
        window.document.body.onkeydown = (event: KeyboardEvent) => {
            if (event.key === " ") {
                event.preventDefault();
                const panels = this.selectedPanel.scene.panels;
                if (event.shiftKey || event.ctrlKey) {
                    this.selectPanel(panels[(this.selectedPanel.sceneIndex + panels.length - 2) % panels.length]);
                } else {
                    this.selectPanel(panels[this.selectedPanel.sceneIndex % panels.length]);
                }
            }
        };
    }

    selectPanel(panel: Panel) {
        if (panel) {
            this.selectedPanel = panel;
            this.panelPropertiesEditor.setPanel(this.selectedPanel);
            this.panelBBoxViewer.setPanel(this.selectedPanel);
            this.panelBBoxViewer.paint();
            this.repaintPanelSelection();
        }
    }

    highlightSelectedPanel() {
        this.comicVM.canvas.rect(this.selectedPanel.shape, SELECTED_PANEL_BORDER);
    }

    repaintPanelSelection() {
        window.requestAnimationFrame(() => {
            this.comicVM.currentScene.executeLayout(this.comicVM.canvas).setupImages(this.comicVM.images);
            this.comicVM.repaintScene();
            this.highlightSelectedPanel();
        });
    }
}
