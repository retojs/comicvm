/**
 * Motivation:
 *  Die Bildkomposition eines Panels kann konfiguriert werden über 6 Layout Properties.
 *  Das Layout-Datenformat soll es erlauben, Layouts in möglichst knapper Form auszudrücken.
 *  Es soll daher nicht nötig sein, die Properties jedesmal zu benennen, wenn man ihnen einen Wert zuweist.
 *  Stattdessen werden die Werte für jedes Panel in ein Array geschrieben,
 *   und jede Index-Transformation entspricht einem bestimmten PanelProperty.
 *  Die Reihenfolge der Layout Properties kann für jedes Layout individuell definiert werden,
 *   so dass die Arrays möglichst wenig leere Positionen enthalten.
 */

import { Qualifier } from "../model/Qualifier";
import { Transform } from "../../common/trigo/Transform";

export enum PanelLayoutPropertyName {
    PlotItemCount = "plotItemCount",
    backgroundId = "backgroundId",
    CharacterQualifier = "characterQualifier",
    CharacterPositions = "characterPositions",
    Zoom = "zoom",
    Pan = "pan",
    Animation = "animation"
}

export const ALL_CHARACTERS = "all";

export class CharacterPositionTransform extends Transform {

    who?: string;

    constructor(who?: string, dx?: number, dy?: number, scale?: number) {
        super(dx, dy, scale);
        this.who = who;
    }
}

export class CharacterLayoutProperties {

    who: string;
    how: Qualifier[] = [];
    pos?: CharacterPositionTransform;

    constructor(who: string, how?: Qualifier[], pos?: CharacterPositionTransform) {
        this.who = who;
        this.how = how || [];
        this.pos = pos;
    }
}

export interface SceneLayoutProperties {
    zoom?: number;
    pan: number[];
    characters: (string | string[])[];
    characterProperties: CharacterLayoutProperties[];
}

export function createSceneLayout(config?: Partial<SceneLayoutProperties>): SceneLayoutProperties {
    return {
        zoom: 1,
        pan: [0, 0],
        characters: undefined,
        characterProperties: [],
        ...config
    };
}

/**
 * Flattens nested characters of type (string | string[])[] into type string[]
 */
export function flatCharacters(characters: (string | string[])[]): string[] {
    return characters.reduce((flat: string[], character: string | string[]) => {
        if (typeof character === 'string') {
            return [...flat, character];
        } else {
            return [...flat, ...character,];
        }
    }, []) as string[];
}

export interface BackgroundLayoutProperties extends SceneLayoutProperties {
    id: string;
}

export function createBackgroundLayout(config: Partial<BackgroundLayoutProperties>): BackgroundLayoutProperties {
    return {
        id: 'default',
        ...createSceneLayout(config)
    };
}

export class PanelLayoutProperties {

    constructor(
        public plotItemCount: number = 0,
        public backgroundId: string = null,
        public characterQualifier: Qualifier[] = [],
        public characterPositions: CharacterPositionTransform[] = [],
        public zoom?: number,
        public pan: [] | [number, number] = [],
        public animation?: PanelAnimationProperties
    ) {}
}

export class PanelAnimationProperties {

    constructor(
        public zoom: number,
        public pan: [] | [number, number]
    ) {}

    toString(): string {
        let props: string[] = [];
        if (this.zoom != null) {
            props.push(` zoom: ${this.zoom}`);
        }
        if (this.pan != null) {
            props.push(` pan: [${this.pan[0]}, ${this.pan[1]}]`);
        }
        return `{${props.join(",")} }`;
    }
}