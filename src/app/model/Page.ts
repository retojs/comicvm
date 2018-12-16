import {Scene} from "./Scene";
import {Background} from "./Background";
import {Strip} from "./Strip";
import {Panel} from "./Panel";
import {Rectangle} from "../trigo/Rectangle";

export class Page {

    scene: Scene;

    strips: Strip[];
    panels: Panel[];
    backgrounds: Background[];

    shape: Rectangle
}