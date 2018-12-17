import { Scene } from "./Scene";
import { Panel } from "./Panel";
import { BackgroundLayoutProperties } from "../layout/LayoutProperties";

export class Background {

    id: string;

    scene: Scene;

    panels: Panel[] = [];

    layoutProperties: BackgroundLayoutProperties;

    image: string; // TODO: Blob??

    constructor(id: string) {
        this.id = id;
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.background = this;
    }
}