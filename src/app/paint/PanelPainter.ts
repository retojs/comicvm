import { Panel } from "../model/Panel";
import { Canvas } from "../dom/Canvas";
import { LayoutConfig } from "../layout/Layout.config";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";
import { PaintConfig } from "./Paint.config";
import { BubblePainter } from "./BubblePainter";

export class PanelPainter {

    canvas: Canvas;

    bubblePainter: BubblePainter;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.bubblePainter = new BubblePainter(canvas);
    }

    paintPanel(panel: Panel) {
        this.canvas.begin();
        this.canvas.setClip(panel.shape);

        this.paintBackground(panel);
        this.paintGrid(panel);
        this.paintCharactersBBox(panel);
        this.paintActorsBBox(panel);
        this.paintCharacters(panel, {paintImage: true});
        this.paintCharacters(panel, {paintRect: true});
        this.paintCharacters(panel, {paintName: true});
        this.bubblePainter.paintBubbles(panel);
        this.paintBorder(panel);

        this.canvas.end();
    }

    paintBorder(panel: Panel) {
        if (panel.shape) {
            this.canvas.rect(panel.shape, PaintConfig.of.panel.border);
            // this.canvas.rect(panel.shape.clone().cutMargin(panel.strip.panelConfig.padding), PaintConfig.of.debug.line);
        }
    }

    paintGrid(panel: Panel) {
        if (!PaintConfig.of.panel.grid.enabled) { return; }

        this.canvas.begin();

        const characterSize = panel.characters[0].defaultPosition.size;
        if (!characterSize) { return; }

        const zoomedPanel = this.getZoomedPanelShape(panel);

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

    getZoomedShape(shape: Rectangle, zoom: number) {
        return shape.clone().scale(zoom, shape.center);
    }

    getZoomedPanelShape(panel: Panel): Rectangle {
        let zoom = 1;
        if (LayoutConfig.applyZoom) {
            zoom = panel.getZoom();
        }
        return this.getZoomedShape(panel.shape, zoom);
    }

    paintBackground(panel: Panel) {
        console.log("panel bgr image ", panel.background.image);

        const imageDimensions: Rectangle = panel.background.getImageDimensions(panel);
        if (panel.background.image) {
            this.canvas.drawImage(panel.background.image, imageDimensions);
        } else {
            // paint background placeholder
            this.canvas.rect(imageDimensions, PaintConfig.of.background.placeholder);
            this.canvas.lineFromTo(imageDimensions.topLeft,
                imageDimensions.bottomRight,
                PaintConfig.of.background.placeholder
            );
            this.canvas.lineFromTo(imageDimensions.topRight,
                imageDimensions.bottomLeft,
                PaintConfig.of.background.placeholder
            );
        }
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

}