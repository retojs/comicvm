import { Panel } from "../model/Panel";
import { LayoutConfig } from "../layout/Layout.config";
import { PaintConfig } from "./Paint.config";
import { Point } from "../../common/trigo/Point";
import { Bubble } from "../model/Bubble";
import { Canvas } from "../../common/dom/Canvas";
import { BubblePointer } from "../model/BubblePointer";

export class BubblePainter {

    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    paintBubbles(panel: Panel, animateBubbles: boolean = false) {
        panel.bubbles
            .filter(bubble => !!bubble.shape)
            .filter(bubble => animateBubbles && bubble.animationTimeProperties
                ? bubble.animationTimeProperties.start <= panel.animationTime * panel.animationTimeProperties.duration
                : true)
            .forEach(bubble => {
                if (bubble.isOffScreen) {
                    this.canvas.rect(bubble.shape, PaintConfig.of.bubble.textBox);
                    this.paintTextLeftAligned(bubble);
                } else {
                    this.canvas.roundRect(bubble.shape, LayoutConfig.bubble.radius, PaintConfig.of.bubble.textBox);
                    bubble.pointers.forEach(this.paintBubblePointer.bind(this));
                    this.paintTextCentered(bubble);
                }
            });
    }

    paintTextCentered(bubble: Bubble) {
        let linePos = new Point(
            bubble.shape.center.x,
            bubble.shape.y + LayoutConfig.bubble.padding.top + bubble.textBox.lineHeight * LayoutConfig.bubble.verticalAlign
        );
        bubble.textBox.lines.forEach(line => {
            this.canvas.text(line, linePos, PaintConfig.of.bubble.text);
            linePos.y += bubble.textBox.lineHeight;
        });
    }

    paintTextLeftAligned(bubble: Bubble) {
        let linePos = new Point(
            bubble.shape.x + LayoutConfig.bubble.offScreen.padding.left,
            bubble.shape.y + LayoutConfig.bubble.offScreen.padding.top + bubble.textBox.lineHeight * LayoutConfig.bubble.verticalAlign
        );
        bubble.textBox.lines.forEach(line => {
            this.canvas.text(line, linePos, PaintConfig.of.bubble.offScreen.text);
            linePos.y += bubble.textBox.lineHeight;
        });
    }

    paintBubblePointer(pointer: BubblePointer): void {
        const from = pointer.characterEnd;
        const toLeft = pointer.bubbleEndLeft;
        const toRight = pointer.bubbleEndRight;
        const cpLeft = pointer.cpLeft;
        const cpRight = pointer.cpRight;

        if (from && toLeft && toRight && cpLeft && cpRight) {
            this.canvas.begin();
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(toLeft.x, toLeft.y - PaintConfig.of.bubble.textBox.lineWidth);
            this.canvas.ctx.quadraticCurveTo(cpLeft.x, cpLeft.y, from.x, from.y);
            this.canvas.ctx.quadraticCurveTo(cpRight.x, cpRight.y, toRight.x, toRight.y - PaintConfig.of.bubble.textBox.lineWidth);
            this.canvas.ctx.closePath();
            this.canvas.ctx.fillStyle = PaintConfig.of.bubble.textBox.fillStyle;
            this.canvas.ctx.fill();
            this.canvas.end();

            if (PaintConfig.isDebug.bubblePointer) {
                this.canvas.line(pointer.fromCharacterToBubbleCenter, PaintConfig.debugStyle.bubblePointer.baseLine);
                this.canvas.circle(pointer.characterEnd, 5, PaintConfig.debugStyle.bubblePointer.baseLineEnds);
                this.canvas.circle(pointer.bubble.shape.center, 5, PaintConfig.debugStyle.bubblePointer.baseLineEnds);
                this.canvas.lineFromTo(toLeft, cpLeft, PaintConfig.debugStyle.bubblePointer.controlPointLine);
                this.canvas.lineFromTo(toRight, cpRight, PaintConfig.debugStyle.bubblePointer.controlPointLine);
                this.canvas.circle(cpLeft, 5, PaintConfig.debugStyle.bubblePointer.controlPoint);
                this.canvas.circle(cpRight, 5, PaintConfig.debugStyle.bubblePointer.controlPoint);
            }

            this.canvas.bezier(from, toLeft, cpLeft, PaintConfig.of.bubble.pointer);
            this.canvas.bezier(from, toRight, cpRight, PaintConfig.of.bubble.pointer);
        }
    }
}