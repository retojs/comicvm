import { Page } from "../model/Page";
import { Panel } from "../model/Panel";
import { Rectangle } from "../trigo/Rectangle";
import { LayoutConfig, PanelConfig, StripConfig } from "./LayoutConfig";
import { Strip } from "../model/Strip";
import { LayoutParser } from "./LayoutParser";
import { Scene } from "../model/Scene";
import { PlotItem } from "../plot/PlotItem";
import { Plot } from "../plot/Plot";

export class LayoutEngine {

    constructor(private layoutParser: LayoutParser, private plot: Plot) {
        layoutParser.scene.characters = plot.characters;
        this.assignPlotItems();
        this.layout();
    }

    get scene(): Scene {
        return this.layoutParser.scene;
    };

    get plotItems(): PlotItem[] {
        return this.plot.plotItems;
    }

    /**
     * Distributes the plot items into the panels
     */
    assignPlotItems() {
        let plotItemIndex = 0;
        this.scene.panels.forEach(panel => {
            panel.setPlotItems(this.plotItems.slice(plotItemIndex, plotItemIndex + panel.layoutProperties.plotItemCount));
            plotItemIndex += panel.layoutProperties.plotItemCount;
        })
    }

    layout() {
        // set shapes for pages, panels, characters, bubbles, backgrounds

        if (this.layoutParser && this.layoutParser.scene && this.layoutParser.scene.pages) {
            this.layoutParser.scene.pages.forEach(page => this.layoutPage(page));
        }
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
    }
}