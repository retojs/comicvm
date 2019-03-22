import { Panel } from "../model/Panel";
import { Canvas } from "../dom/Canvas";
import { LayoutConfig } from "../layout/Layout.config";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";
import { PaintConfig } from "./Paint.config";
import { BubblePainter } from "./BubblePainter";
import { Character } from "../model/Character";

interface CharacterPaintOptions {
    paintImage?: boolean,
    paintRect?: boolean,
    paintName?: boolean
}

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
            zoom = panel.zoom;
        }
        return this.getZoomedShape(panel.shape, zoom);
    }

    paintBackground(panel: Panel) {
        // TODO:
        // calc image size after each character layout
        // if animation is defined calculate for start and end
        // multiple images for different distances of the same background will keep proportional
        //
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

    paintCharacters(panel: Panel, options: CharacterPaintOptions) {
        if (panel.characterImageGroups && panel.characterImageGroups.length > 0) {
            panel.characterImageGroups.forEach((group: string | string[]) => {
                if (typeof group === 'string') {
                    this.paintSingleCharacter(panel, panel.getCharacter(group), options);
                } else {
                    this.paintGroupOfCharacters(panel, group, options);
                }
            });
        }
    }

    paintSingleCharacter(panel: Panel, character: Character, options: CharacterPaintOptions) {
        const position = character.getPosition();
        const isActor = !!panel.getActor(character.name);
        if (!options || options.paintImage) {
            this.canvas.drawImage(character.image, character.getImageDimensions(position));
        }
        if (!options || options.paintRect) {
            this.canvas.rect(position, isActor ? PaintConfig.of.character.actor.box : PaintConfig.of.character.box);
        }
        if (!options || options.paintName) {
            this.canvas.text(character.name,
                position.center.translate(0, position.height / 2 + this.canvas.getLineHeight()),
                isActor ? PaintConfig.of.character.actor.name : PaintConfig.of.character.name);
        }
    }

    paintGroupOfCharacters(panel: Panel, group: string[], options: CharacterPaintOptions) {
        const characterBBox = Rectangle.getBoundingBox(group.map(name => panel.getCharacter(name).getPosition()));
        const containsActor = group.some(name => !!panel.getActor(name));
        if (!options || options.paintImage) {
            const image = panel.getCharacter(group[0]).image;
            if (image) {
                const imageDim = Rectangle.fitAroundBounds(image.bitmapShape, characterBBox);
                this.canvas.drawImage(image, imageDim);
            }
        }
        if (!options || options.paintRect) {
            this.canvas.rect(characterBBox, containsActor ? PaintConfig.of.character.actor.box : PaintConfig.of.character.box);
            group.forEach(name => this.canvas.rect(
                panel.getCharacter(name).getPosition(),
                panel.getActor(name) ? PaintConfig.of.character.actor.box : PaintConfig.of.character.box)
            )
        }
        if (!options || options.paintName) {
            this.canvas.text(group.join(" "),
                characterBBox.center.translate(0, characterBBox.height / 2 + this.canvas.getLineHeight()),
                containsActor ? PaintConfig.of.character.actor.name : PaintConfig.of.character.name);
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