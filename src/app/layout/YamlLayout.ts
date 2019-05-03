export namespace YamlLayout {

    /**
     * The layout configuration for a single panel is an array containing up to 3 elements:
     *  - a number defining the number of plot items to illustrate in the panel
     *  - a string defining the panel background
     *  - an object with additional layout configuration
     */

    export type PanelLayoutProperties = [PanelLayoutProperty, PanelLayoutProperty, PanelLayoutProperty]

    export type PanelLayoutProperty = number | string | PanelLayoutConfig

    /**
     * With a PanelLayoutConfig you can configure
     *  - Camera properties like zoom and pan
     *  - Animation properties for both camera properties
     *  - Character properties like positions and qualifiers
     */

    export type PanelLayoutConfig = CameraConfig & AnimationConfig & { [key: string]: CharacterLayoutProperty };

    export interface CameraConfig {
        zoom?: number;
        pan?: { x?: number, y?: number };
    }

    export interface AnimationConfig {
        animate: CameraConfig
    }

    /**
     * A character layout config can be
     *  - a string containing qualifiers separated by dots
     *  - a character position configuration
     *  - both of the above as properties "pos" and "how" of an object
     */

    export type CharacterLayoutProperty = string | CharacterPositionConfig | CharacterLayoutConfig

    export interface CharacterPositionConfig {
        x?: number,
        y?: number,
        size?: number
    }

    export type CharacterLayoutConfig = {
        how?: string;
        pos?: CharacterPositionConfig
    }

    /**
     * Panels belong to a horizontal strip of panels.
     * Strips are part of a page.
     */

    export type StripLayoutConfig = {
        panelWidths?: number[];
        panels: PanelLayoutProperties[];
    }

    export type PageLayoutConfig = {
        stripHeights?: number[];
        strips: StripLayoutConfig[];
    }

    /**
     * Some panel layout properties can be configured
     *  - for all panels of the same background
     *  - for all panels of a whole scene
     */

    export type BackgroundLayoutConfig = {
        [characterName: string]: CharacterLayoutProperty;
    } & {
        characters?: (string | string[])[];
    } &
        CameraConfig

    export type SceneLayoutConfig = BackgroundLayoutConfig & {
        backgroundId: string,
        backgrounds?: {
            [backgroundId: string]: BackgroundLayoutConfig
        };
        pages: PageLayoutConfig[];
    }
}