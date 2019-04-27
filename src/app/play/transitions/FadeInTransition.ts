import { Transition } from "./Transition";
import { PaintStyleConfig } from "../../../common/style/PaintStyle";
import { Panel } from "../../model/Panel";
import { Canvas } from "../../../common/dom/Canvas";

export class FadeInTransition extends Transition {

    name = Transition.FadeIn;

    paintStyle = PaintStyleConfig.fill("black");

    applyBefore(canvas: Canvas, panel: Panel, time: number) {}

    applyAfter(canvas: Canvas, panel: Panel, time: number) {
        if (this.isOn(time)) {
            const globalAlpha = canvas.setGlobalAlpha(1 - this.getValue(time));
            canvas.begin();
            canvas.rect(panel.shape, this.paintStyle);
            canvas.end();
            canvas.globalAlpha = globalAlpha;
        }
    }
}