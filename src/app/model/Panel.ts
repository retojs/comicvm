import { Scene } from "./Scene";
import { Page } from "./Page";
import { Strip } from "./Strip";
import { Background } from "./Background";
import { Rectangle } from "../trigo/Rectangle";
import { PlotItem } from "../plot/PlotItem";
import { PanelLayoutProperties } from "../layout/LayoutProperties";

export class Panel {

    index: number;

    scene: Scene;
    page: Page;
    strip: Strip;
    background: Background;

    shape: Rectangle;

    plotItems: PlotItem[] = [];

    layoutProperties: PanelLayoutProperties;

    constructor(index: number) {
        this.index = index;
    }

    /**
     * Calculates the dimensions and the position of this panel
     * @param options
     */
    layout() {}
}