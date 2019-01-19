import { LayoutConfig, PanelConfig, StripConfig } from "../LayoutConfig";
import { PlotItem, STORY_TELLER } from "../../plot/PlotItem";
import { Scene } from "../../model/Scene";
import { Page } from "../../model/Page";
import { Strip } from "../../model/Strip";
import { Panel } from "../../model/Panel";
import { Rectangle } from "../../trigo/Rectangle";
import { Canvas } from "../../dom/Canvas";
import { TextLayoutEngine } from "./TextLayoutEngine";
import { CharacterLayoutEngine } from "./CharacterLayoutEngine";

export class LayoutEngine {

    scene: Scene;

    textLayoutEngine: TextLayoutEngine;
    characterLayoutEngine: CharacterLayoutEngine;

    constructor(scene: Scene, canvas: Canvas) {
        this.scene = scene;
        this.scene.characters = scene.plot.characters.filter(ch => ch !== STORY_TELLER);

        this.textLayoutEngine = new TextLayoutEngine(canvas);
        this.characterLayoutEngine = new CharacterLayoutEngine();
    }

    static layoutScene(scene: Scene, canvas: Canvas): LayoutEngine {
        return new LayoutEngine(scene, canvas).assignPlotItems(scene.plot.plotItems).layout();
    }

    /**
     * Distributes the plot items into the panels
     */
    assignPlotItems(plotItems: PlotItem[]): LayoutEngine {

        let plotItemIndex = 0;
        this.scene.panels.forEach(panel => {
            panel.setPlotItems(plotItems.slice(plotItemIndex, plotItemIndex + panel.layoutProperties.plotItemCount));
            plotItemIndex += panel.layoutProperties.plotItemCount;
        });

        return this;
    }

    layout(): LayoutEngine {

        if (this.scene && this.scene.pages) {
            this.scene.pages.forEach(page => this.layoutPage(page));
        }
        this.textLayoutEngine.layout(this.scene.panels);

        return this;
    }

    layoutPage(page: Page) {

        page.shape = new Rectangle(
            0,
            page.index * LayoutConfig.page.height,
            LayoutConfig.page.width,
            LayoutConfig.page.height
        );

        if (!(page.stripConfig && page.stripConfig.hasProportions)) {
            page.stripConfig = StripConfig.createDefault(page.strips.length);
        }
        page.strips.forEach(strip => this.layoutStrip(strip, page.stripConfig));
    }

    layoutStrip(strip: Strip, stripConfig: StripConfig) {
        let x: number = LayoutConfig.page.padding.left,
            y: number = strip.page.shape.y + LayoutConfig.page.padding.top + LayoutConfig.page.innerHeight * stripConfig.getSum(strip.index),
            width: number = LayoutConfig.page.innerWidth,
            height: number = LayoutConfig.page.innerHeight * stripConfig.proportions[strip.index];

        strip.shape = new Rectangle(x, y, width, height);

        if (!(strip.panelConfig && strip.panelConfig.hasProportions)) {
            strip.panelConfig = PanelConfig.createDefault(strip.panels.length);
        }
        strip.panels.forEach(panel => this.layoutPanel(panel, strip.panelConfig));
    }

    layoutPanel(panel: Panel, panelConfig: PanelConfig) {

        let x: number = panel.strip.shape.x + panel.strip.shape.width * panelConfig.getSum(panel.index),
            y: number = panel.strip.shape.y,
            width: number = panel.strip.shape.width * panelConfig.proportions[panel.index],
            height: number = panel.strip.shape.height;

        x += panelConfig.margin.left;
        y += panelConfig.margin.top;
        width -= panelConfig.margin.horizontal;
        height -= panelConfig.margin.vertical;

        panel.shape = new Rectangle(x, y, width, height);

        this.characterLayoutEngine.layoutCharacters(panel);
    }
}