import { Canvas } from "../../../common/dom/Canvas";
import { Panel } from "../../model/Panel";

export class Transition {

    constructor(
        public start: number,
        public duration: number
    ) {}

    get end() {
        return this.start + this.duration;
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
