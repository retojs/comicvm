import { Transition } from "./Transition";
import { PaintStyleConfig } from "../../../common/style/PaintStyle";
import { Panel } from "../../model/Panel";
import { Canvas } from "../../../common/dom/Canvas";

export class FadeOutTransition extends Transition {

    paintStyle = PaintStyleConfig.fill("black");

    applyBefore(canvas: Canvas, panel: Panel, time: number) {}

    applyAfter(canvas: Canvas, panel: Panel, time: number) {
        if (this.isOn(time)) {
            canvas.begin();
            canvas.ctx.globalAlpha = this.getValue(time);
            canvas.rect(panel.shape, this.paintStyle);
            canvas.end();
        }
    }
}