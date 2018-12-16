import {LayoutParser} from "./LayoutParser";
import {Scene} from "../model/Scene";

export class Layout {

    input: string;
    object: any;

    layoutParser: LayoutParser;

    scene: Scene;

//scene: Scene;

    constructor(input: string) {
        this.input = input;
        this.object = JSON.parse(input);
        this.layoutParser = new LayoutParser(this);
//        this.scene =
        this.scene = this.layoutParser.parseInput();
    }

}