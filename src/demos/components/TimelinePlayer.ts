import { PanelPainter } from "../../app/paint/PanelPainter";
import { getPlayingPanels, setPanelAnimationTime, Timeline } from "../../app/play/Timeline";
import { Scene } from "../../app/model/Scene";
import { Canvas } from "../../common/dom/Canvas";
import { Panel } from "../../app/model/Panel";
import { Images } from "../../app/images/Images";
import { Player } from "../../app/play/Player";
import { Font } from "../../common/style/Font";
import { LayoutEngine } from "../../app/layout/engine/LayoutEngine";
import { Div } from "../../common/dom/Div";
import { DomElementContainer } from "../../common/dom/DomElement";
import { Margin } from "../../common/style/Margin";
import { PaintStyleConfig } from "../../common/style/PaintStyle";

const PADDING = new Margin(60);
const BACKGROUND_COLOR = PaintStyleConfig.fill("white");

export class TimelinePlayer extends Player {

    name = "Timeline player";

    readonly root: Div;
    readonly canvas: Canvas;

    private images: Images;
    private timeline: Timeline;
    private layoutEngine: LayoutEngine;
    private panelPainter: PanelPainter;

    private animationDisplay: Div;
    private animationDisplayPanel: Panel;

    constructor(
        private container: DomElementContainer,
        private scene: Scene
    ) {
        super();
        this.root = new Div(container, "timeline-player");
        this.canvas = new Canvas(this.root);
        this.layoutEngine = new LayoutEngine(this.scene);
        this.panelPainter = new PanelPainter(this.canvas);
        this.panelPainter.animateBubbles = true;
        this.renderFrameFn = this.paintPanel.bind(this);
    }

    get panels(): Panel[] {
        return this.timeline.panels;
    }

    getPanelAt(time: number): Panel {
        const playingPanels = getPlayingPanels(this.panels, time);
        if (playingPanels && playingPanels.length) {
            return playingPanels[0];
        }
    }

    setup(width: number, height: number, font: Font, images: Images): TimelinePlayer {
        this.canvas.setDimensions(width, height);
        this.canvas.setFont(font);
        this.canvas.backgroundColor = BACKGROUND_COLOR;
        this.images = images;
        this.scene.setup(this.canvas, images);
        this.timeline = new Timeline(this.scene.panels);
        console.log("timeline: ", this.timeline.toString());
        this.setupAnimationDisplay();
        return this;
    }

    setupAnimationDisplay() {
        this.animationDisplay = new Div(this.root, "animation-display");
    }

    renderAtTime(time: number) {
        if (this.isPlaying) {
            this.resetPlayer();
        }
        window.requestAnimationFrame(() => {
            this.paintPanel(time);
        })
    }

    updateAnimationDisplay(time: number) {
        this.animationDisplayPanel = this.getPanelAt(time);
        if (!this.animationDisplayPanel) {
            return;
        }

        let animationDisplayContent = "";
        const panelIndex = this.animationDisplayPanel.sceneIndex;

        const layoutProps = this.animationDisplayPanel.layout;
        let zoom = layoutProps && layoutProps.camera.zoom != null ? layoutProps.camera.zoom : 1;
        let pan = layoutProps && layoutProps.camera.pan ? layoutProps.camera.pan : {x: 0, y: 0};

        animationDisplayContent +=
            `<div class="animation-display__heading">Panel ${panelIndex} - layout properties</div>`
            + `<div><span class="animation-display__prop">zoom</span>${zoom}</div>`
            + `<div><span class="animation-display__prop">pan</span>[ ${pan.x || 0} , ${pan.y || 0} ]</div>`;

        const animProps = this.animationDisplayPanel.layout ? this.animationDisplayPanel.layout.animation : null;
        zoom = animProps && animProps.zoom != null ? animProps.zoom : 0;
        pan = animProps && animProps.pan ? animProps.pan : {x: 0, y: 0};

        animationDisplayContent +=
            `<div class="animation-display__heading margin-top">Panel ${panelIndex} - animation properties</div>`
            + `<div><span class="animation-display__prop">zoom</span>${zoom}</div>`
            + `<div><span class="animation-display__prop">pan</span>[ ${pan.x || 0} , ${pan.y || 0} ]</div>`;

        const animationTimeProperties = this.animationDisplayPanel.animationTimeProperties;
        const duration = animationTimeProperties ? animationTimeProperties.durationSecs : 0;
        const start = animationTimeProperties ? animationTimeProperties.startSecs : 0;
        const end = animationTimeProperties ? animationTimeProperties.endSecs : 0;

        animationDisplayContent +=
            `<div class="animation-display__heading margin-top">Panel ${panelIndex} - timeline properties</div>`
            + `<div><span class="animation-display__prop">duration</span>${duration.toFixed(2)} s</div>`
            + `<div><span class="animation-display__prop">start / end</span>${start.toFixed(2)} s / ${end.toFixed(2)} s</div>`;

        setPanelAnimationTime(this.animationDisplayPanel, time);
        zoom = this.animationDisplayPanel.zoom;
        pan = this.animationDisplayPanel.panObject;
        const animationTime = this.animationDisplayPanel.animationTime;
        if (animationTime > 0) {
            const timeSecs: number = this.animationDisplayPanel.animationTime * this.animationDisplayPanel.animationTimeProperties.duration / 1000;

            animationDisplayContent +=
                `<div class="animation-display__heading margin-top">Panel ${panelIndex} - animation time values</div>`
                + `<div><span class="animation-display__prop">zoom</span>${zoom.toFixed(2)}</div>`
                + `<div><span class="animation-display__prop">pan</span>[ ${pan.x.toFixed(2)} , ${pan.y.toFixed(2)} ]</div>`
                + `<div><span class="animation-display__prop margin-top">time</span>${animationTime.toFixed(2)} duration / ${timeSecs.toFixed(2)} s</div>`;

            this.animationDisplay.setContent(animationDisplayContent);
        }
    }

    paintPanel(time: number) {
        const playingPanels = getPlayingPanels(this.panels, time);
        if (playingPanels.length === 0) {
            this.resetPlayer();
        } else {
            this.updateAnimationDisplay(time);

            this.canvas.begin();
            this.canvas.resetTransform();
            this.canvas.clear();
            playingPanels.forEach(panel => {
                this.layoutPanel(panel, time);
                this.canvas.transformTo(panel.shape.clone().addMargin(PADDING));
                this.panelPainter.paintPanelWithTransitions(panel, time);
            });
            this.canvas.end();
        }
    }

    layoutPanel(panel: Panel, time) {
        setPanelAnimationTime(panel, time);
        this.layoutEngine.layoutPanelContent(panel, this.panelPainter.canvas);
        this.scene.setupImages(this.images);
    }
}

