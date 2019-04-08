import { Div } from "../../common/dom/Div";
import { Canvas } from "../../common/dom/Canvas";
import { Scene } from "../model/Scene";
import { DomElementContainer } from "../../common/dom/DomElement";
import { isPlayingPanel, setPanelAnimationTime, Timeline } from "./Timeline";
import { PanelPainter } from "../paint/PanelPainter";
import { Rectangle } from "../../common/trigo/Rectangle";
import { Dimensions } from "../../common/trigo/Dimensions";
import { Line } from "../../common/trigo/Line";
import { Point } from "../../common/trigo/Point";
import { PaintStyleConfig } from "../../common/style/PaintStyle";
import { Player } from "./Player";
import { Font } from "../../common/style/Font";
import { Images } from "../images/Images";
import { TimelinePlayer } from "./TimelinePlayer";
import { PaintConfig } from "../paint/Paint.config";
import { Button } from "../../common/dom/Button";
import { Panel } from "../model/Panel";
import { LayoutEngine } from "../layout/engine/LayoutEngine";

const FRAME_BOUNDS = new Dimensions(50, 50);
const TIMELINE_PLAYER_WIDTH = 600;
const TIMELINE_PLAYER_HEIGHT = 400;

const BACKGROUND_COLOR = PaintStyleConfig.fill("white");
const PANEL_BACKGROUND_COLOR = PaintStyleConfig.fill("black");
const FRAME_BORDER_COLOR = PaintStyleConfig.stroke("white", 1);
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

    player: Player;
    timelinePlayer: TimelinePlayer;
    playButton: Button;
    timeDisplay: Div;
    onTimeChange: TimeChangeListener;
    currentTime: number;

    mousePressed: boolean;

    constructor(container: DomElementContainer, scene: Scene, onTimeChange?: TimeChangeListener) {
        this.root = new Div(container, "timeline-editor");
        this.timelinePlayerPanel = new Div(this.root, "panel-player");
        this.timelinePanel = new Div(this.root, "timeline");
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


    setup(width: number, height: number, font: Font, images: Images): TimelineEditor {
        this.setupCanvas(width, height, font);
        this.images = images;
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

        this.actualTimeLine = new Line(
            new Point(
                0,
                this.canvas.shape.translateToOrigin().center.y
            ),
            new Point(
                this.canvas.shape.width,
                this.canvas.shape.translateToOrigin().center.y
            )
        );
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
            this.timeDisplay.setContent((time / 1000).toFixed(2) + " sec");
        }
    }

    setupTimelinePlayer(images: Images) {

        this.timelinePlayer = new TimelinePlayer(
            this.timelinePlayerPanel,
            this.scene
        ).setup(TIMELINE_PLAYER_WIDTH, TIMELINE_PLAYER_HEIGHT, PaintConfig.canvas.font, images);

        this.setupPlayButton();
    }

    setupPlayButton() {

        this.playButton = new Button(this.timelinePlayerPanel, "Restart", () => {
            this.reset();
            this.play();
            this.timelinePlayer.reset();
            this.timelinePlayer.play();
            this.playButton.domElement.blur();
        });
    }

    onSpacePressed() {
        if (this.currentTime >= this.getTimeAt(this.canvas.shape.width)) {
            this.setCurrentTime(0);
        }
        this.mousePressed = false;
    }

    play() {this.player.play();}

    reset() {this.player.reset();}

    setCurrentTime(time: number) {
        this.currentTime = time;
        this.onTimeChange(time);
    }

    get timePerPixel(): number {
        return this.timeline.duration / this.canvas.shape.width;
    }

    getTimeAt(x: number) {
        return Math.min(this.canvas.shape.width, Math.max(0, x)) * this.timePerPixel;
    }

    getPixelAt(time: number) {
        return Math.min(this.canvas.shape.width, Math.max(0, time / this.timePerPixel));
    }

    getPanelAt(x: number) {
        return this.scene.panels.find(panel => isPlayingPanel(panel, this.getTimeAt(x)));
    }

    paint() {
        this.canvas.clear();
        for (let x = 0; x < this.canvas.shape.width; x += this.frameBounds.width) {
            const time = this.getFrameTime(x);
            const frameShape = this.getFrameShape(x);
            const panel = this.getPanelAt(x);
            if (panel) {
                this.layoutPanel(panel, time);
                this.canvas.begin();
                this.canvas.rect(frameShape, PANEL_BACKGROUND_COLOR);
                this.canvas.transformTo(panel.shape, frameShape);
                this.panelPainter.paintPanelWithTransitions(panel, time);
                this.canvas.end();
            }
        }
        this.paintFrameGrid();
        return this;
    }

    paintFrameGrid() {
        const frameShape = this.getFrameShape(0);

        for (let x = 0; x < this.canvas.shape.width; x += this.frameBounds.width) {
            this.canvas.lineXY(x, frameShape.y,
                x, frameShape.y + frameShape.height,
                FRAME_BORDER_COLOR
            );
        }
    }

    getFrameShape(x: number): Rectangle {
        const y = this.actualTimeLine.from.y - this.frameBounds.height / 2;
        return Rectangle.fromDimensions(this.frameBounds, x, y);
    }

    getFrameTime(x: number): number {
        const start = this.getTimeAt(x);
        const end = this.getTimeAt(x + this.frameBounds.width);
        return Math.max(start, Math.min(end, this.currentTime));
    }

    paintCurrentTime(currentTime: number) {
        if (this.getPixelAt(currentTime) >= this.canvas.width) {
            this.player.reset();
        }
        this.setCurrentTime(currentTime);
        window.requestAnimationFrame(() => {
            this.paint();
            const x = this.getPixelAt(this.currentTime);
            this.canvas.lineFromTo(
                new Point(x, this.actualTimeLine.from.y - this.frameBounds.height),
                new Point(x, this.actualTimeLine.from.y + this.frameBounds.height),
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