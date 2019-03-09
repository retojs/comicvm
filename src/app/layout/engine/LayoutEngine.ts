import { LayoutConfig, PanelWidthsConfig, StripHeightsConfig } from "../Layout.config";
import { PlotItem, STORY_TELLER } from "../../plot/PlotItem";
import { Scene } from "../../model/Scene";
import { Page } from "../../model/Page";
import { Strip } from "../../model/Strip";
import { Panel } from "../../model/Panel";
import { Rectangle } from "../../trigo/Rectangle";
import { Canvas } from "../../dom/Canvas";
import { BubbleLayoutEngine } from "./BubbleLayoutEngine";
import { CharacterLayoutEngine } from "./CharacterLayoutEngine";

export class LayoutEngine {

    scene: Scene;

    bubbleLayoutEngine: BubbleLayoutEngine;
    characterLayoutEngine: CharacterLayoutEngine;

    constructor(scene: Scene) {
        this.scene = scene;

        if (this.scene.layoutProperties.characters) {
            this.scene.characters = this.scene.layoutProperties.characters;
        } else {
            this.scene.characters = scene.plot.characters.filter(ch => ch !== STORY_TELLER);
        }

        this.bubbleLayoutEngine = new BubbleLayoutEngine();
        this.characterLayoutEngine = new CharacterLayoutEngine();
    }

    static layoutScene(scene: Scene, canvas: Canvas): LayoutEngine {
        return new LayoutEngine(scene).assignPlotItems(scene.plot.plotItems).layout(canvas);
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

    layout(canvas: Canvas): LayoutEngine {

        if (this.scene && this.scene.pages) {
            this.scene.pages.forEach(page => this.layoutPage(page));
        }
        this.bubbleLayoutEngine.layout(this.scene.panels, canvas);

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
            page.stripConfig = StripHeightsConfig.createDefault(page.strips.length);
        }
        page.strips.forEach(strip => this.layoutStrip(strip, page.stripConfig));
    }

    layoutStrip(strip: Strip, stripConfig: StripHeightsConfig) {
        let x: number = LayoutConfig.page.padding.left,
            y: number = strip.page.shape.y + LayoutConfig.page.padding.top + LayoutConfig.page.innerHeight * stripConfig.getSum(strip.index),
            width: number = LayoutConfig.page.innerWidth,
            height: number = LayoutConfig.page.innerHeight * stripConfig.proportions[strip.index];

        strip.shape = new Rectangle(x, y, width, height);

        if (!(strip.panelConfig && strip.panelConfig.hasProportions)) {
            strip.panelConfig = PanelWidthsConfig.createDefault(strip.panels.length);
        }
        strip.panels.forEach(panel => this.layoutPanel(panel, strip.panelConfig));
    }

    layoutPanel(panel: Panel, panelConfig: PanelWidthsConfig) {
        const proportionPreviousPanels = panelConfig.getSum(panel.index);
        const proportionThisPanel = panelConfig.proportions[panel.index] || panelConfig.remainder;

        let x: number = panel.strip.shape.x + panel.strip.shape.width * proportionPreviousPanels,
            y: number = panel.strip.shape.y,
            width: number = panel.strip.shape.width * proportionThisPanel,
            height: number = panel.strip.shape.height;

        x += LayoutConfig.panel.margin.left;
        y += LayoutConfig.panel.margin.top;
        width -= LayoutConfig.panel.margin.horizontal;
        height -= LayoutConfig.panel.margin.vertical;

        if (width < 0 && height < 0) {
            console.error("Can not layout", panel.toString());
            return;
        }
        panel.shape = new Rectangle(x, y, width, height);

        this.characterLayoutEngine.layoutCharacters(panel);
    }
}