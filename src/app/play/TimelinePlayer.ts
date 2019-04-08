import { PanelPainter } from "../paint/PanelPainter";
import { getPlayingPanels, setPanelAnimationTime, Timeline } from "./Timeline";
import { Scene } from "../model/Scene";
import { Canvas } from "../../common/dom/Canvas";
import { Panel } from "../model/Panel";
import { Images } from "../images/Images";
import { Player } from "./Player";
import { Font } from "../../common/style/Font";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { Div } from "../../common/dom/Div";
import { DomElementContainer } from "../../common/dom/DomElement";
import { Margin } from "../../common/style/Margin";
import { PaintStyleConfig } from "../../common/style/PaintStyle";

const PADDING = new Margin(16);
const BACKGROUND_COLOR = PaintStyleConfig.fill("black");

export class TimelinePlayer extends Player {

    readonly root: Div;
    readonly canvas: Canvas;
    private images: Images;
    private timeline: Timeline;
    private layoutEngine: LayoutEngine;
    private panelPainter: PanelPainter;

    constructor(
        private container: DomElementContainer,
        private scene: Scene
    ) {
        super();
        this.root = new Div(container, "timeline-player");
        this.canvas = new Canvas(this.root);
        this.layoutEngine = new LayoutEngine(this.scene);
        this.panelPainter = new PanelPainter(this.canvas);
        this.renderFrameFn = this.paintPanel.bind(this);
    }

    get panels() {
        return this.timeline.panels;
    }

    setup(width: number, height: number, font: Font, images: Images): TimelinePlayer {
        this.canvas.setDimensions(width, height);
        this.canvas.setFont(font);
        this.canvas.backgroundColor = BACKGROUND_COLOR;
        this.images = images;
        this.scene.setup(this.canvas, images);
        this.timeline = new Timeline(this.scene.panels);
        console.log("timeline: ", this.timeline.toString());
        return this;
    }

    renderAtTime(time: number) {
        if (this.isPlaying) {
            this.reset();
        }
        window.requestAnimationFrame(() => {
            this.paintPanel(time);
        })
    }

    paintPanel(time: number) {
        const playingPanels = getPlayingPanels(this.panels, time);
        if (playingPanels.length === 0) {
            this.reset();
        } else {
            playingPanels.forEach(panel => {
                this.layoutPanel(panel, time);
                this.canvas.begin();
                this.canvas.resetTransform();
                this.canvas.clear();
                this.canvas.transformTo(panel.shape.clone().addMargin(PADDING));
                this.panelPainter.paintPanelWithTransitions(panel, time);
                this.canvas.end();
            });
        }
    }

    layoutPanel(panel: Panel, time) {
        setPanelAnimationTime(panel, time);
        this.layoutEngine.layoutPanelContent(panel, this.panelPainter.canvas);
        this.scene.setupImages(this.images);
    }
}

