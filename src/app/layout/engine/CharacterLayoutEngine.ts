import { Panel } from "../../model/Panel";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../Layout.config";
import { Square } from "../../../common/trigo/Square";
import { Rectangle } from "../../../common/trigo/Rectangle";
import { Point } from "../../../common/trigo/Point";
import { ALL_CHARACTERS, CharacterLayoutProperties, CharacterPositionTransform } from "../LayoutProperties";

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

        panel.characters.forEach(character => {
            character.backgroundPosition = character.defaultPosition.clone();
            character.backgroundPositionStart = character.defaultPosition.clone();
            character.backgroundPositionEnd = character.defaultPosition.clone();
        });

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
        const actorsArea = panel.shape.clone().cutMarginOf(panelMargin);

        // fit visible characters into the defined area
        const bounds = Rectangle.getBoundingBox(visibleCharacters.map(character => character.backgroundPosition));
        const fitBounds = Rectangle.fitIntoBounds(bounds.clone(), actorsArea);
        const fitBoundsPos = new Point(fitBounds.x, fitBounds.y);
        panel.characters.forEach(character => {
            character.backgroundPosition.translate(fitBounds.x - bounds.x, fitBounds.y - bounds.y);
            character.backgroundPosition.scale(fitBounds.width / bounds.width, fitBoundsPos);
            character.backgroundPositionStart = character.backgroundPosition.clone();
            character.backgroundPositionEnd = character.backgroundPosition.clone();
        });
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

        panel.characters.forEach(ch => {
            if (ch.defaultPosition) {
                ch.defaultPosition.scale(panel.staticZoom, panel.shape.center);
            }
            if (ch.backgroundPosition) {
                ch.backgroundPositionStart.scale(panel.zoomStart, panel.shape.center);
                ch.backgroundPositionEnd.scale(panel.zoomEnd, panel.shape.center);
                ch.backgroundPosition.scale(panel.zoom, panel.shape.center);
            }
            if (ch.panelPosition) {
                ch.panelPosition.scale(panel.zoom, panel.shape.center);
            }
        })
    }

    applyPanning(panel: Panel) {

        if (!LayoutConfig.applyPanning) { return; }

        const characterSize = panel.characters[0].defaultPosition.size;
        const panning = panel.panning.map(comp => comp * characterSize);
        const panningStart = panel.panningStart.map(comp => comp * characterSize);
        const panningEnd = panel.panningEnd.map(comp => comp * characterSize);

        panel.characters.forEach(ch => {
            if (ch.defaultPosition) {
                ch.defaultPosition.translate(...panning);
            }
            if (ch.backgroundPosition) {
                ch.backgroundPositionStart.translate(...panningStart);
                ch.backgroundPositionEnd.translate(...panningEnd);
                ch.backgroundPosition.translate(...panning);
            }
            if (ch.panelPosition) {
                ch.panelPosition.translate(...panning);
            }
        })
    }
}
