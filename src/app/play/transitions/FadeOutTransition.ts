import { Transition } from "./Transition";
import { PaintStyleConfig } from "../../../common/style/PaintStyle";
import { Panel } from "../../model/Panel";
import { Canvas } from "../../../common/dom/Canvas";

export class FadeOutTransition extends Transition {

    name = Transition.FadeOut;

    paintStyle = PaintStyleConfig.fill("black");

    applyBefore(canvas: Canvas, panel: Panel, time: number) {}

    applyAfter(canvas: Canvas, panel: Panel, time: number) {
        if (this.isOn(time)) {
            const globalAlpha = canvas.setGlobalAlpha(this.getValue(time));
            canvas.begin();
            canvas.rect(panel.shape, this.paintStyle);
            canvas.end();
            canvas.globalAlpha = globalAlpha;
        }
    }
}