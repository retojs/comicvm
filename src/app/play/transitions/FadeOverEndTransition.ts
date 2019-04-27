import { Transition } from "./Transition";
import { Panel } from "../../model/Panel";
import { Canvas } from "../../../common/dom/Canvas";

export class FadeOverEndTransition extends Transition {

    name = Transition.FadeOverEnd;

    globalAlpha: number;

    applyBefore(canvas: Canvas, panel: Panel, time: number) {
        if (this.isOn(time)) {
            this.globalAlpha = canvas.setGlobalAlpha(1 - this.getValue(time));
        }
    }

    applyAfter(canvas: Canvas, panel: Panel, time: number) {
        if (this.isOn(time)) {
            canvas.globalAlpha = this.globalAlpha;
        }
    }
}