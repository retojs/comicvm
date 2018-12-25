/**
 * Motivation:
 *  Die Bildkomposition eines Panels kann konfiguriert werden über 6 Layout Properties.
 *  Das Layout-Datenformat soll es erlauben, Layouts in möglichst knapper Form auszudrücken.
 *  Es soll daher nicht nötig sein, die Properties jedesmal zu benennen, wenn man ihnen einen Wert zuweist.
 *  Stattdessen werden die Werte für jedes Panel in ein Array geschrieben,
 *   und jede Index-Position entspricht einem bestimmten PanelProperty.
 *  Die Reihenfolge der Layout Properties kann für jedes Layout individuell definiert werden,
 *   so dass die Arrays möglichst wenig leere Positionen enthalten.
 */

import { Qualifier } from "../model/Qualifier";

export enum PanelLayoutPropertyName {
    PlotItemCount = 'plotItemCount',
    backgroundId = "backgroundId",
    CharacterQualifier = "characterQualifier",
    CharacterPositions = "characterPositions",
    Zoom = "zoom",
    Pan = "pan"
}

export class CharacterPosition {

    who?: string;
    x?: number;
    y?: number;
    size?: number;

    constructor(who?: string, x?: number, y?: number, size?: number) {
        this.who = who;
        this.x = x;
        this.y = y;
        this.size = size;
    }
}

export class CharacterLayoutProperties {

    who: string;
    how: Qualifier[] = [];
    pos?: CharacterPosition;

    constructor(who: string, how?: Qualifier[], pos?: CharacterPosition) {
        this.who = who;
        this.how = how || [];
        this.pos = pos;
    }
}

export class SceneLayoutProperties {

    zoom?: number;
    pan: number[];
    character: CharacterLayoutProperties[] = [];

    constructor(zoom?: number, pan?: number [], character?: CharacterLayoutProperties[]) {
        this.zoom = zoom;
        this.pan = pan || [];
        this.character = character || [];
    }

}

export class BackgroundLayoutProperties extends SceneLayoutProperties {

    id: string;

    constructor(id: string, zoom?: number, pan?: number [], character?: CharacterLayoutProperties[]) {
        super(zoom, pan, character);
        this.id = id;
    }
}

export class PanelLayoutProperties {

    plotItemCount?: number;
    backgroundId?: string;
    characterQualifier: Qualifier[] = [];
    characterPositions: CharacterPosition[] = [];
    zoom?: number;
    pan: number[];

    constructor(plotItemCount?: number,
                backgroundId?: string,
                characterQualifier?: Qualifier[],
                characterPositions?: CharacterPosition[],
                zoom?: number,
                pan?: number[]) {
        this.plotItemCount = plotItemCount;
        this.backgroundId = backgroundId;
        this.characterQualifier = characterQualifier || [];
        this.characterPositions = characterPositions || [];
        this.zoom = zoom;
        this.pan = pan || [];
    }
}
