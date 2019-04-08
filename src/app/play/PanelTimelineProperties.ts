import { Transition } from "./transitions/Transition";

export class PanelTimelineProperties {

    constructor(
        public    start: number,
        public   end: number,
        public   startTransition?: Transition,
        public  endTransition?: Transition
    ) {}

    get duration() {
        return this.end - this.start;
    }
}