import { Page } from "./Page";
import { Background } from "./Background";
import { Panel } from "./Panel";
import { SceneLayoutProperties } from "../layout/LayoutProperties";
import { LayoutParser } from "../layout/LayoutParser";
import { Plot } from "../plot/Plot";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { Canvas } from "../../common/dom/Canvas";
import { Images } from "../images/Images";
import { Point } from "../../common/trigo/Point";

export class Scene {

    name: string;

    plot: Plot;
    layout: string;
    layoutParser: LayoutParser;
    layoutProperties: SceneLayoutProperties;

    pages: Page[] = [];
    panels: Panel[] = [];
    backgrounds: Background[] = [];
    characters: (string | string[])[];

    constructor(name: string, layout: string, plot: string) {
        this.name = name;
        this.layout = layout;
        this.plot = new Plot(plot);
    }

    reset() {
        this.pages = [];
        this.panels = [];
        this.backgrounds = [];
        this.characters = [];
    }

    setup(canvas: Canvas, images?: Images): Scene {
        return this.parseLayout().executeLayout(canvas).setupImages(images);
    }

    parseLayout(): Scene {
        this.reset();
        this.layoutParser = LayoutParser.parseLayout(this);
        return this;
    }

    executeLayout(canvas: Canvas): Scene {
        LayoutEngine.layoutScene(this, canvas);
        return this;
    }

    setupImages(images: Images): Scene {
        if (!images) {
            return this;
        }
        this.backgrounds.forEach(background => background.setupImage(images));
        this.panels.forEach(panel => panel.setupCharacterImages(images));
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

    getPanelAtPosition(pos: Point): Panel {
        return this.panels.find(panel => panel.shape.contains(pos));
    }
}