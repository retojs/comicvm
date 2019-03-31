import { ScenePainter } from "../app/paint/ScenePainter";
import { Canvas } from "../app/dom/Canvas";
import { Scene } from "../app/model/Scene";
import { DomElementContainer } from "../app/dom/DomElement";
import { ParameterInput } from "./parameter-input/parameter-input";
import { LayoutConfig, MarginConfig } from "../app/layout/Layout.config";
import { PaintConfig } from "../app/paint/Paint.config";
import { Div } from "../app/dom/Div";
import { ComicVmCanvas } from "../app/paint/ComicVmCanvas";
import { Demo } from "./Demo";

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

        ParameterInput.createMarginConfigInput(layoutConfigPanel, "page.padding", LayoutConfig.page.padding, (value: MarginConfig) => {
            LayoutConfig.page.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "panel.margin", LayoutConfig.panel.margin, (value: MarginConfig) => {
            LayoutConfig.panel.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "panel.padding", LayoutConfig.panel.padding, (value: MarginConfig) => {
            LayoutConfig.panel.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.margin", LayoutConfig.bubble.margin, (value: MarginConfig) => {
            LayoutConfig.bubble.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.padding", LayoutConfig.bubble.padding, (value: MarginConfig) => {
            LayoutConfig.bubble.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(layoutConfigPanel, "bubble.radius", LayoutConfig.bubble.radius, (value: MarginConfig) => {
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
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.widthNearBubble", LayoutConfig.bubble.pointer.widthNearBubble, (value: number) => {
            LayoutConfig.bubble.pointer.widthNearBubble = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPointWidth", LayoutConfig.bubble.pointer.controlPointWidth, (value: number) => {
            LayoutConfig.bubble.pointer.controlPointWidth = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.controlPointVerticalPosition", LayoutConfig.bubble.pointer.controlPointVerticalPosition, (value: number) => {
            LayoutConfig.bubble.pointer.controlPointVerticalPosition = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.verticalDistanceFromCharacter", LayoutConfig.bubble.pointer.verticalDistanceFromCharacter, (value: number) => {
            LayoutConfig.bubble.pointer.verticalDistanceFromCharacter = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(layoutConfigPanel, "bubble.pointer.horizontalDistanceFromBubbleCenter", LayoutConfig.bubble.pointer.horizontalDistanceFromBubbleCenter, (value: number) => {
            LayoutConfig.bubble.pointer.horizontalDistanceFromBubbleCenter = value;
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


