import { Page } from "../model/Page";
import { Panel } from "../model/Panel";
import { Rectangle } from "../trigo/Rectangle";
import { CharacterPositionLayoutLevel, LayoutConfig, PanelConfig, StripConfig } from "./LayoutConfig";
import { Strip } from "../model/Strip";
import { LayoutParser } from "./LayoutParser";
import { Scene } from "../model/Scene";
import { PlotItem, STORY_TELLER } from "../plot/PlotItem";
import { Plot } from "../plot/Plot";
import { AllCharacters, CharacterLayoutProperties, CharacterPositionChange } from "./LayoutProperties";
import { Point } from "../trigo/Point";
import { Square } from "../trigo/Square";

export class LayoutEngine {

    constructor(private layoutParser: LayoutParser, private plot: Plot) {
        layoutParser.scene.characters = plot.characters.filter(ch => ch !== STORY_TELLER);
        this.assignPlotItems();
        this.layout();
    }

    get scene(): Scene {
        return this.layoutParser.scene;
    };

    get plotItems(): PlotItem[] {
        return this.plot.plotItems;
    }

    static getZoom(panel: Panel): number {
        let zoom = 1.0;

        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && panel.scene.layoutProperties) {
            zoom *= panel.scene.layoutProperties.zoom || 1;
        }
        if (CharacterPositionLayoutLevel.BACKGROUND <= LayoutConfig.characterPositionLayoutLevel
            && panel.background.layoutProperties) {
            zoom *= panel.background.layoutProperties.zoom || 1;
        }
        if (CharacterPositionLayoutLevel.PANEL === LayoutConfig.characterPositionLayoutLevel
            && panel.layoutProperties) {
            zoom *= panel.layoutProperties.zoom || 1;
        }
        return zoom;
    }

    getZoom(panel: Panel): number {
        return LayoutEngine.getZoom(panel);
    }

    getPanning(panel: Panel): number[] {
        let panning = {x: 0, y: 0};

        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && panel.scene.layoutProperties) {
            panning.x += (panel.scene.layoutProperties.pan || [0, 0])[0];
            panning.y += (panel.scene.layoutProperties.pan || [0, 0])[1];
        }
        if (CharacterPositionLayoutLevel.BACKGROUND <= LayoutConfig.characterPositionLayoutLevel
            && panel.background.layoutProperties) {
            panning.x += (panel.background.layoutProperties.pan || [0, 0])[0];
            panning.y += (panel.background.layoutProperties.pan || [0, 0])[1];
        }
        if (CharacterPositionLayoutLevel.PANEL === LayoutConfig.characterPositionLayoutLevel
            && panel.layoutProperties) {
            panning.x += (panel.layoutProperties.pan || [0, 0])[0];
            panning.y += (panel.layoutProperties.pan || [0, 0])[1];
        }
        return [panning.x, panning.y];
    }

    /**
     * Distributes the plot items into the panels
     */
    assignPlotItems() {
        let plotItemIndex = 0;
        this.scene.panels.forEach(panel => {
            panel.setPlotItems(this.plotItems.slice(plotItemIndex, plotItemIndex + panel.layoutProperties.plotItemCount));
            plotItemIndex += panel.layoutProperties.plotItemCount;
        })
    }

    layout() {
        // set shapes for pages, panels, characters, bubbles, backgrounds

        if (this.layoutParser && this.layoutParser.scene && this.layoutParser.scene.pages) {
            this.layoutParser.scene.pages.forEach(page => this.layoutPage(page));
        }
    }

    layoutPage(page: Page) {
        page.shape = new Rectangle(
            0,
            page.index * LayoutConfig.page.height,
            LayoutConfig.page.width,
            LayoutConfig.page.height
        );

        if (!(page.stripConfig && page.stripConfig.hasProportions)) {
            page.stripConfig = StripConfig.createDefault(page.strips.length);
        }
        page.strips.forEach(strip => this.layoutStrip(strip, page.stripConfig));
    }

    layoutStrip(strip: Strip, stripConfig: StripConfig) {
        let x: number = LayoutConfig.page.padding.left,
            y: number = strip.page.shape.y + LayoutConfig.page.padding.top + LayoutConfig.page.innerHeight * stripConfig.getSum(strip.index),
            width: number = LayoutConfig.page.innerWidth,
            height: number = LayoutConfig.page.innerHeight * stripConfig.proportions[strip.index];

        strip.shape = new Rectangle(x, y, width, height);

        if (!(strip.panelConfig && strip.panelConfig.hasProportions)) {
            strip.panelConfig = PanelConfig.createDefault(strip.panels.length);
        }
        strip.panels.forEach(panel => this.layoutPanel(panel, strip.panelConfig));
    }

    layoutPanel(panel: Panel, panelConfig: PanelConfig) {
        let x: number = panel.strip.shape.x + panel.strip.shape.width * panelConfig.getSum(panel.index),
            y: number = panel.strip.shape.y,
            width: number = panel.strip.shape.width * panelConfig.proportions[panel.index],
            height: number = panel.strip.shape.height;

        x += panelConfig.margin.left;
        y += panelConfig.margin.top;
        width -= panelConfig.margin.horizontal;
        height -= panelConfig.margin.vertical;

        panel.shape = new Rectangle(x, y, width, height);

        this.layoutCharacters(panel);
    }

    layoutCharacters(panel: Panel) {
        this.setCharactersDefaultPositions(panel);
        this.setCharactersBackgroundPositions(panel);
        this.setCharacterPanelPositions(panel);
        this.applyZoom(panel);
        this.applyPanning(panel);
    }

    setCharactersDefaultPositions(panel: Panel) {
        // By default all characters are positioned on a line in the order specified in the plot (after the keyword 'Characters:')
        // with gaps as wide as a character between each other and gaps half as wide as a character to the left and right panel borders.

        let visibleCharacters = panel.characters;
        if (panel.hasActors) {
            visibleCharacters = panel.getCharacterSlice(panel.actors);
        }
        const characterSize = panel.shape.width / (2 * visibleCharacters.length);

        let x = panel.shape.x + characterSize / 2;
        if (panel.hasActors) {
            const leftActorIndex = panel.getFirstActorIndex();
            x = panel.shape.x + (1 - leftActorIndex * 2) * characterSize - characterSize / 2;
        }
        let y = panel.shape.y + (panel.shape.height - characterSize) / 2;

        panel.characters.forEach(chr => {
            chr.defaultPosition = new Square(x, y, characterSize);
            x += characterSize * 2;
        })

        // TODO: apply zoom and pan!
    }

    setCharactersBackgroundPositions(panel: Panel) {
        // Character's positions can be configured for the whole scene or for a background
        // After these configurations have been applied, the bounding box of all acting characters is fit into each panel.

        panel.characters.forEach(character => character.backgroundPosition = character.defaultPosition.clone());

        if (CharacterPositionLayoutLevel.DEFAULT === LayoutConfig.characterPositionLayoutLevel) { return; }

        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && panel.scene.layoutProperties) {
            this.adjustCharacterBackgroundPositions(panel, panel.scene.layoutProperties.character);
        }
        if (CharacterPositionLayoutLevel.BACKGROUND <= LayoutConfig.characterPositionLayoutLevel
            && panel.background.layoutProperties) {
            this.adjustCharacterBackgroundPositions(panel, panel.background.layoutProperties.character);
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
        const fitBounds = Rectangle.fitToBounds(bounds.clone(), actorsArea);
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

        if (panel.layoutProperties && panel.layoutProperties.characterPositions.length > 0) {
            this.adjustCharacterPanelPositions(panel, panel.layoutProperties.characterPositions);
        }
    }

    adjustCharacterBackgroundPositions(panel: Panel, layoutProperties: CharacterLayoutProperties[]) {
        layoutProperties.forEach(chProps => {
            if (chProps.pos) {
                if (chProps.who === AllCharacters) {
                    panel.characters.forEach(character =>
                        character.backgroundPosition.adjust(chProps.pos)
                    );
                } else {
                    const character = panel.getCharacter(chProps.who);
                    if (!character) {
                        throw new Error("unknown character " + chProps.who);
                    }
                    character.backgroundPosition.adjust(chProps.pos);
                }
            }
        });
    }

    adjustCharacterPanelPositions(panel: Panel, positionChanges: CharacterPositionChange[]) {
        positionChanges.forEach(pos => {
            if (pos) {
                if (pos.who === AllCharacters) {
                    panel.characters.forEach(character =>
                        character.panelPosition.adjust(pos)
                    );
                } else {
                    const character = panel.getCharacter(pos.who);
                    if (!character) {
                        throw new Error("unknown character " + pos.who);
                    }
                    character.panelPosition.adjust(pos);
                }
            }
        });
    }

    applyZoom(panel: Panel) {
        if (!LayoutConfig.applyZoom) { return; }

        const zoom = this.getZoom(panel);

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

        const panning = this.getPanning(panel);
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