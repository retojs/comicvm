import { Transition } from "./transitions/Transition";

export class PanelTimelineProperties {

    constructor(
        public start: number,
        public end: number,
        public startTransition?: Transition,
        public endTransition?: Transition
    ) {}

    get duration() {
        return this.end - this.start;
    }

    get durationSecs() {
        return this.duration / 1000.0;
    }

    get startSecs() {
        return this.start / 1000.0;
    }

    get endSecs() {
        return this.end / 1000.0;
    }
}