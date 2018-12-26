import { PositionChange } from "../trigo/PositionChange";
import { PanelLayoutPropertyName } from "./LayoutProperties";
import { Square } from "../trigo/Square";

export type LayoutProperty = number | number[] | string | string | PositionChange

export type PanelLayout = LayoutProperty[]

export type StripLayout = {
    panelWidths?: number[];
    panels: PanelLayout[];
}

export type PageLayout = {
    stripHeights?: number[];
    strips: StripLayout[];
}

export type BackgroundLayout = {
    [characterName: string]: CharacterLayout;
} & {
    zoom?: number;
    pan?: number[];
}

export type CharacterLayout = {
    how?: string[];
    pos?: Square;
}

export type Layout = {
    panelProperties: PanelLayoutPropertyName[];
    pages: PageLayout[];
    backgrounds?: { [backgroundId: string]: BackgroundLayout };
    scene?: BackgroundLayout;
}
