import { Page } from "./Page";
import { Background } from "./Background";
import { Panel } from "./Panel";
import { SceneLayoutProperties } from "../layout/LayoutProperties";
import { LayoutParser } from "../layout/LayoutParser";
import { Plot } from "../plot/Plot";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { Canvas } from "../dom/Canvas";
import { Images } from "../images/Images";

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

    setup(canvas: Canvas, images: Images): Scene {
        return this.parseLayout().executeLayout(canvas).assignImages(images);
    }

    parseLayout(): Scene {
        this.layoutParser = LayoutParser.parseLayout(this);
        return this;
    }

    executeLayout(canvas: Canvas): Scene {
        LayoutEngine.layoutScene(this, canvas);
        return this;
    }

    assignImages(images: Images): Scene {
        this.backgrounds.forEach(background => background.chooseImage(images));
        this.panels.forEach(panel => panel.characters.forEach(character => character.chooseImage(images)));
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