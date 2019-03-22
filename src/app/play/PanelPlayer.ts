import { PanelPainter } from "../paint/PanelPainter";
import { CharacterLayoutEngine } from "../layout/engine/CharacterLayoutEngine";
import { Panel } from "../model/Panel";

export class PanelPlayer {

    startTime: number = 0;
    panel: Panel;
    duration: number;

    constructor(public panelPainter: PanelPainter,
                public characterLayoutEngine: CharacterLayoutEngine) {}

    play(panel: Panel, duration: number) {
        this.panel = panel;
        this.duration = duration;
        this.startTime = Date.now();
        window.requestAnimationFrame(this.renderAnimationFrame.bind(this));
    }

    renderAnimationFrame() {
        const time = this.getRelativeTime(this.duration);
        if (time < 1) {
            this.characterLayoutEngine.layoutCharacters(this.panel, time);
            this.panelPainter.paintPanel(this.panel);
            if (this.getRelativeTime(this.duration) < 1) {
                window.requestAnimationFrame(this.renderAnimationFrame.bind(this));
            }
        }
    }

    /**
     * Returns the elapsed time relative to the specified duration
     * where 1 means one whole duration has elapsed.
     *
     * @param startTime
     * @param time
     * @param duration
     */
    getRelativeTime(duration: number): number {
        if (duration === 0) {
            return Number.POSITIVE_INFINITY;
        }
        return (Date.now() - this.startTime) / duration;
    }
}