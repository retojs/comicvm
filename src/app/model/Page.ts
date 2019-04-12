import { Scene } from "./Scene";
import { Strip } from "./Strip";
import { Panel } from "./Panel";
import { Rectangle } from "../../common/trigo/Rectangle";
import { StripHeightsConfig } from "../layout/Layout.config";

export class Page {

    index: number;

    scene: Scene;

    stripConfig: StripHeightsConfig;
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

    toString(): string {
        return `page ${this.index + 1}`;
    }
}