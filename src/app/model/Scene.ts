import { Page } from "./Page";
import { Background } from "./Background";
import { Panel } from "./Panel";
import { SceneLayoutProperties } from "../layout/LayoutProperties";
import { LayoutParser } from "../layout/LayoutParser";
import { Plot } from "../plot/Plot";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { Canvas } from "../dom/Canvas";
import { Images } from "../images/Images";
import { ImageQuery } from "../images/ImageQuery";

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

    setup(canvas: Canvas, images?: Images): Scene {
        return this.parseLayout().executeLayout(canvas).assignImages(images);
    }

    reset() {
        this.pages = [];
        this.panels = [];
        this.backgrounds = [];
        this.characters = [];
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

    assignImages(images: Images): Scene {
        if (images) {
            this.backgrounds.forEach(background => background.chooseImage(images));
            this.panels.forEach(panel => {
                panel.characterImageGroups.forEach((group: string | string[]) => {
                    if (typeof group === 'string') {
                        panel.getCharacter(group).chooseImage(images);
                    } else {
                        const imageQuery = group.reduce(
                            (query: ImageQuery, name: string) => query.addQuery(panel.getCharacter(name).getImageQuery()),
                            new ImageQuery([], [], [])
                        );
                        const image = images.chooseCharacterImage(imageQuery);
                        group.forEach(name => panel.getCharacter(name).image = image);
                    }
                });
            });
        }
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