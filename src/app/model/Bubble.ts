import { Rectangle } from "../../common/trigo/Rectangle";
import { TextBox } from "./TextBox";
import { NARRATOR } from "../plot/PlotItem";
import { BubblePointer } from "./BubblePointer";
import { AnimationTimeProperties } from "../play/AnimationTimeProperties";

export class Bubble {

    who: string[];
    says: string;

    textBox: TextBox;
    shape: Rectangle;

    pointers: BubblePointer[];

    animationTimeProperties: AnimationTimeProperties;

    constructor(who: string[], says: string) {
        this.says = says;
        this.who = who;
    }

    sayMore(text: string) {
        this.says = (this.says ? this.says + " " : "") + text;
    }

    whoEquals(who: string[]) {
        if (!who && !this.who) {
            return true;
        }
        if (!who || !this.who) {
            return false;
        }
        return who.every(name => this.who && this.who.indexOf(name) > -1)
            && this.who.every(name => who && who.indexOf(name) > -1);
    }

    get isOffScreen(): boolean {
        return this.who && this.who[0] === NARRATOR;
    }
}