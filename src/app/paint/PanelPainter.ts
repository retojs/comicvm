import { Panel } from "../model/Panel";
import { Canvas } from "./Canvas";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/LayoutConfig";
import { Square } from "../trigo/Square";
import { Rectangle } from "../trigo/Rectangle";
import { Point } from "../trigo/Point";
import { LayoutEngine } from "../layout/LayoutEngine";

export class PanelPainter {

    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    paintPanel(panel: Panel) {
        this.paintGrid(panel);
        this.paintCharactersBBox(panel);
        this.paintActorsBBox(panel);
        this.paintCharacters(panel);
        this.paintBorder(panel);
    }

    paintBorder(panel: Panel) {
        if (panel.shape) {
            this.canvas.rect(panel.shape, LayoutConfig.feature.panel.border);
        }
    }

    paintGrid(panel: Panel) {
        if (!LayoutConfig.feature.panel.grid.enabled) { return; }

        this.canvas.begin();

        const characterSize = panel.characters[0].defaultPosition.size;
        if (!characterSize) { return; }

        const zoom = LayoutEngine.getZoom(panel);
        const zoomedPanel = panel.shape.clone().scale(zoom, panel.shape.center);

        const lineCount = {
            x: Math.floor(zoomedPanel.width / characterSize),
            y: Math.floor(zoomedPanel.height / characterSize)
        };
        const offset = {
            x: characterSize / 2,
            y: (zoomedPanel.height % characterSize) / 2 + (lineCount.y % 2 === 0 ? characterSize / 2 : 0)
        };

        this.canvas.setClip(panel.shape);

        for (let i = 0; i < lineCount.x; i++) {
            this.canvas.line(
                new Point(
                    zoomedPanel.x + offset.x + i * characterSize,
                    zoomedPanel.y
                ),
                new Point(
                    zoomedPanel.x + offset.x + i * characterSize,
                    zoomedPanel.y + zoomedPanel.height
                ),
                LayoutConfig.feature.panel.grid);
        }
        for (let i = 0; i <= lineCount.y; i++) {
            this.canvas.line(
                new Point(
                    zoomedPanel.x,
                    zoomedPanel.y + offset.y + i * characterSize
                ),
                new Point(
                    zoomedPanel.x + zoomedPanel.width,
                    zoomedPanel.y + offset.y + i * characterSize
                ),
                LayoutConfig.feature.panel.grid);
        }

        this.canvas.end();
    }

    paintCharacters(panel: Panel) {
        if (panel.characters && panel.characters.length > 0) {
            panel.characters.forEach(chr => {
                let position: Square;
                if (chr.defaultPosition && LayoutConfig.characterPositionLayoutLevel === CharacterPositionLayoutLevel.DEFAULT) {
                    position = chr.defaultPosition;
                }
                if (chr.backgroundPosition && LayoutConfig.characterPositionLayoutLevel > CharacterPositionLayoutLevel.DEFAULT) {
                    position = chr.backgroundPosition;
                }
                if (chr.panelPosition && LayoutConfig.characterPositionLayoutLevel === CharacterPositionLayoutLevel.PANEL) {
                    position = chr.panelPosition;
                }
                const isActor = !!panel.getActor(chr.name);
                this.canvas.rect(position, isActor ? LayoutConfig.feature.character.actor.box : LayoutConfig.feature.character.box);
            });
        }
    }

    paintCharactersBBox(panel: Panel) {
        const charactersBbox: Rectangle = Rectangle.getBoundingBox(panel.characters.map(c => c.backgroundPosition));
        this.canvas.rect(charactersBbox, LayoutConfig.feature.character.bbox);
    }

    paintActorsBBox(panel: Panel) {
        const actorsBbox: Rectangle = Rectangle.getBoundingBox(panel.actors.map(c => c.backgroundPosition));
        this.canvas.rect(actorsBbox, LayoutConfig.feature.character.actor.bbox);
    }
}