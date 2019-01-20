import { Panel } from "../model/Panel";
import { Canvas } from "../dom/Canvas";
import { LayoutConfig } from "../layout/LayoutConfig";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";
import { PaintConfig } from "./PaintConfig";
import { Character } from "../model/Character";
import { Bubble } from "../model/Bubble";

export class PanelPainter {

    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    paintPanel(panel: Panel) {
        this.canvas.begin();
        this.canvas.setClip(panel.shape);

        this.paintGrid(panel);
        this.paintCharactersBBox(panel);
        this.paintActorsBBox(panel);
        this.paintCharacters(panel, {paintImage: true});
        this.paintCharacters(panel, {paintRect: true});
        this.paintCharacters(panel, {paintName: true});
        this.paintBubbles(panel);
        this.paintBorder(panel);

        this.canvas.end();
    }

    paintBorder(panel: Panel) {
        if (panel.shape) {
            this.canvas.rect(panel.shape, PaintConfig.of.panel.border);
        }
    }

    paintGrid(panel: Panel) {
        if (!PaintConfig.of.panel.grid.enabled) { return; }

        this.canvas.begin();

        const characterSize = panel.characters[0].defaultPosition.size;
        if (!characterSize) { return; }

        let zoom = 1;
        if (LayoutConfig.applyZoom) {
            zoom = panel.getZoom();
        }
        const zoomedPanel = panel.shape.clone().scale(zoom, panel.shape.center);

        const lineCount = {
            x: Math.floor(zoomedPanel.width / characterSize),
            y: Math.floor(zoomedPanel.height / characterSize)
        };
        const offset = {
            x: characterSize / 2,
            y: (zoomedPanel.height % characterSize) / 2 + (lineCount.y % 2 === 0 ? characterSize / 2 : 0)
        };

        for (let i = 0; i < lineCount.x; i++) {
            this.canvas.lineFromTo(
                new Point(
                    zoomedPanel.x + offset.x + i * characterSize,
                    zoomedPanel.y
                ),
                new Point(
                    zoomedPanel.x + offset.x + i * characterSize,
                    zoomedPanel.y + zoomedPanel.height
                ),
                PaintConfig.of.panel.grid);
        }
        for (let i = 0; i <= lineCount.y; i++) {
            this.canvas.lineFromTo(
                new Point(
                    zoomedPanel.x,
                    zoomedPanel.y + offset.y + i * characterSize
                ),
                new Point(
                    zoomedPanel.x + zoomedPanel.width,
                    zoomedPanel.y + offset.y + i * characterSize
                ),
                PaintConfig.of.panel.grid);
        }

        this.canvas.end();
    }

    paintCharacters(panel: Panel, options: { paintImage?: boolean, paintRect?: boolean, paintName?: boolean }) {
        if (panel.characters && panel.characters.length > 0) {
            panel.characters.forEach(chr => {
                const position = chr.getPosition();
                const isActor = !!panel.getActor(chr.name);
                if (!options || options.paintImage) {
                    this.canvas.drawImage(chr.image, chr.getImageDimensions(position));
                }
                if (!options || options.paintRect) {
                    this.canvas.rect(position, isActor ? PaintConfig.of.character.actor.box : PaintConfig.of.character.box);
                }
                if (!options || options.paintName) {
                    this.canvas.text(chr.name,
                        position.center.translate(0, position.height / 2 + this.canvas.getLineHeight()),
                        isActor ? PaintConfig.of.character.actor.name : PaintConfig.of.character.name);
                }
            });
        }
    }

    paintCharactersBBox(panel: Panel) {
        const charactersBbox: Rectangle = Rectangle.getBoundingBox(panel.characters.map(c => c.backgroundPosition));
        this.canvas.rect(charactersBbox, PaintConfig.of.character.bbox);
    }

    paintActorsBBox(panel: Panel) {
        const actorsBbox: Rectangle = Rectangle.getBoundingBox(panel.actors.map(c => c.backgroundPosition));
        this.canvas.rect(actorsBbox, PaintConfig.of.character.actor.bbox);
    }

    paintBubbles(panel: Panel) {
        panel.bubbles.forEach(bubble => {

            bubble.who.forEach(name => this.paintBubblePointer(bubble, panel.getCharacter(name)));

            this.canvas.roundRect(bubble.shape, LayoutConfig.bubbles.radius, PaintConfig.of.bubble.border);
            // this.canvas.rect(bubble.shape.clone().cutMargin(LayoutConfig.bubbles.padding), PaintConfig.of.bubble.helper);

            let linePos = new Point(
                bubble.shape.center.x,
                bubble.shape.y + LayoutConfig.bubbles.padding.top + bubble.textBox.lineHeight * LayoutConfig.bubbles.verticalAlign
            );
            bubble.textBox.lines.forEach(line => {
                this.canvas.text(line, linePos, PaintConfig.of.bubble.text);
                linePos.y += bubble.textBox.lineHeight;
            });
        });
    }

    paintBubblePointer(bubble: Bubble, character: Character) {
        const chrPos = character.getPosition();

        // By default the pointer goes straight up to the bubble from the character's position
        const from = new Point(
            chrPos.x + chrPos.size / 2,
            chrPos.y - LayoutConfig.bubbles.pointerVerticalDistanceFromCharacter * chrPos.size
        );
        const to = new Point(
            from.x,
            bubble.shape.y + bubble.shape.height
        );

        // adjust x position of attachment to bubble
        const horizontalOffset = LayoutConfig.bubbles.pointerHorizontalDistanceFromBubbleCenter * (bubble.shape.width - LayoutConfig.bubbles.radius.horizontal) / 2;
        const bubbleLeftEnd = bubble.shape.center.x - horizontalOffset;
        const bubbleRightEnd = bubble.shape.center.x + horizontalOffset;
        if (from.x < bubbleLeftEnd) {
            to.x = bubbleLeftEnd;
        }
        if (from.x > bubbleRightEnd) {
            to.x = bubbleRightEnd
        }

        // adjust x position of the pointer's origin near the character
        if (from.x !== to.x) {
            if (from.x < to.x) {
                from.x = Math.min(to.x, from.x + chrPos.size / 2);
            } else {
                from.x = Math.max(to.x, from.x - chrPos.size / 2);
            }
        }

        // calculate control point for bezier curve
        const distance = from.distanceTo(to);
        if (distance.y > 0) { return; } // don't paint a pointer if bubble overlaps character
        const cp = new Point(
            to.x,
            to.y - distance.y / 2
        );

        this.canvas.bezier(from, to, cp, PaintConfig.of.bubble.pointerHalo);
        this.canvas.bezier(from, to, cp, PaintConfig.of.bubble.pointer);
    }
}