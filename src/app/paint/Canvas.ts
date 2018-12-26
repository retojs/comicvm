import { LayoutConfig, PaintConfig } from "../layout/LayoutConfig";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";

export class Canvas {

    width: number;
    height: number;
    scale: number;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    container: HTMLElement;

    constructor(container: HTMLElement | string, width: number, height: number) {
        this.width = width;
        this.height = height;

        this.scale = Math.min(this.width / LayoutConfig.page.width, this.height / LayoutConfig.page.height);

        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        this.container = container;
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext("2d");
        this.ctx.scale(this.scale, this.scale);

        container.appendChild(this.canvas);
    }

    createCanvas(): HTMLCanvasElement {
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
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    setClip(clip: Rectangle) {
        this.ctx.beginPath();
        this.ctx.moveTo(clip.x, clip.y);
        this.ctx.lineTo(clip.x + clip.width, clip.y);
        this.ctx.lineTo(clip.x + clip.width, clip.y + clip.height);
        this.ctx.lineTo(clip.x, clip.y + clip.height);
        this.ctx.clip();
    }

    line(from: Point, to: Point, config: PaintConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.lineWidth = config.lineWidth || this.ctx.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = config.strokeStyle || this.ctx.strokeStyle;
        this.ctx.stroke();
        this.end();
    }

    rect(rectangle: Rectangle, config: PaintConfig) {
        if (!config.enabled) { return; }

        this.begin();
        this.ctx.beginPath();
        this.ctx.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        if (config.strokeStyle) {
            this.ctx.lineWidth = config.lineWidth || this.ctx.lineWidth;
            this.ctx.strokeStyle = config.strokeStyle;
            this.ctx.stroke();
        }
        if (config.fillStyle) {
            this.ctx.fillStyle = config.fillStyle;
            this.ctx.fill();
        }
        this.end();
    }
}