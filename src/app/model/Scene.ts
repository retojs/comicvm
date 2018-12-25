import { Page } from "./Page";
import { Background } from "./Background";
import { Panel } from "./Panel";
import { SceneLayoutProperties } from "../layout/LayoutProperties";

export class Scene {

    pages: Page[] = [];
    panels: Panel[] = [];
    backgrounds: Background[] = [];

    layoutProperties: SceneLayoutProperties;

    characters: string[];

    constructor() {}

    addPage(page: Page) {
        this.pages.push(page);
        page.scene = this;
    }

    addBackground(bgr: Background) {
        this.backgrounds.push(bgr);
        bgr.scene = this;
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.scene = this;
    }
}