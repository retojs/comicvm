import { Scene } from "./Scene";
import { Page } from "./Page";
import { Strip } from "./Strip";
import { Background } from "./Background";
import { Rectangle } from "../trigo/Rectangle";
import { PlotItem } from "../plot/PlotItem";
import { PanelLayoutProperties } from "../layout/LayoutProperties";
import { Character } from "./Character";
import { Qualifier } from "./Qualifier";

export class Panel {

    index: number;

    scene: Scene;
    page: Page;
    strip: Strip;
    background: Background;

    characters: Character[] = [];
    charactersByName: { [key: string]: Character } = {};
    actors: Character[] = [];
    actorsByName: { [key: string]: Character } = {};

    bubbles: any[] = [];

    shape: Rectangle;

    plotItems: PlotItem[] = [];

    layoutProperties: PanelLayoutProperties;

    constructor(index: number) {
        this.index = index;
    }

    get descriptions(): PlotItem[] {
        return this.plotItems.filter(plotItem => plotItem.isDescription);
    }

    get tolds(): PlotItem[] {
        return this.plotItems.filter(plotItem => plotItem.isTold)
    }

    get does(): PlotItem[] {
        return this.plotItems.filter(p => p.isDoes);
    }

    get says(): PlotItem[] {
        return this.plotItems.filter(p => p.isSays);
    }

    setPlotItems(plotItems: PlotItem[]): void {
        this.plotItems = plotItems || [];
        this.extractCharacters(this.plotItems);
    }

    extractCharacters(plotItems: PlotItem[]): void {
        this.resetCharacters();

        this.scene.characters.forEach(name => this.addCharacter(name));

        plotItems
            .filter(plotItem => plotItem.who && plotItem.who.length > 0)
            .forEach(plotItem => {
                plotItem.who.forEach(name =>
                    this.addActor(name)
                );
            });

        plotItems
            .filter(plotItem => plotItem.whoWith && plotItem.whoWith.length > 0)
            .forEach(plotItem => {
                plotItem.whoWith.forEach(name => {
                    this.addActor(name);
                })
            });

        plotItems
            .filter(plotItem => plotItem.how && plotItem.how.length > 0)
            .forEach(plotItem =>
                plotItem.how.forEach(qualifier =>
                    this.addCharacterQualifier(qualifier))
            )
    }

    getCharacter(name: string): Character {
        return this.charactersByName[name];
    }

    getActor(name: string): Character {
        return this.actorsByName[name];
    }

    addActor(name: string): void {
        if (!this.getActor(name)) {
            const character = this.getCharacter(name);
            if (!character) {
                throw new Error("unknown character '" + name + "'");
            }
            this.actors.push(character);
            this.actorsByName[character.name] = character;
        }
    }

    addCharacter(name: string): void {
        if (!this.getCharacter(name)) {
            const character = new Character(name);
            this.characters.push(character);
            this.charactersByName[character.name] = character;
        }
    }

    addCharacterQualifier(qualifier: Qualifier): void {
        const character = this.getCharacter(qualifier.who);
        if (!character) {
            throw new Error("unknown character '" + qualifier.who + "'");
        }
        character.addQualifier(qualifier.how);
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

    resetCharacters(): void {
        this.characters = [];
        this.charactersByName = {};
        this.actors = [];
        this.actorsByName = {};
    }
}