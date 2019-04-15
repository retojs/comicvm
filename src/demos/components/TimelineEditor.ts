import { Div } from "../../common/dom/Div";
import { Canvas } from "../../common/dom/Canvas";
import { Scene } from "../../app/model/Scene";
import { DomElementContainer } from "../../common/dom/DomElement";
import { isPlayingPanel, setPanelAnimationTime, Timeline } from "../../app/play/Timeline";
import { PanelPainter } from "../../app/paint/PanelPainter";
import { Rectangle } from "../../common/trigo/Rectangle";
import { Dimensions } from "../../common/trigo/Dimensions";
import { Line } from "../../common/trigo/Line";
import { Point } from "../../common/trigo/Point";
import { PaintStyleConfig } from "../../common/style/PaintStyle";
import { Player } from "../../app/play/Player";
import { Font } from "../../common/style/Font";
import { Images } from "../../app/images/Images";
import { TimelinePlayer } from "./TimelinePlayer";
import { PaintConfig } from "../../app/paint/Paint.config";
import { Button } from "../../common/dom/Button";
import { Panel } from "../../app/model/Panel";
import { LayoutEngine } from "../../app/layout/engine/LayoutEngine";
import { Margin } from "../../common/style/Margin";

const TIMELINE_PLAYER_WIDTH = 600;
const TIMELINE_PLAYER_HEIGHT = 420;

const FRAME_BOUNDS = new Dimensions(60, 60);
const TIMELINE_PADDING = new Margin(8, 8);

const BACKGROUND_COLOR = PaintStyleConfig.fill("white");
const FRAME_BORDER_COLOR = PaintStyleConfig.stroke("white", 1.5);
const CURRENT_TIME_COLOR = PaintStyleConfig.stroke("red", 1);

export type TimeChangeListener = (time: number) => void;

export class TimelineEditor {

    root: Div;
    timelinePlayerPanel: Div;
    timelinePanel: Div;
    canvas: Canvas;

    panelPainter: PanelPainter;
    layoutEngine: LayoutEngine;
    scene: Scene;
    images: Images;

    timeline: Timeline;
    actualTimeLine: Line;
    frameBounds: Dimensions = FRAME_BOUNDS;
    frameShape: Rectangle;

    player: Player;
    timelinePlayer: TimelinePlayer;
    playButton: Button;
    timeDisplay: Div;
    onTimeChange: TimeChangeListener;
    currentTime: number;

    mousePressed: boolean;

    constructor(container: DomElementContainer, scene: Scene, onTimeChange?: TimeChangeListener) {
        this.root = new Div(container, "timeline-editor");
        this.timelinePlayerPanel = new Div(this.root);
        this.timelinePanel = new Div(this.root, "timeline-container");
        this.canvas = new Canvas(this.timelinePanel);
        this.panelPainter = new PanelPainter(this.canvas);

        this.scene = scene;
        this.layoutEngine = new LayoutEngine(scene);

        this.player = new Player(
            this.paintCurrentTime.bind(this),
            this.onSpacePressed.bind(this)
        );
        this.onTimeChange = onTimeChange || (() => {});
        this.setupMouseListeners();
        this.setupTimeDisplay();
    }


    setup(width: number, font: Font, images: Images): TimelineEditor {

        this.images = images;

        // Split the specified timeline width into an integer number of frames with dimensions near this.frameBounds

        const innerWidth = width - TIMELINE_PADDING.horizontal;
        const frameCount = Math.round(innerWidth / this.frameBounds.width);
        const frameWidth = innerWidth / frameCount;
        const frameHeight = this.frameBounds.height / frameWidth * this.frameBounds.width;
        const height = frameHeight + TIMELINE_PADDING.vertical;

        this.setupCanvas(width, height, font);
        this.timelinePanel.domElement.style.width = width + "px";

        // the "actual timeline" is a line on the canvas from time = 0 to time = animation duration

        this.actualTimeLine = new Line(
            new Point(TIMELINE_PADDING.left, height / 2),
            new Point(width - TIMELINE_PADDING.right, height / 2)
        );

        // The frame proportions is derived from the bounding box of all panel shapes
        // and fit into the adjusted frame bounds calculated above.

        this.frameShape =
            Rectangle.fitIntoBounds(
                Rectangle.getBoundingBox(
                    this.scene.panels.map(panel => panel.shape)
                ),
                new Rectangle(0, (height - this.frameBounds.height) / 2, frameWidth, frameHeight)
            );

        // setup scene and other components

        this.scene.setup(this.canvas, images);
        this.timeline = new Timeline(this.scene.panels);

        this.setupTimelinePlayer(images);
        this.setCurrentTime(this.player.pauseTime = this.timelinePlayer.pauseTime = this.getTimeAt(0));

        return this;
    }

    setupCanvas(width: number, height: number, font: Font) {
        this.canvas.setDimensions(width, height);
        this.canvas.setFont(font);
        this.canvas.backgroundColor = BACKGROUND_COLOR;

    }

    setupMouseListeners() {
        this.timelinePanel.onMouseDown = (event: MouseEvent) => {
            this.mousePressed = true;
            this.onClick(event);
        };
        this.timelinePanel.onMouseUp = () => this.mousePressed = false;
        this.timelinePanel.onMouseMove = (event: MouseEvent) => {
            if (this.mousePressed) {
                this.onClick(event);
            }
        }
    }

    onClick(event: MouseEvent) {
        const pos = new Point(event.clientX, event.clientY).translate(...this.canvas.clientOffsetInv);
        this.player.isPlaying = false;
        this.setCurrentTime(this.player.pauseTime = this.timelinePlayer.pauseTime = this.getTimeAt(pos.x));
        this.paintCurrentTime(this.currentTime);
        this.timelinePlayer.renderAtTime(this.currentTime);
        this.onTimeChange(this.currentTime);
    }

    setupTimeDisplay() {
        this.timeDisplay = new Div(this.timelinePanel, "time-display");
        this.onTimeChange = (time: number) => {
            this.timeDisplay.setContent((time / 1000).toFixed(2) + "s / " + (this.timeline.duration / 1000).toFixed(2) + "s");
        }
    }

    setupTimelinePlayer(images: Images) {

        this.setupPlayButton();

        this.timelinePlayer = new TimelinePlayer(
            this.timelinePlayerPanel,
            this.scene
        ).setup(TIMELINE_PLAYER_WIDTH, TIMELINE_PLAYER_HEIGHT, PaintConfig.canvas.font, images);

        this.timelinePlayer.renderAtTime(0);
    }

    setupPlayButton() {
        this.playButton = new Button(
            new Div(this.timelinePlayerPanel, "play-button-container"),
            "Restart",
            () => {
                this.reset();
                this.play();
                this.timelinePlayer.resetPlayer();
                this.timelinePlayer.play();
                this.playButton.domElement.blur();
            }
        );
        this.playButton.class = "button--modest";
    }

    onSpacePressed() {
        if (this.currentTime >= this.getTimeAt(this.actualTimeLine.width)) {
            this.setCurrentTime(0);
        }
        this.mousePressed = false;
    }

    play() {this.player.play();}

    reset() {this.player.resetPlayer();}

    setCurrentTime(time: number) {
        this.currentTime = time;
        this.onTimeChange(time);
    }

    get timePerPixel(): number {
        return this.timeline.duration / this.actualTimeLine.width;
    }

    getTimeAt(x: number) {
        return Math.min(this.actualTimeLine.width, Math.max(0, x)) * this.timePerPixel;
    }

    getPixelAt(time: number) {
        return TIMELINE_PADDING.left + Math.min(this.actualTimeLine.width, Math.max(0, time / this.timePerPixel));
    }

    getPanelAt(time: number) {
        return this.scene.panels.find(panel => isPlayingPanel(panel, time));
    }

    paint() {
        this.canvas.begin();
        this.canvas.clear();
        for (let x = TIMELINE_PADDING.left; x < this.actualTimeLine.width; x += this.frameShape.width) {
            const time = this.getFrameTime(x);
            const panel = this.getPanelAt(time);
            if (panel) {
                this.layoutPanel(panel, time);

                this.canvas.transformTo(panel.shape, this.getFrameShape(x));
                this.panelPainter.paintPanelWithTransitions(panel, time);
            }
        }
        this.canvas.end();

        this.paintFrameGrid();

        return this;
    }

    paintFrameGrid() {
        this.canvas.resetTransform();

        for (let x = TIMELINE_PADDING.left; x <= this.actualTimeLine.width; x += this.frameShape.width) {
            const panel = this.getPanelAt(this.getFrameTime(x));
            this.canvas.rect(panel.shape.clone().transformTo(this.getFrameShape(x)), FRAME_BORDER_COLOR);
        }
    }

    getFrameShape(x: number): Rectangle {
        return this.frameShape.clone().translate(x);
    }

    getFrameTime(x: number): number {
        const start = this.getTimeAt(x);
        const end = this.getTimeAt(x + this.frameShape.width);
        return Math.max(start, Math.min(end, this.currentTime));
    }

    paintCurrentTime(currentTime: number) {
        if (this.getPixelAt(currentTime) >= this.canvas.width) {
            this.player.resetPlayer();
        }
        this.setCurrentTime(currentTime);
        window.requestAnimationFrame(() => {
            this.paint();
            const x = this.getPixelAt(this.currentTime);
            this.canvas.lineFromTo(
                new Point(x, this.actualTimeLine.from.y - this.frameShape.height),
                new Point(x, this.actualTimeLine.from.y + this.frameShape.height),
                CURRENT_TIME_COLOR
            )
        })
    }

    layoutPanel(panel: Panel, time) {
        setPanelAnimationTime(panel, time);
        this.layoutEngine.layoutPanelContent(panel, this.panelPainter.canvas);
        this.scene.setupImages(this.images);
    }
}