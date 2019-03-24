import { PanelPainter } from "../paint/PanelPainter";
import { CharacterLayoutEngine } from "../layout/engine/CharacterLayoutEngine";
import { Panel } from "../model/Panel";
import { BubbleLayoutEngine } from "../layout/engine/BubbleLayoutEngine";
import { Scene } from "../model/Scene";
import { Images } from "../images/Images";

export class PanelPlayer {

    startTime: number = 0;
    panel: Panel;
    duration: number;

    private characterLayoutEngine: CharacterLayoutEngine;
    private bubbleLayoutEngine: BubbleLayoutEngine;

    constructor(private scene: Scene,
                private images: Images,
                private panelPainter: PanelPainter,
    ) {
        this.characterLayoutEngine = new CharacterLayoutEngine();
        this.bubbleLayoutEngine = new BubbleLayoutEngine();
    }

    play(panel: Panel, duration: number) {
        this.panel = panel;
        this.duration = duration;
        this.startTime = Date.now();
        window.requestAnimationFrame(this.renderAnimationFrame.bind(this));
    }

    renderAnimationFrame() {
        const time = this.getRelativeTime(this.duration);
        if (time < 1) {
            this.layout(time);
            this.panelPainter.paintPanel(this.panel);
            if (this.getRelativeTime(this.duration) < 1) {
                window.requestAnimationFrame(this.renderAnimationFrame.bind(this));
            }
        }
    }

    layout(time: number) {
        this.panel.animationTime = time;
        this.characterLayoutEngine.layoutCharacters(this.panel);
        this.bubbleLayoutEngine.layoutPanel(this.panel, this.panelPainter.canvas);
        this.scene.assignImages(this.images);
        this.panel.backgroundImageShape = this.panel.background.getImageShape(this.panel);
    }

    /**
     * Returns the elapsed time relative to the specified duration
     * where 1 means one whole duration has elapsed.
     */
    getRelativeTime(duration: number): number {
        if (duration === 0) {
            return Number.POSITIVE_INFINITY;
        }
        return (Date.now() - this.startTime) / duration;
    }
}