import { Scene } from "./Scene";
import { Strip } from "./Strip";
import { Panel } from "./Panel";
import { Rectangle } from "../trigo/Rectangle";

export class Page {

    index: number;

    scene: Scene;

    stripHeights: number[];
    strips: Strip[] = [];
    panels: Panel[] = [];

    shape: Rectangle;

    constructor(index: number) {
        this.index = index;
    }

    addStrip(strip: Strip) {
        this.strips.push(strip);
        strip.page = this;
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.page = this;
        this.scene.addPanel(panel);
    }
}