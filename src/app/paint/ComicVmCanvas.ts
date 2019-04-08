import { Canvas } from "../../common/dom/Canvas";
import { LayoutConfig } from "../layout/Layout.config";
import { DomElementContainer } from "../../common/dom/DomElement";
import { PaintConfig } from "./Paint.config";
import { Font } from "../../common/style/Font";

export class ComicVmCanvas extends Canvas {

    font: Font = PaintConfig.canvas.font;

    constructor(container: DomElementContainer) {
        super(container, PaintConfig.canvas.width, PaintConfig.canvas.height, PaintConfig.canvas.width / LayoutConfig.page.width);
    }
}