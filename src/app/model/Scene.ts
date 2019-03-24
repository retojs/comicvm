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
import { Character } from "./Character";
import { Rectangle } from "../trigo/Rectangle";
import { Img } from "../dom/Img";

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
        this.backgrounds.forEach(background => this.assignBackgroundImage(background, images));
        this.panels.forEach(panel => this.assignCharacterImages(panel, images));
        return this;
    }

    assignBackgroundImage(background: Background, images: Images) {
        background.image = background.chooseImage(images);
        background.panels.forEach(panel => panel.backgroundImageShape = background.getImageShape(panel))
    }

    assignCharacterImages(panel: Panel, images: Images) {
        panel.characterGroups.forEach((group: string | string[]) => {
            if (typeof group === 'string') {
                const character: Character = panel.getCharacter(group);
                character.image = character.chooseImage(images);
                character.imageShape = character.getImageShape();
            } else {
                assignCharacterGroupImage(group as string[]);
            }
        });

        function assignCharacterGroupImage(group: string[]) {
            const image: Img = chooseCharacterGroupImage();
            const characterBBox = Rectangle.getBoundingBox(group.map(name => panel.getCharacter(name).getPosition()));
            group.forEach(name => {
                panel.getCharacter(name).image = image;
                if (image) {
                    panel.getCharacter(name).imageShape = Rectangle.fitAroundBounds(image.bitmapShape.clone(), characterBBox);
                }
            });

            function chooseCharacterGroupImage(): Img {
                const imageQuery = group.reduce(
                    (query: ImageQuery, name: string) => query.addQuery(panel.getCharacter(name).getImageQuery()),
                    new ImageQuery([], [], [])
                );
                return images ? images.chooseCharacterImage(imageQuery) : null;
            }
        }
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