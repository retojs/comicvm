import { Panel } from "../model/Panel";
import { LayoutConfig } from "../layout/Layout.config";
import { PaintConfig } from "./Paint.config";
import { Point } from "../trigo/Point";
import { Bubble } from "../model/Bubble";
import { Character } from "../model/Character";
import { Canvas } from "../dom/Canvas";

export class BubblePainter {

    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    paintBubbles(panel: Panel) {
        panel.bubbles
            .filter(bubble => !!bubble.shape)
            .forEach(bubble => {
                if (bubble.isOffScreen) {
                    this.canvas.rect(bubble.shape, PaintConfig.of.bubble.textBox);
                    this.paintTextLeftAligned(bubble);
                } else {
                    this.canvas.roundRect(bubble.shape, LayoutConfig.bubble.radius, PaintConfig.of.bubble.textBox);
                    // this.canvas.rect(bubble.shape.clone().addMargin(LayoutConfig.bubble.margin), PaintStyleConfig.stroke('red'));

                    bubble.who.forEach(name => {
                        if (panel.characterNames.indexOf(name) > -1) {
                            this.paintBubblePointer(...this.calculateBubblePointer(bubble, panel.getCharacter(name)));
                        }
                    });

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

    calculateBubblePointer(bubble: Bubble, character: Character): Point[] {
        const chrPos = character.getPosition();

        // By default the pointer goes straight up to the bubble from the character's position
        const nearCharacter = new Point(
            chrPos.x + chrPos.size / 2,
            chrPos.y - LayoutConfig.bubble.pointer.verticalDistanceFromCharacter * chrPos.size
        );
        const nearBubble = new Point(
            nearCharacter.x,
            bubble.shape.y + bubble.shape.height
        );

        // adjust x position of attachment to bubble
        const horizontalOffset = LayoutConfig.bubble.pointer.horizontalDistanceFromBubbleCenter * (bubble.shape.width - LayoutConfig.bubble.radius.horizontal) / 2;
        const bubbleLeftEnd = bubble.shape.center.x - horizontalOffset;
        const bubbleRightEnd = bubble.shape.center.x + horizontalOffset;
        if (nearCharacter.x < bubbleLeftEnd) {
            nearBubble.x = bubbleLeftEnd;
        }
        if (nearCharacter.x > bubbleRightEnd) {
            nearBubble.x = bubbleRightEnd
        }

        // adjust x position of the pointer's origin near the character
        if (nearCharacter.x !== nearBubble.x) {
            if (nearCharacter.x < nearBubble.x) {
                nearCharacter.x = Math.min(nearBubble.x, nearCharacter.x + chrPos.size / 2);
            } else {
                nearCharacter.x = Math.max(nearBubble.x, nearCharacter.x - chrPos.size / 2);
            }
        }

        const distance = nearBubble.distanceTo(nearCharacter);
        const bendLeft = nearBubble.x > nearCharacter.x;
        const bendRight = !bendLeft;
        const deltaWidth = LayoutConfig.bubble.pointer.widthNearBubble - LayoutConfig.bubble.pointer.controlPointWidth;

        // calculate control points for bezier curve
        if (distance.y < 0) {
            return null; // don't paint a pointer if bubble overlaps character
        }

        const toLeft = nearBubble.clone().translate(-LayoutConfig.bubble.pointer.widthNearBubble / 2);
        const toRight = nearBubble.clone().translate(LayoutConfig.bubble.pointer.widthNearBubble / 2);

        const cpLeft = toLeft.clone().translate(
            bendRight ? 0 : deltaWidth,
            distance.y * LayoutConfig.bubble.pointer.controlPointVerticalPosition);
        const cpRight = toRight.clone().translate(
            bendLeft ? 0 : -deltaWidth,
            distance.y * LayoutConfig.bubble.pointer.controlPointVerticalPosition);

        return [nearCharacter, toLeft, toRight, cpLeft, cpRight];
    }

    // TODO
    // make paint method configurable
    // - allow override of PaintConfig.paintBubblePointer default function

    paintBubblePointer(from?: Point, toLeft?: Point, toRight?: Point, cpLeft?: Point, cpRight?: Point) {
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

            this.canvas.bezier(from, toLeft, cpLeft, PaintConfig.of.bubble.pointer);
            this.canvas.bezier(from, toRight, cpRight, PaintConfig.of.bubble.pointer);
        }
    }
}