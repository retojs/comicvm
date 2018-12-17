import { Position } from "../trigo/Position";
import { CharacterLayoutProperties, PanelLayoutPropertyName } from "./LayoutProperties";

export type LayoutProperty = number | number[] | string | string | Position

export type PanelLayout = LayoutProperty[]

export type StripLayout = {
    panelWidths?: number[],
    panels: PanelLayout[]
}

export type PageLayout = {
    stripHeights: number[],
    strips: StripLayout[]
}

export type NamedCharacterLayout = { [key: string]: CharacterLayoutProperties[] }

export type BackgroundLayout = {
    zoom: number,
    pan: number[]
}

export type CharacterLayout = {
    how: string[],
    pos: Position
}

export type Layout = {
    panelProperties: PanelLayoutPropertyName[],
    pages: PageLayout[],
    backgrounds: BackgroundLayout,
    scene: BackgroundLayout
}
