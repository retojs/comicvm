import { Panel } from "../model/Panel";
import { Transition } from "./transitions/Transition";
import { PanelTimelineProperties } from "./PanelTimelineProperties";
import { FadeOverEndTransition } from "./transitions/FadeOverEndTransition";
import { FadeOverStartTransition } from "./transitions/FadeOverStartTransition";
import { FadeInTransition } from "./transitions/FadeInTransition";
import { FadeOutTransition } from "./transitions/FadeOutTransition";

const PANEL_DURATION = 1500;
const FIRST_PANEL_DURATION = 2500;
const LAST_PANEL_DURATION = 2500;

const LETTER_DURATION = 30;

const SCENE_TRANSITION_DURATION = 1600;
const BACKGROUND_TRANSITION_DURATION = 1000;
const PANEL_TRANSITION_DURATION = 600;

export const enum TransitionType {
    None,
    FadeInOut,
    FadeOver
}

export const DEFAULT_TRANSITION_CONFIG: { [key in "scene" | "background" | "panel"]: TransitionType } = {
    scene: TransitionType.FadeInOut,
    background: TransitionType.None,
    panel: TransitionType.FadeOver,
};

export class Timeline {

    panels?: Panel[];

    duration: number;

    transitionConfig = DEFAULT_TRANSITION_CONFIG;

    constructor(panels?: Panel[]) {
        this.setPanels(panels);
    }

    setPanels(panels: Panel[]) {
        this.panels = panels || [];
        this.duration = this.applyPanelTimelineProperties();
    }

    static applyPanelTimelineProperties(panels: Panel[]): number {
        return new Timeline(panels).applyPanelTimelineProperties();
    }

    applyPanelTimelineProperties(): number {
        let startTime = 0,
            endTime = 0;

        this.panels.forEach(panel => {
            const panelDuration = getPanelDuration(panel);
            const [startTransition, endTransition] = this.getTransitions(panel, startTime, panelDuration);

            panel.timelineProperties = new PanelTimelineProperties(startTime, panelDuration, startTransition, endTransition);

            startTime = endTime = panel.timelineProperties.end;

            const showBothPanelsStart = startTransition && startTransition.showBothPanels;
            const showBothPanelsEnd = endTransition && endTransition.showBothPanels;

            if (showBothPanelsStart
                && panel.previousPanel
                && panel.previousPanel.timelineProperties
                && panel.previousPanel.timelineProperties.end <= panel.timelineProperties.start) {
                panel.timelineProperties.start -= startTransition.duration;
            }
            if (showBothPanelsEnd) {
                startTime -= endTransition.duration;
            }
        });

        return endTime;
    }

    getTransitions(panel: Panel, startTime: number, duration: number): Transition[] {
        let startTransition: Transition,
            endTransition: Transition;

        const endTime = startTime + duration;

        if (this.transitionConfig.scene != null && this.transitionConfig.scene !== TransitionType.None) {
            if (panel.isFirstPanel) {
                startTransition = getStartTransition(this.transitionConfig.scene, startTime, SCENE_TRANSITION_DURATION);
            }
            if (panel.isLastPanel) {
                endTransition = getEndTransition(this.transitionConfig.scene, endTime - SCENE_TRANSITION_DURATION, SCENE_TRANSITION_DURATION);
            }
        }

        if (this.transitionConfig.background != null && this.transitionConfig.background !== TransitionType.None) {
            if (panel.isFirstPanel || panel.background.id !== panel.previousPanel.background.id) {
                startTransition = getStartTransition(this.transitionConfig.background, startTime, BACKGROUND_TRANSITION_DURATION);
            }
            if (panel.isLastPanel || panel.background.id !== panel.nextPanel.background.id) {
                endTransition = getEndTransition(this.transitionConfig.background, endTime - BACKGROUND_TRANSITION_DURATION, BACKGROUND_TRANSITION_DURATION);
            }
        }

        if (startTransition == null) {
            startTransition = getStartTransition(this.transitionConfig.panel, startTime, PANEL_TRANSITION_DURATION);
        }
        if (endTransition == null) {
            endTransition = getEndTransition(this.transitionConfig.panel, endTime - PANEL_TRANSITION_DURATION, PANEL_TRANSITION_DURATION);
        }

        return [startTransition, endTransition];
    }

    toString() {
        return (this.panels || []).reduce(
            (str: string, panel: Panel) => {
                str += `\npanel ${panel.sceneIndex}: start=${panel.timelineProperties.start} end=${panel.timelineProperties.end}`;
                if (panel.timelineProperties.startTransition) {
                    str += `\n  start transition: start=${panel.timelineProperties.startTransition.start} end=${panel.timelineProperties.startTransition.end}`
                }
                if (panel.timelineProperties.endTransition) {
                    str += `\n  end transition: start=${panel.timelineProperties.endTransition.start} end=${panel.timelineProperties.endTransition.end}`
                }
                return str;
            },
            ''
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
    const baseDuration = panel.isLastPanel
        ? LAST_PANEL_DURATION
        : panel.isFirstPanel
            ? FIRST_PANEL_DURATION
            : PANEL_DURATION;

    return baseDuration +
        letterDuration * panel.bubbles.reduce((letterCount, bubble) => letterCount + bubble.says.length, 0);
}

export function getStartTransition(type: TransitionType, start: number, duration: number): Transition {
    switch (type) {
        case TransitionType.None:
            return null;
        case TransitionType.FadeInOut:
            return new FadeInTransition(start, duration);
        case TransitionType.FadeOver:
            return new FadeOverStartTransition(start, duration);
    }
}

export function getEndTransition(type: TransitionType, start: number, duration: number): Transition {
    switch (type) {
        case TransitionType.None:
            return null;
        case TransitionType.FadeInOut:
            return new FadeOutTransition(start, duration);
        case TransitionType.FadeOver:
            return new FadeOverEndTransition(start, duration);
    }
}