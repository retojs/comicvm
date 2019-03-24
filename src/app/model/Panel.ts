import { Scene } from "./Scene";
import { Page } from "./Page";
import { Strip } from "./Strip";
import { Background } from "./Background";
import { Rectangle } from "../trigo/Rectangle";
import { PlotItem, STORY_TELLER } from "../plot/PlotItem";
import { flatCharacters, PanelLayoutProperties } from "../layout/LayoutProperties";
import { Character } from "./Character";
import { Qualifier } from "./Qualifier";
import { Bubble } from "./Bubble";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/Layout.config";

export class Panel {

    index: number;

    scene: Scene;
    page: Page;
    strip: Strip;
    background: Background;

    characters: Character[] = [];
    characterNames: string[];
    charactersByName: { [key: string]: Character } = {};
    characterGroups: (string | string[])[];
    actors: Character[] = [];
    actorsByName: { [key: string]: Character } = {};
    actorSlice: Character[] = [];

    bubbles: Bubble[] = [];
    offScreenBubble: Bubble;

    plotItems: PlotItem[] = [];

    layoutProperties: PanelLayoutProperties;

    shape: Rectangle;
    backgroundImageShape: Rectangle;

    animationTime = 0;

    constructor(index: number) {
        this.index = index;
    }

    setPlotItems(plotItems: PlotItem[]): void {
        this.plotItems = plotItems || [];
        this.extractCharacters(this.plotItems);
        this.extractBubbles(this.plotItems);
    }

    get does(): PlotItem[] {
        return this.plotItems.filter(p => p.isDoes);
    }

    get says(): PlotItem[] {
        return this.plotItems.filter(p => p.isSays);
    }

    get descriptions(): PlotItem[] {
        return this.plotItems.filter(plotItem => plotItem.isDescription);
    }

    get hasActors(): boolean {
        return this.actors && this.actors.length > 0;
    }

    getActor(name: string): Character {
        return this.actorsByName[name];
    }

    getCharacter(name: string): Character {
        return this.charactersByName[name];
    }

    extractCharacters(plotItems: PlotItem[]): void {
        this.resetCharacters();

        if (this.background && this.background.layoutProperties && this.background.layoutProperties.characters) {
            this.characterGroups = this.background.layoutProperties.characters;
            this.characterNames = flatCharacters(this.background.layoutProperties.characters);
        } else {
            this.characterGroups = this.scene.characters;
            this.characterNames = flatCharacters(this.scene.characters);
        }

        this.characterNames.forEach(name => this.addCharacter(name as string));

        plotItems
            .filter(plotItem => plotItem.who && plotItem.who.length > 0)
            .forEach(plotItem =>
                plotItem.who.forEach(name =>
                    this.addActor(name)
                )
            );

        plotItems
            .filter(plotItem => plotItem.whoWith && plotItem.whoWith.length > 0)
            .forEach(plotItem =>
                plotItem.whoWith.forEach(name => {
                    this.addActor(name);
                })
            );

        // maintain order
        this.actors = this.characterNames
            .reduce((actors, name) => [...actors, this.getActor(name)], [])
            .filter(actor => !!actor);

        plotItems
            .filter(plotItem => plotItem.how && plotItem.how.length > 0)
            .forEach(plotItem =>
                plotItem.how.forEach(qualifier =>
                    this.addCharacterQualifier(qualifier))
            );

        this.actorSlice = this.getCharacterSlice(this.actors);
    }

    extractBubbles(plotItems: PlotItem[]) {
        plotItems
            .filter(plotItem => !!plotItem.says)
            .forEach(plotItem => this.addBubble(plotItem));
        this.offScreenBubble = this.bubbles.find(bubble => bubble.isOffScreen);
    }

    addActor(name: string): void {
        if (!this.getActor(name) && !(name === STORY_TELLER)) {
            const character = this.getCharacter(name);
            if (character) {
                this.actors.push(character);
                this.actorsByName[character.name] = character;
            }
        }
    }

    addCharacter(name: string): void {
        if (!this.getCharacter(name) && !(name === STORY_TELLER)) {
            const character = new Character(name);
            this.characters.push(character);
            this.charactersByName[character.name] = character;
        }
    }

    addCharacterQualifier(qualifier: Qualifier): void {
        const character = this.getCharacter(qualifier.who);
        if (character) {
            character.addQualifier(qualifier.how);
        }
    }

    addBubble(plotItem: PlotItem) {
        const lastBubble = this.bubbles[this.bubbles.length - 1];
        if (lastBubble && lastBubble.whoEquals(plotItem.who)) {
            lastBubble.sayMore(plotItem.says);
        } else {
            this.bubbles.push(new Bubble(plotItem.who, plotItem.says));
        }
    }

    getCharacterSlice(characters: Character[]): Character[] {
        let slice: Character[] = [];
        let found: Character[] = [];
        this.characters.forEach(character => {
            const chr = characters.find(chr => chr.name === character.name);
            if (chr) {
                found.push(character);
                slice.push(character);
            } else if (found.length > 0 && found.length < characters.length) {
                slice.push(character);
            }
        });
        return slice;
    }

    /**
     * Returns the first actor's element index in this panel's characters array.
     * or:
     * Returns the answer to the question: At what index is the first actor in this panel's characters array?
     * It matters for positioning the characters in the panel you know...
     */
    get firstActorIndex() {
        if (!this.actors) { return -1;}

        return this.actors.reduce((mostLeftIndex, character) => {
            const index = this.characters.indexOf(character);
            return mostLeftIndex > index ? index : mostLeftIndex;
        }, this.characters.length);
    }

    resetCharacters(): void {
        this.characters = [];
        this.charactersByName = {};
        this.actors = [];
        this.actorsByName = {};
    }

    get zoom(): number {

        let zoom = 1.0;

        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && this.scene.layoutProperties) {
            zoom *= this.scene.layoutProperties.zoom || 1;
        }
        if (CharacterPositionLayoutLevel.BACKGROUND <= LayoutConfig.characterPositionLayoutLevel
            && this.background.layoutProperties) {
            zoom *= this.background.layoutProperties.zoom || 1;
        }
        if (CharacterPositionLayoutLevel.PANEL === LayoutConfig.characterPositionLayoutLevel
            && this.layoutProperties) {
            zoom *= this.layoutProperties.zoom || 1;
        }
        return zoom;
    }

    get panning(): number[] {

        let panning = {x: 0, y: 0};

        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && hasPanning(this.scene.layoutProperties)) {
            panning.x += (this.scene.layoutProperties.pan)[0];
            panning.y += (this.scene.layoutProperties.pan)[1];
        }
        if (CharacterPositionLayoutLevel.BACKGROUND <= LayoutConfig.characterPositionLayoutLevel
            && hasPanning(this.background.layoutProperties)) {
            panning.x += (this.background.layoutProperties.pan)[0];
            panning.y += (this.background.layoutProperties.pan)[1];
        }
        if (CharacterPositionLayoutLevel.PANEL === LayoutConfig.characterPositionLayoutLevel
            && hasPanning(this.layoutProperties)) {
            panning.x += (this.layoutProperties.pan)[0];
            panning.y += (this.layoutProperties.pan)[1];
        }
        return [panning.x, panning.y];

        function hasPanning(layoutProperties: any) {
            return layoutProperties && layoutProperties.pan && layoutProperties.pan.length > 0;
        }
    }

    toString(): string {
        return `panel ${this.index} in ${this.strip.toString()}`;
    }
}