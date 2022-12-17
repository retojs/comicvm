import { DomElementContainer } from "../common/dom/DomElement";
import { LayoutConfig, } from "../app/layout/Layout.config";
import { PaintConfig } from "../app/paint/Paint.config";
import { Div } from "../common/dom/Div";
import { Demo } from "./Demo";
import { ParameterInput } from "./components/ParameterInput";
import { Margin } from "../common/style/Margin";
import { ComicVM } from "../app/ComicVM";
import { DemoContext } from "./DemoContext";

export class BubbleDemo implements Demo {

    name = "Bubble Demo";
    desc = "This Example demonstrated how bubbles are arranged in panels";

    comicVM: ComicVM;

    create(container: DomElementContainer) {
        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                this.comicVM = comicVM;
                this.comicVM.setupScene("bubble-demo", container);

                DemoContext.setupCanvasPositionListeners(comicVM.canvas);

                this.repaint();
            });

        this.createInputs(container);
    }

    repaint() {
        window.requestAnimationFrame(() => {
            this.comicVM.currentScene.executeLayout(this.comicVM.canvas).setupImages(this.comicVM.images);
            this.comicVM.repaintScene();
        });
    }

    createInputs(container: DomElementContainer) {
        const layoutConfig = new LayoutConfig();
        const layoutConfigPanel = new Div(container, "layout-config-panel")
            .appendDiv("title", "LayoutConfig");
        const paintConfigPanel = new Div(container, "paint-config-panel")
            .appendDiv("title", "PaintConfig");

        ParameterInput.createMarginConfigInput(layoutConfigPanel, "page.padding", layoutConfig.page.padding, (value: Margin) => {
            layoutConfig.page.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "panel.margin", layoutConfig.panel.margin, (value: Margin) => {
            layoutConfig.panel.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "panel.padding", layoutConfig.panel.padding, (value: Margin) => {
            layoutConfig.panel.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.margin", layoutConfig.bubble.margin, (value: Margin) => {
            layoutConfig.bubble.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.padding", layoutConfig.bubble.padding, (value: Margin) => {
            layoutConfig.bubble.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.radius", layoutConfig.bubble.radius, (value: Margin) => {
            layoutConfig.bubble.radius = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.maxWithPerHeight", layoutConfig.bubble.maxWithPerHeight, (value: number) => {
            layoutConfig.bubble.maxWithPerHeight = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.verticalAlign", layoutConfig.bubble.verticalAlign, (value: number) => {
            layoutConfig.bubble.verticalAlign = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.bubbleEndsDistance", layoutConfig.bubble.pointer.bubbleEndsDistance, (value: number) => {
            layoutConfig.bubble.pointer.bubbleEndsDistance = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.characterEndDistance", layoutConfig.bubble.pointer.characterEndDistance, (value: number) => {
            layoutConfig.bubble.pointer.characterEndDistance = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPoint.width", layoutConfig.bubble.pointer.controlPoint.width, (value: number) => {
            layoutConfig.bubble.pointer.controlPoint.width = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPoint.horizontalOffset", layoutConfig.bubble.pointer.controlPoint.horizontalOffset, (value: number) => {
            layoutConfig.bubble.pointer.controlPoint.horizontalOffset = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPoint.verticalOffset", layoutConfig.bubble.pointer.controlPoint.verticalOffset, (value: number) => {
            layoutConfig.bubble.pointer.controlPoint.verticalOffset = value;
            this.repaint();
        });

        // Paint config

        ParameterInput.createNumberInput(paintConfigPanel, "PaintConfig.of.panel.border.lineWidth", PaintConfig.of.panel.border.lineWidth, (value: number) => {
            PaintConfig.of.panel.border.lineWidth = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(paintConfigPanel, "PaintConfig.of.bubble.textBox.lineWidth", PaintConfig.of.bubble.textBox.lineWidth, (value: number) => {
            PaintConfig.of.bubble.textBox.lineWidth = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(paintConfigPanel, "PaintConfig.of.bubble.pointer.lineWidth", PaintConfig.of.bubble.pointer.lineWidth, (value: number) => {
            PaintConfig.of.bubble.pointer.lineWidth = value;
            this.repaint();
        });
    }
}


