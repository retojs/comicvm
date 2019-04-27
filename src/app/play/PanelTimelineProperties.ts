import { Transition } from "./transitions/Transition";

export class PanelTimelineProperties {

    start: number;
    end: number;

    constructor(
        start: number,
        duration: number,
        public startTransition?: Transition,
        public endTransition?: Transition
    ) {
        this.start = start;
        this.duration = duration;
    }

    get duration() {
        return this.end - this.start;
    }

    set duration(duration: number) {
        this.end = this.start + duration;
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