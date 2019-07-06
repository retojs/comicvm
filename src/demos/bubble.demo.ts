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
        const layoutConfigPanel = new Div(container, "layout-config-panel")
            .appendDiv("title", "LayoutConfig");
        const paintConfigPanel = new Div(container, "paint-config-panel")
            .appendDiv("title", "PaintConfig");

        ParameterInput.createMarginConfigInput(layoutConfigPanel, "page.padding", LayoutConfig.page.padding, (value: Margin) => {
            LayoutConfig.page.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "panel.margin", LayoutConfig.panel.margin, (value: Margin) => {
            LayoutConfig.panel.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "panel.padding", LayoutConfig.panel.padding, (value: Margin) => {
            LayoutConfig.panel.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.margin", LayoutConfig.bubble.margin, (value: Margin) => {
            LayoutConfig.bubble.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.padding", LayoutConfig.bubble.padding, (value: Margin) => {
            LayoutConfig.bubble.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.radius", LayoutConfig.bubble.radius, (value: Margin) => {
            LayoutConfig.bubble.radius = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.maxWithPerHeight", LayoutConfig.bubble.maxWithPerHeight, (value: number) => {
            LayoutConfig.bubble.maxWithPerHeight = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.verticalAlign", LayoutConfig.bubble.verticalAlign, (value: number) => {
            LayoutConfig.bubble.verticalAlign = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.bubbleEndsDistance", LayoutConfig.bubble.pointer.bubbleEndsDistance, (value: number) => {
            LayoutConfig.bubble.pointer.bubbleEndsDistance = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.characterEndDistance", LayoutConfig.bubble.pointer.characterEndDistance, (value: number) => {
            LayoutConfig.bubble.pointer.characterEndDistance = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPoint.width", LayoutConfig.bubble.pointer.controlPoint.width, (value: number) => {
            LayoutConfig.bubble.pointer.controlPoint.width = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPoint.horizontalOffset", LayoutConfig.bubble.pointer.controlPoint.horizontalOffset, (value: number) => {
            LayoutConfig.bubble.pointer.controlPoint.horizontalOffset = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPoint.verticalOffset", LayoutConfig.bubble.pointer.controlPoint.verticalOffset, (value: number) => {
            LayoutConfig.bubble.pointer.controlPoint.verticalOffset = value;
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


