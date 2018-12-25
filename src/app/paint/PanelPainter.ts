import { Panel } from "../model/Panel";
import { Canvas } from "./Canvas";

export class PanelPainter {

    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    paintPanel(panel: Panel) {
        if (panel.shape) {
            this.canvas.rect(panel.shape, "#000");
        }
    }
}