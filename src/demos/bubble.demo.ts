import { ScenePainter } from "../app/paint/ScenePainter";
import { Canvas } from "../common/dom/Canvas";
import { Scene } from "../app/model/Scene";
import { DomElementContainer } from "../common/dom/DomElement";
import { LayoutConfig, } from "../app/layout/Layout.config";
import { PaintConfig } from "../app/paint/Paint.config";
import { Div } from "../common/dom/Div";
import { ComicVmCanvas } from "../app/paint/ComicVmCanvas";
import { Demo } from "./Demo";
import { ParameterInput } from "./components/ParameterInput";
import { Margin } from "../common/style/Margin";

const plot = `
Title: Character Position Test

Characters: Mickey, Minnie, Goofy

Place: Duckburgh
_____
Plot:

Mickey to Goofy:
    Hey Goofy
Goofy to Mickey:
    Hey Mickey
Mickey to Goofy:
    Are you alright, Goofy? 
Goofy to Mickey:
    Sure, Mickey, why are you asking?
Mickey to Goofy:
    It's just...
Minnie to Goofy: 
    You look like shit, Goofy!
Goofy to Minnie:
    I can't believe you just said that. 
Mickey to Goofy:
    She didn't mean to be rude.
    But you look aweful.
    When was the last time you slept?
Goofy to Mickey:
    Hmm... Tuesday?
Mickey to Goofy:
    What?!
    It's Friday now.
Minnie to Goofy:
    What the fuck happened?! 
`;


const layout = `
---
panelProperties: [plotItemCount]
pages:
  # page 1
  - stripHeights: [0.4, 0.3, 0.3] 
    strips:
      # upper strip
      - panels:
          - [2]
          - [2]
      # middle strip
      - panelWidths: [0.35, 0.3, 0.35]
        panels:
          - [2]
          - [1]
          - [2]
      # lower strip
      - panels:
          - [3]
          - [3]
scene:
  pan: [0, 1]
`;


export class BubbleDemo implements Demo {

    name = "Bubble Demo";
    desc = "This Example demonstrated how bubbles are arranged in panels";

    canvas: Canvas;
    scene: Scene;
    scenePainter: ScenePainter;

    create(container: DomElementContainer) {
        this.canvas = new ComicVmCanvas(container);
        this.scene = new Scene("Mickey", layout, plot).setup(this.canvas);
        this.scenePainter = ScenePainter.paintScene(this.scene, this.canvas);

        this.createInputs(container);
    }

    repaint() {
        window.requestAnimationFrame(() => {
            this.scene.setup(this.canvas);
            this.scenePainter.paintScene();
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


