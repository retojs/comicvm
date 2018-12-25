import { Page } from "./Page";
import { Panel } from "./Panel";
import { Rectangle } from "../trigo/Rectangle";
import { PanelConfig } from "../layout/LayoutConfig";

export class Strip {

    index: number;

    page: Page;

    panelConfig: PanelConfig;
    panels: Panel[] = [];

    shape: Rectangle;

    constructor(index: number) {
        this.index = index;
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.strip = this;
        this.page.addPanel(panel);
    }
}