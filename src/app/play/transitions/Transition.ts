import { Canvas } from "../../../common/dom/Canvas";
import { Panel } from "../../model/Panel";

export class Transition {

    static FadeIn = "FadeIn";
    static FadeOut = "FadeOut";
    static FadeOverStart = "FadeOverStart";
    static FadeOverEnd = "FadeOverEnd";

    name = "Generic";

    constructor(
        public start: number,
        public duration: number
    ) {}

    get end() {
        return this.start + this.duration;
    }

    get showBothPanels() {
        return this.name === Transition.FadeOverStart || this.name === Transition.FadeOverEnd;
    }

    isOn(time) {
        return time >= this.start && time <= this.end;
    }

    getValue(time: number): number {
        return (time - this.start) / this.duration;
    }

    applyBefore(canvas: Canvas, panel: Panel, time: number) {}

    applyAfter(canvas: Canvas, panel: Panel, time: number) {}

}
