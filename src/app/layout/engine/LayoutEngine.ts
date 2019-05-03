import { LayoutConfig, PanelWidthsConfig, StripHeightsConfig } from "../Layout.config";
import { PlotItem } from "../../plot/PlotItem";
import { Scene } from "../../model/Scene";
import { Page } from "../../model/Page";
import { Strip } from "../../model/Strip";
import { Panel } from "../../model/Panel";
import { Rectangle } from "../../../common/trigo/Rectangle";
import { Canvas } from "../../../common/dom/Canvas";
import { BubbleLayoutEngine } from "./BubbleLayoutEngine";
import { CharacterLayoutEngine } from "./CharacterLayoutEngine";
import { validatePageShape, validatePanelShape, validateStripShape } from "./validation";

export class LayoutEngine {

    scene: Scene;

    bubbleLayoutEngine: BubbleLayoutEngine;
    characterLayoutEngine: CharacterLayoutEngine;

    constructor(scene: Scene) {
        this.scene = scene;
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
            panel.setPlotItems(plotItems.slice(plotItemIndex, plotItemIndex + panel.layout.plotItemCount));
            plotItemIndex += panel.layout.plotItemCount;
        });

        return this;
    }

    layout(canvas: Canvas): LayoutEngine {

        if (this.scene && this.scene.pages) {
            this.scene.pages.forEach(page => this.layoutPage(page));
        }
        this.layoutPanelsContent(this.scene.panels, canvas);

        return this;
    }

    layoutPage(page: Page) {

        page.shape = new Rectangle(
            0,
            page.index * LayoutConfig.page.height,
            LayoutConfig.page.width,
            LayoutConfig.page.height
        );

        validatePageShape(page);

        if (!(page.stripHeightsConfig && page.stripHeightsConfig.hasProportions)) {
            page.stripHeightsConfig = StripHeightsConfig.createDefault(page.strips.length);
        }
        page.strips.forEach(strip => this.layoutStrip(strip, page.stripHeightsConfig));
    }

    layoutStrip(strip: Strip, stripConfig: StripHeightsConfig) {
        let x: number = LayoutConfig.page.padding.left,
            y: number = strip.page.shape.y + LayoutConfig.page.padding.top + LayoutConfig.page.innerHeight * stripConfig.getSum(strip.index),
            width: number = LayoutConfig.page.innerWidth,
            height: number = LayoutConfig.page.innerHeight * stripConfig.proportions[strip.index];

        strip.shape = new Rectangle(x, y, width, height);

        validateStripShape(strip);

        if (!(strip.panelWidthsConfig && strip.panelWidthsConfig.hasProportions)) {
            strip.panelWidthsConfig = PanelWidthsConfig.createDefault(strip.panels.length);
        }
        strip.panels.forEach(panel => this.layoutPanelShape(panel, strip.panelWidthsConfig));
    }

    layoutPanelShape(panel: Panel, panelConfig: PanelWidthsConfig) {
        const proportionPreviousPanels = panelConfig.getSum(panel.stripIndex);
        const proportionThisPanel = panelConfig.proportions[panel.stripIndex] || panelConfig.remainder;

        let x: number = panel.strip.shape.x + panel.strip.shape.width * proportionPreviousPanels,
            y: number = panel.strip.shape.y,
            width: number = panel.strip.shape.width * proportionThisPanel,
            height: number = panel.strip.shape.height;

        x += LayoutConfig.panel.margin.left;
        y += LayoutConfig.panel.margin.top;
        width -= LayoutConfig.panel.margin.horizontal;
        height -= LayoutConfig.panel.margin.vertical;

        panel.shape = new Rectangle(x, y, width, height);

        validatePanelShape(panel);
    }

    layoutPanelsContent(panels: Panel[], canvas: Canvas) {
        this.characterLayoutEngine.layout(this.scene.panels);
        this.bubbleLayoutEngine.layout(this.scene.panels, canvas);
    }

    layoutPanelContent(panel: Panel, canvas: Canvas) {
        this.characterLayoutEngine.layoutCharacters(panel);
        this.bubbleLayoutEngine.layoutPanel(panel, canvas);
    }
}