import { ScenePainter } from "../app/paint/ScenePainter";
import { Canvas } from "../app/dom/Canvas";
import { Scene } from "../app/model/Scene";
import { DomElementContainer } from "../app/dom/DomElement";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, Demo } from "./Demo";
import { ParameterInput } from "./parameter-input/parameter-input";
import { LayoutConfig, MarginConfig } from "../app/layout/Layout.config";

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

    scenePainter: ScenePainter;

    create(container: DomElementContainer) {

        const canvas = new Canvas(
            container,
            DEFAULT_CANVAS_WIDTH,
            DEFAULT_CANVAS_HEIGHT
        );

        this.scenePainter = ScenePainter.paintScene(
            new Scene("Mickey", layout, plot).setup(canvas),
            canvas
        );

        this.createInputs(container);
    }

    createInputs(container: DomElementContainer) {
        const inputPanel = ParameterInput.createInputPanel(container);

        ParameterInput.createMarginConfigInput(inputPanel, "page.padding", LayoutConfig.page.padding, (value: MarginConfig) => {
            LayoutConfig.page.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(inputPanel, "panel.margin", LayoutConfig.panel.margin, (value: MarginConfig) => {
            LayoutConfig.panel.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(inputPanel, "panel.padding", LayoutConfig.panel.padding, (value: MarginConfig) => {
            LayoutConfig.panel.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(inputPanel, "bubble.margin", LayoutConfig.bubble.margin, (value: MarginConfig) => {
            LayoutConfig.bubble.margin = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(inputPanel, "bubble.padding", LayoutConfig.bubble.padding, (value: MarginConfig) => {
            LayoutConfig.bubble.padding = value;
            this.repaint();
        });
        ParameterInput.createMarginConfigInput(inputPanel, "bubble.radius", LayoutConfig.bubble.radius, (value: MarginConfig) => {
            LayoutConfig.bubble.radius = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.maxWithPerHeight", LayoutConfig.bubble.maxWithPerHeight, (value: number) => {
            LayoutConfig.bubble.maxWithPerHeight = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.verticalAlign", LayoutConfig.bubble.verticalAlign, (value: number) => {
            LayoutConfig.bubble.verticalAlign = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.pointer.widthNearBubble", LayoutConfig.bubble.pointer.widthNearBubble, (value: number) => {
            LayoutConfig.bubble.pointer.widthNearBubble = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.pointer.controlPointWidth", LayoutConfig.bubble.pointer.controlPointWidth, (value: number) => {
            LayoutConfig.bubble.pointer.controlPointWidth = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.pointer.controlPointVerticalPosition", LayoutConfig.bubble.pointer.controlPointVerticalPosition, (value: number) => {
            LayoutConfig.bubble.pointer.controlPointVerticalPosition = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.pointer.verticalDistanceFromCharacter", LayoutConfig.bubble.pointer.verticalDistanceFromCharacter, (value: number) => {
            LayoutConfig.bubble.pointer.verticalDistanceFromCharacter = value;
            this.repaint();
        });
        ParameterInput.createNumberInput(inputPanel, "bubble.pointer.horizontalDistanceFromBubbleCenter", LayoutConfig.bubble.pointer.horizontalDistanceFromBubbleCenter, (value: number) => {
            LayoutConfig.bubble.pointer.horizontalDistanceFromBubbleCenter = value;
            this.repaint();
        });

    }

    repaint() {
        window.requestAnimationFrame(() => {
            this.scenePainter.repaintScene();
        });
    }
}


