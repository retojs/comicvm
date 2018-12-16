import {Scene} from "./Scene";
import {Page} from "./Page";
import {Strip} from "./Strip";
import {Background} from "./Background";
import {Rectangle} from "../trigo/Rectangle";
import {PlotItem} from "../plot/PlotItem";

export class Panel {

    scene: Scene;
    page: Page;
    strip: Strip;
    background: Background;

    shape: Rectangle;

    plotItems: PlotItem[];
}