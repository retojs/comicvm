import { Rectangle } from "../trigo/Rectangle";
import { TextBox } from "./TextBox";

export class Bubble {

    who: string[];
    says: string;

    textBox: TextBox;

    shape: Rectangle;

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
}