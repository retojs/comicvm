import { LayoutConfig } from "../layout/LayoutConfig";
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
        this.ctx.scale(this.scale, this.scale);
    }

    end() {
        this.ctx.restore();
    }

    line(from: Point, to: Point, strokeStyle?: string) {
        this.begin();
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = strokeStyle ? strokeStyle : this.ctx.strokeStyle;
        this.ctx.stroke();
        this.end();
    }

    rect(rectangle: Rectangle, strokeStyle?: string, fillStyle?: string) {
        this.begin();
        this.ctx.beginPath();
        this.ctx.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
            this.ctx.stroke();
        }
        if (fillStyle) {
            this.ctx.fillStyle = fillStyle;
            this.ctx.fill();
        }
        this.end();
    }
}