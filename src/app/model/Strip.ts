import { Page } from "./Page";
import { Panel } from "./Panel";
import { Rectangle } from "../../common/trigo/Rectangle";
import { PanelWidthsConfig } from "../layout/Layout.config";

export class Strip {

    index: number;

    page: Page;

    panelWidthsConfig: PanelWidthsConfig;
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

    toString(): string {
        return `strip ${this.index + 1} in ${this.page.toString()}`;
    }
}