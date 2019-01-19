import { Page } from "./Page";
import { Background } from "./Background";
import { Panel } from "./Panel";
import { SceneLayoutProperties } from "../layout/LayoutProperties";
import { LayoutParser } from "../layout/LayoutParser";
import { Plot } from "../plot/Plot";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { Canvas } from "../dom/Canvas";

export class Scene {

    name: string;

    plot: Plot;
    layout: string;
    layoutParser: LayoutParser;
    layoutProperties: SceneLayoutProperties;

    pages: Page[] = [];
    panels: Panel[] = [];
    backgrounds: Background[] = [];
    characters: string[];

    constructor(name: string, layout: string, plot: string) {
        this.name = name;
        this.layout = layout;
        this.plot = new Plot(plot);
    }

    setup(canvas: Canvas): Scene {
        return this.parseLayout().executeLayout(canvas);
    }

    parseLayout(): Scene {
        this.layoutParser = LayoutParser.parseLayout(this);
        return this;
    }

    executeLayout(canvas: Canvas): Scene {
        LayoutEngine.layoutScene(this, canvas);
        return this;
    }

    addPage(page: Page) {
        this.pages.push(page);
        page.scene = this;
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.scene = this;
    }

    addBackground(bgr: Background) {
        this.backgrounds.push(bgr);
        bgr.scene = this;
    }
}