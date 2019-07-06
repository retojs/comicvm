import { Canvas } from "../../common/dom/Canvas";
import { LayoutConfig } from "../layout/Layout.config";
import { DomElementContainer } from "../../common/dom/DomElement";
import { PaintConfig } from "./Paint.config";
import { Font } from "../../common/style/Font";
import { Scene } from "../model/Scene";

export class ComicVmCanvas extends Canvas {

    font: Font = PaintConfig.canvas.font;

    constructor(container: DomElementContainer, scene: Scene) {
        super(container,
            PaintConfig.canvas.width,
            PaintConfig.canvas.height * scene.pageCount,
            PaintConfig.canvas.width / LayoutConfig.page.width
        );
    }
}