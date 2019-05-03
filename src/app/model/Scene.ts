import { Page } from "./Page";
import { Background } from "./Background";
import { Panel } from "./Panel";
import { extractQualifiers, SceneOrBackgroundLayout } from "../layout/Layout";
import { LayoutParser } from "../layout/LayoutParser";
import { Plot } from "../plot/Plot";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { Canvas } from "../../common/dom/Canvas";
import { Images } from "../images/Images";
import { Point } from "../../common/trigo/Point";
import { NARRATOR } from "../plot/PlotItem";

export class Scene {

    name: string;

    plot: Plot;
    layoutYaml: string;
    layoutParser: LayoutParser;
    layout: SceneOrBackgroundLayout;

    pages: Page[] = [];
    panels: Panel[] = [];
    backgrounds: Background[] = [];

    get characters(): (string | string[])[] {
        if (this.layout && this.layout.characters) {
            return this.layout.characters;
        } else {
            return this.plot.characters.filter(ch => ch !== NARRATOR);
        }
    };

    constructor(name: string, layoutYaml: string, plot: string) {
        this.name = name;
        this.layoutYaml = layoutYaml;
        this.plot = new Plot(plot);
    }

    reset() {
        this.pages = [];
        this.panels = [];
        this.backgrounds = [];
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
        if (images) {
            this.setupCharacterQualifier();
            this.backgrounds.forEach(background => background.setupImage(images));
            this.panels.forEach(panel => panel.setupCharacterImages(images));
        }
        return this;
    }

    setupCharacterQualifier() {
        const qualifiers = [
            ...extractQualifiers(this.layout),
            ...this.backgrounds.reduce((qualifiers, background) => [
                ...qualifiers,
                ...extractQualifiers(background.layout)
            ], [])
        ];

        this.panels.forEach(panel => panel.addAllCharacterQualifiers([
            ...qualifiers,
            ...extractQualifiers(panel.layout)
        ]));
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