import { Panel } from "../model/Panel";
import { Transition } from "./transitions/Transition";
import { AnimationTimeProperties } from "./AnimationTimeProperties";
import { FadeOverEndTransition } from "./transitions/FadeOverEndTransition";
import { FadeOverStartTransition } from "./transitions/FadeOverStartTransition";
import { FadeInTransition } from "./transitions/FadeInTransition";
import { FadeOutTransition } from "./transitions/FadeOutTransition";
import { Bubble } from "../model/Bubble";

const PANEL_MIN_DURATION = 1500;
const FIRST_PANEL_MIN_DURATION = 2500;
const LAST_PANEL_MIN_DURATION = 2500;
const BUBBLE_MIN_DURATION = 500;
const LETTER_DURATION = 30;

const SCENE_TRANSITION_DURATION = 1600;
const BACKGROUND_TRANSITION_DURATION = 1200;
const PANEL_TRANSITION_DURATION = 800;

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
        this.duration = this.applyPanelAnimationTimeProperties();
    }

    static applyAnimationTimeProperties(panels: Panel[]): number {
        return new Timeline(panels).applyPanelAnimationTimeProperties();
    }

    applyPanelAnimationTimeProperties(): number {
        let startTime = 0,
            endTime = 0;

        this.panels.forEach(panel => {
            const panelDuration = getPanelDuration(panel);
            const [startTransition, endTransition] = this.getTransitions(panel, startTime, panelDuration);

            panel.animationTimeProperties = new AnimationTimeProperties(startTime, panelDuration, startTransition, endTransition);

            startTime = endTime = panel.animationTimeProperties.end;

            const showBothPanelsStart = startTransition && startTransition.showBothPanels;
            const showBothPanelsEnd = endTransition && endTransition.showBothPanels;

            if (showBothPanelsStart
                && panel.previousPanel
                && panel.previousPanel.animationTimeProperties
                && panel.previousPanel.animationTimeProperties.end <= panel.animationTimeProperties.start) {
                panel.animationTimeProperties.start -= startTransition.duration;
            }
            if (showBothPanelsEnd) {
                startTime -= endTransition.duration;
            }

            this.applyBubblesAnimationTimeProperties(panel);
        });

        return endTime;
    }

    applyBubblesAnimationTimeProperties(panel: Panel) {
        let startTime = panel.animationTimeProperties && panel.animationTimeProperties.startTransition
            ? panel.animationTimeProperties.startTransition.duration
            : 0;
        let endTime: number;

        (panel.bubbles || []).forEach(bubble => {
            endTime = startTime + getBubbleDuration(bubble);
            bubble.animationTimeProperties = new AnimationTimeProperties(startTime, endTime);
            startTime = endTime;
        })
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
                str += `\npanel ${panel.sceneIndex}: start=${panel.animationTimeProperties.start} end=${panel.animationTimeProperties.end}`;
                if (panel.animationTimeProperties.startTransition) {
                    str += `\n  start transition: start=${panel.animationTimeProperties.startTransition.start} end=${panel.animationTimeProperties.startTransition.end}`
                }
                if (panel.animationTimeProperties.endTransition) {
                    str += `\n  end transition: start=${panel.animationTimeProperties.endTransition.start} end=${panel.animationTimeProperties.endTransition.end}`
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
    return panel.animationTimeProperties.start <= time && time <= panel.animationTimeProperties.end
}

export function setPanelAnimationTime(panel: Panel, time: number) {
    panel.animationTime = getAnimationTime(panel, time);
}

export function getAnimationTime(panel: Panel, time: number) {
    return (time - panel.animationTimeProperties.start) / panel.animationTimeProperties.duration;
}

export function getPanelDuration(panel: Panel): number {
    const baseDuration = panel.isLastPanel
        ? LAST_PANEL_MIN_DURATION
        : panel.isFirstPanel
            ? FIRST_PANEL_MIN_DURATION
            : PANEL_MIN_DURATION;

    return baseDuration + panel.bubbles.reduce(
        (duration, bubble) => duration + getBubbleDuration(bubble),
        0
    );
}

export function getBubbleDuration(bubble: Bubble): number {
    return BUBBLE_MIN_DURATION + (bubble.says.length * LETTER_DURATION);
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