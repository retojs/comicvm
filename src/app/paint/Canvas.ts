import { LayoutConfig, MarginConfig, TextAlign } from "../layout/LayoutConfig";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";
import { PaintConfig, PaintStyleConfig } from "./PaintConfig";

export const enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}

export class Canvas {

    width: number;
    height: number;
    scale: number;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    container: HTMLElement;

    // a cache for line heights per font
    private lineHeights: number[] = [];

    constructor(container: HTMLElement | string, width?: number, height?: number) {
        this.width = width;
        this.height = height;

        this.scale = this.width / LayoutConfig.page.width;

        this.canvas = this.createCanvasElement();
        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(this.scale, this.scale);
        this.ctx.font = PaintConfig.canvas.font;

        if (container) {
            if (typeof container === "string") {
                container = document.getElementById(container);
            }
            this.container = container;
            container.appendChild(this.canvas);
        }
    }

    createCanvasElement(): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
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

    line(from: Point, to: Point, config: PaintStyleConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.lineWidth = config.lineWidth || this.ctx.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
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
}