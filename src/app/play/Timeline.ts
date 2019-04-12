import { Panel } from "../model/Panel";
import { Transition } from "./transitions/Transition";
import { FadeInTransition } from "./transitions/FadeInTransition";
import { PanelTimelineProperties } from "./PanelTimelineProperties";
import { FadeOutTransition } from "./transitions/FadeOutTransition";

const PANEL_BASIC_DURATION = 1000;
const LETTER_DURATION = 10;
const TRANSITION_DURATION = 500;

export class Timeline {

    panels?: Panel[];

    duration: number;

    constructor(panels?: Panel[]) {
        this.setPanels(panels);
    }

    setPanels(panels: Panel[]) {
        let startTime = 0,
            endTime = 0;

        this.panels = panels || [];
        this.panels.forEach(panel => {
            const duration = PANEL_BASIC_DURATION + getPanelDuration(panel);
            endTime = startTime + duration + 2 * TRANSITION_DURATION;
            panel.timelineProperties = new PanelTimelineProperties(
                startTime,
                endTime,
                getStartTransition(startTime, TRANSITION_DURATION),
                getEndTransition(startTime + duration + TRANSITION_DURATION, TRANSITION_DURATION)
            );
            startTime = endTime;
        });

        this.duration = endTime;
    }

    toString() {
        return (this.panels || []).reduce((str, panel) => str +
            `\npanel ${panel.sceneIndex}: start=${panel.timelineProperties.start} end=${panel.timelineProperties.end}`
            + `\n  start transition: start=${panel.timelineProperties.startTransition.start} end=${panel.timelineProperties.startTransition.end}`
            + `\n  end transition: start=${panel.timelineProperties.endTransition.start} end=${panel.timelineProperties.endTransition.end}`
            , ''
        );
    }
}

export function getPlayingPanels(panels: Panel[], time: number) {
    return panels.filter(panel => isPlayingPanel(panel, time));
}

export function isPlayingPanel(panel: Panel, time: number): boolean {
    return panel.timelineProperties.start <= time && time <= panel.timelineProperties.end
}

export function getPanelBoundTime(panel: Panel, time: number): number {
    return Math.max(panel.timelineProperties.start, Math.min(panel.timelineProperties.end, time));
}

export function setPanelAnimationTime(panel: Panel, time: number) {
    panel.animationTime = getAnimationTime(panel, time);
}

export function getAnimationTime(panel: Panel, time) {
    return (time - panel.timelineProperties.start) / panel.timelineProperties.duration;
}

export function getPanelDuration(panel: Panel, letterDuration: number = LETTER_DURATION): number {
    return letterDuration * panel.bubbles.reduce((letterCount, bubble) => letterCount + bubble.says.length, 0);
}

export function getStartTransition(start: number, duration: number): Transition {
    return new FadeInTransition(start, duration);
}

export function getEndTransition(start: number, duration: number): Transition {
    return new FadeOutTransition(start, duration);
}