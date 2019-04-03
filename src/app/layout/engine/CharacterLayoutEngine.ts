import { Panel } from "../../model/Panel";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../Layout.config";
import { Square } from "../../../common/trigo/Square";
import { Rectangle } from "../../../common/trigo/Rectangle";
import { Point } from "../../../common/trigo/Point";
import { ALL_CHARACTERS, CharacterLayoutProperties, CharacterPositionTransform } from "../LayoutProperties";

const DEFAULT_ZOOM = 0.5 * (1.0 + Math.sqrt(5)) - 1; // golden ratio

export class CharacterLayoutEngine {

    constructor() {}

    layout(panels: Panel[]) {
        panels
            .filter(panel => !!panel.shape && panel.shape.width > 0 && panel.shape.height > 0)
            .forEach(panel => {
                this.layoutCharacters(panel);
            });
    }

    layoutCharacters(panel: Panel) {
        this.setCharacterDefaultPositions(panel);
        this.setCharacterBackgroundPositions(panel);
        this.setCharacterPanelPositions(panel);
        this.applyZoom(panel);
        this.applyPanning(panel);
    }

    setCharacterDefaultPositions(panel: Panel) {

        // By default all characters are positioned on a line in the order specified in the plot (after the keyword 'Characters:')
        // with gaps as wide as a character between each other and gaps half as wide as a character to the left and right panel borders.

        let visibleCharacters = panel.characters;
        if (panel.hasActors) {
            visibleCharacters = panel.getCharacterSlice(panel.actors);
        }
        const characterSize = panel.shape.width / (2 * visibleCharacters.length);

        let x = panel.shape.x + characterSize / 2;
        if (panel.hasActors) {
            const leftActorIndex = panel.firstActorIndex;
            x = panel.shape.x + (1 - leftActorIndex * 2) * characterSize - characterSize / 2;
        }
        let y = panel.shape.y + (panel.shape.height - characterSize) / 2;

        panel.characters.forEach(chr => {
            chr.defaultPosition = new Square(x, y, characterSize);
            x += characterSize * 2;
        })
    }

    setCharacterBackgroundPositions(panel: Panel) {

        // Character's positions can be configured for the whole scene or for a background
        // After these configurations have been applied, the bounding box of all acting characters is fit into each panel.

        panel.characters.forEach(character => character.backgroundPosition = character.defaultPosition.clone());

        if (CharacterPositionLayoutLevel.DEFAULT === LayoutConfig.characterPositionLayoutLevel) { return; }

        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && panel.scene.layoutProperties) {
            this.adjustCharacterBackgroundPositions(panel, panel.scene.layoutProperties.characterProperties);
        }
        if (CharacterPositionLayoutLevel.BACKGROUND <= LayoutConfig.characterPositionLayoutLevel
            && panel.background.layoutProperties) {
            this.adjustCharacterBackgroundPositions(panel, panel.background.layoutProperties.characterProperties);
        }

        let visibleCharacters = panel.characters;
        if (panel.hasActors) {
            visibleCharacters = panel.actors;
        }

        // define the area to fit the visible characters into
        const panelMargin = panel.characters[0].defaultPosition.size / 2;
        const actorsArea = panel.shape.clone().shrink(panelMargin);

        // fit visible characters into the defined area
        const bounds = Rectangle.getBoundingBox(visibleCharacters.map(character => character.backgroundPosition));
        const fitBounds = Rectangle.fitIntoBounds(bounds.clone(), actorsArea);
        const fitBoundsPos = new Point(fitBounds.x, fitBounds.y);
        panel.characters.forEach(character => {
            character.backgroundPosition.translate(fitBounds.x - bounds.x, fitBounds.y - bounds.y);
            character.backgroundPosition.scale(fitBounds.width / bounds.width, fitBoundsPos);
        })
    }

    setCharacterPanelPositions(panel: Panel) {

        if (CharacterPositionLayoutLevel.PANEL !== LayoutConfig.characterPositionLayoutLevel) { return; }

        // Character's positions can be configured for each panel
        panel.characters.forEach(character => character.panelPosition = character.backgroundPosition.clone());

        if (panel.layoutProperties
            && panel.layoutProperties.characterPositions
            && panel.layoutProperties.characterPositions.length > 0) {
            this.adjustCharacterPanelPositions(panel, panel.layoutProperties.characterPositions);
        }
    }

    adjustCharacterBackgroundPositions(panel: Panel, layoutProperties: CharacterLayoutProperties[]) {

        layoutProperties.forEach(chProps => {
            if (chProps.pos) {
                if (chProps.who === ALL_CHARACTERS) {
                    panel.characters.forEach(character =>
                        character.backgroundPosition.transform(chProps.pos)
                    );
                } else {
                    const character = panel.getCharacter(chProps.who);
                    if (character) {
                        character.backgroundPosition.transform(chProps.pos);
                    }
                }
            }
        });
    }

    adjustCharacterPanelPositions(panel: Panel, positionChanges: CharacterPositionTransform[]) {

        positionChanges.forEach(pos => {
            if (pos) {
                if (pos.who === ALL_CHARACTERS) {
                    panel.characters.forEach(character =>
                        character.panelPosition.transform(pos)
                    );
                } else {
                    const character = panel.getCharacter(pos.who);
                    if (character) {
                        character.panelPosition.transform(pos);
                    }
                }
            }
        });
    }

    applyZoom(panel: Panel) {

        if (!LayoutConfig.applyZoom) { return; }

        let zoom = panel.zoom;
        if (panel.layoutProperties.animation) {

            // TODO set zoom
            // animation.zoom = 1 means
            //  - at duration = 0 zoom is zoom - 0.5 * DEFAULT_ZOOM
            //  - at duration = 1 zoom is zoom + 0.5 * DEFAULT_ZOOM
            // --> zoom factor increase is linear, just add delta to zoom

            zoom += panel.animationTime - 0.5 * panel.layoutProperties.animation.zoom * DEFAULT_ZOOM;

            // TODO transition function (ease in / out etc.)
        }

        panel.characters.forEach(ch => {
            if (ch.defaultPosition) {
                ch.defaultPosition.scale(zoom, panel.shape.center);
            }
            if (ch.backgroundPosition) {
                ch.backgroundPosition.scale(zoom, panel.shape.center);
            }
            if (ch.panelPosition) {
                ch.panelPosition.scale(zoom, panel.shape.center);
            }
        })
    }

    applyPanning(panel: Panel) {

        if (!LayoutConfig.applyPanning) { return; }

        let panning = panel.panning;
        if (panel.layoutProperties.animation) {

            // TODO set panning
            // animation.pan = [1, 0] means
            //  - at duration 0 pan is pan - 0.5
            //  - at duration 1 pan is pan + 0.5
            panning[0] += panel.animationTime - 0.5 * panel.layoutProperties.animation.pan[0];
            panning[1] += panel.animationTime - 0.5 * panel.layoutProperties.animation.pan[1];

            // TODO transition function (ease in / out etc.)
        }

        const characterSize = panel.characters[0].defaultPosition.size;

        panel.characters.forEach(ch => {
            if (ch.defaultPosition) {
                ch.defaultPosition.translate(panning[0] * characterSize, panning[1] * characterSize);
            }
            if (ch.backgroundPosition) {
                ch.backgroundPosition.translate(panning[0] * characterSize, panning[1] * characterSize);
            }
            if (ch.panelPosition) {
                ch.panelPosition.translate(panning[0] * characterSize, panning[1] * characterSize);
            }
        })
    }
}
