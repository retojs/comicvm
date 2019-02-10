import { LayoutConfig, MarginConfig, TextAlign } from "../layout/Layout.config";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";
import { PaintConfig, PaintStyleConfig } from "../paint/Paint.config";
import { Line } from "../trigo/Line";
import { getScrollOffset } from "./util";
import { DomElement, DomElementContainer } from "./DomElement";
import { Img } from "./Img";

export const enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}

export class Canvas extends DomElement<HTMLCanvasElement> {

    domElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    width: number;
    height: number;
    scale: number;

    // a cache for line heights per font
    private lineHeights: number[] = [];

    constructor(container: DomElementContainer, width?: number, height?: number) {
        super(container);

        this.width = width;
        this.height = height;
        this.scale = this.width / LayoutConfig.page.width;

        this.domElement = this.add(this.createCanvasElement());

        this.ctx = this.domElement.getContext("2d");
        this.ctx.scale(this.scale, this.scale);
        this.ctx.font = PaintConfig.canvas.font;
    }

    createCanvasElement(): HTMLCanvasElement {
        this.domElement = document.createElement("canvas");
        this.domElement.width = this.width;
        this.domElement.height = this.height;
        return this.domElement;
    }

    begin() {
        this.ctx.save();
    }

    end() {
        this.ctx.restore();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width / this.scale, this.height / this.scale);
    }

    setClip(clip: Rectangle) {
        this.ctx.beginPath();
        this.ctx.moveTo(clip.x, clip.y);
        this.ctx.lineTo(clip.x + clip.width, clip.y);
        this.ctx.lineTo(clip.x + clip.width, clip.y + clip.height);
        this.ctx.lineTo(clip.x, clip.y + clip.height);
        this.ctx.clip();
    }

    circle(origin: Point, radius: number, config: PaintStyleConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.beginPath();
        this.ctx.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
        this.strokeOrFill(config);
        this.end();
    }

    line(line: Line, config: PaintStyleConfig) {
        return this.lineFromTo(line.from, line.to, config);
    }

    lineFromTo(from: Point, to: Point, config: PaintStyleConfig) {
        return this.lineXY(from.x, from.y, to.x, to.y, config);
    }

    lineXY(fromX: number, fromY: number, toX: number, toY: number, config: PaintStyleConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.lineWidth = config.lineWidth || this.ctx.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.strokeOrFill(config);
        this.end();
    }

    bezier(from: Point, to: Point, cp: Point, config: PaintStyleConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.lineWidth = config.lineWidth || this.ctx.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.quadraticCurveTo(cp.x, cp.y, to.x, to.y);
        this.strokeOrFill(config);
        this.end();
    }

    rect(rectangle: Rectangle, config: PaintStyleConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.beginPath();
        this.ctx.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        this.strokeOrFill(config);
        this.end();
    }

    roundRect(rectangle: Rectangle, radius: MarginConfig, config: PaintStyleConfig) {
        if (!config.enabled) { return; }
        this.begin();
        this.ctx.beginPath();
        this.ctx.moveTo(
            rectangle.x + radius.left,
            rectangle.y
        );
        this.ctx.lineTo(
            rectangle.x + rectangle.width - radius.right,
            rectangle.y
        );
        this.ctx.quadraticCurveTo(
            rectangle.x + rectangle.width,
            rectangle.y,
            rectangle.x + rectangle.width,
            rectangle.y + radius.top
        );
        this.ctx.lineTo(
            rectangle.x + rectangle.width,
            rectangle.y + rectangle.height - radius.top
        );
        this.ctx.quadraticCurveTo(
            rectangle.x + rectangle.width,
            rectangle.y + rectangle.height,
            rectangle.x + rectangle.width - radius.right,
            rectangle.y + rectangle.height
        );
        this.ctx.lineTo(
            rectangle.x + radius.left,
            rectangle.y + rectangle.height
        );
        this.ctx.quadraticCurveTo(
            rectangle.x,
            rectangle.y + rectangle.height,
            rectangle.x,
            rectangle.y + rectangle.height - radius.bottom
        );
        this.ctx.lineTo(
            rectangle.x,
            rectangle.y + radius.top
        );
        this.ctx.quadraticCurveTo(
            rectangle.x,
            rectangle.y,
            rectangle.x + radius.left,
            rectangle.y
        );
        this.ctx.closePath();
        this.strokeOrFill(config);
        this.end();
    }

    strokeOrFill(config: PaintStyleConfig) {
        if (config.fillStyle) {
            this.ctx.fillStyle = config.fillStyle;
            this.ctx.fill();
        }
        if (config.strokeStyle) {
            this.ctx.lineWidth = config.lineWidth || this.ctx.lineWidth;
            this.ctx.lineCap = config.lineCap || this.ctx.lineCap;
            this.ctx.strokeStyle = config.strokeStyle;
            this.ctx.stroke();
        }
    }

    text(text: string, pos: Point, config: PaintStyleConfig) {
        if (!config.enabled) { return; }

        this.begin();
        if (config.fillStyle) {
            this.ctx.fillStyle = config.fillStyle;
        }
        if (config.font) {
            this.ctx.font = config.font;
        }
        let x = pos.x;
        if (config.textAlign === TextAlign.Center) {
            x -= this.getTextWidth(text) / 2;
        } else if (config.textAlign === TextAlign.Right) {
            x -= this.getTextWidth(text);
        }
        this.ctx.fillText(text, x, pos.y);

        this.end();
    }

    getTextWidth(text: string, font?: string): number {
        this.begin();
        if (font) {
            this.ctx.font = font;
        }
        const textWidth = this.ctx.measureText(text).width;
        this.end();
        return textWidth;
    }

    getLineHeight(font?: string): number {
        this.begin();
        if (font) {
            this.ctx.font = font;
        }
        const currentFont = this.ctx.font;
        if (!this.lineHeights[currentFont]) {
            const temp = document.createElement("div");
            temp.setAttribute("style", "margin: 0px; padding: 0px; font:" + currentFont);
            temp.innerHTML = ".";
            document.body.appendChild(temp);
            this.lineHeights[currentFont] = temp.clientHeight;
            temp.parentNode.removeChild(temp);
        }
        this.end();

        return this.lineHeights[currentFont];
    }

    drawImage(img: Img, dimensions: Rectangle) {
        if (!img) { return; }

        this.begin();
        this.ctx.drawImage(
            img.domElement,
            dimensions.x,
            dimensions.y,
            dimensions.width,
            dimensions.height
        );
        this.end();
    }

    /**
     * Returns the canvas coordinates to draw a point at the specified mouse position (clientX, clientY)
     *
     * @param clientX
     * @param clientY
     */
    getCanvasPositionFromMousePosition(clientX: number, clientY: number): Point {
        const x = clientX - this.domElement.getBoundingClientRect().left;
        const y = clientY - this.domElement.getBoundingClientRect().top + getScrollOffset().top;

        return new Point(x / this.scale, y / this.scale);
    }

    /**
     * Returns the mouse coordinates (clientX, clientY) of the point drawn on the canvas
     * at the specified position (x, y).
     *
     * @param x
     * @param y
     */
    getMousePositionFromCanvasPosition(x: number, y: number): Point {
        const clientX = x * this.scale + this.domElement.getBoundingClientRect().left;
        const clientY = y * this.scale + this.domElement.getBoundingClientRect().top + getScrollOffset().top;

        return new Point(clientX, clientY);
    }
}