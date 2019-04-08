import { Transition } from "./Transition";
import { PaintStyleConfig } from "../../../common/style/PaintStyle";
import { Panel } from "../../model/Panel";
import { Canvas } from "../../../common/dom/Canvas";

export class FadeInTransition extends Transition {

    paintStyle = PaintStyleConfig.fill("black");

    applyBefore(canvas: Canvas, panel: Panel, time: number) {}

    applyAfter(canvas: Canvas, panel: Panel, time: number) {
        if (this.isOn(time)) {
            canvas.begin();
            canvas.ctx.globalAlpha = 1 - this.getValue(time);
            canvas.rect(panel.shape, this.paintStyle);
            canvas.end();
        }
    }
}