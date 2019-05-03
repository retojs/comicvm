import { Qualifier } from "../model/Qualifier";
import { Transform } from "../../common/trigo/Transform";
import { Background } from "../model/Background";
import { YamlLayout } from "./YamlLayout";
import { PanelLayoutBuilder } from "./builder/PanelLayoutBuilder";
import { CharacterLayoutBuilder } from "./builder/CharacterLayoutBuilder";
import { SceneOrBackgroundLayoutBuilder } from "./builder/SceneOrBackgroundLayoutBuilder";
import YamlCharacterLayoutConfig = YamlLayout.CharacterLayoutConfig;
import YamlCharacterPositionConfig = YamlLayout.CharacterPositionConfig;
import YamlCameraConfig = YamlLayout.CameraConfig;

export const ALL_CHARACTERS = "all";

export interface CommonLayout {
    backgroundId: string;
    camera?: Camera;
    characterLayouts?: CharacterLayout[];
}

export class SceneOrBackgroundLayout implements CommonLayout {

    static builder(): SceneOrBackgroundLayoutBuilder {
        return new SceneOrBackgroundLayoutBuilder();
    }

    backgroundId: string = Background.defaultId;
    camera?: Camera = {};
    characterLayouts?: CharacterLayout[] = [];

    characters?: (string | string[])[];
}

export class PanelLayout implements CommonLayout {

    static builder() {
        return new PanelLayoutBuilder();
    }

    public plotItemCount: number = 0;
    public animation?: CameraAnimation;

    public backgroundId: string = Background.defaultId;
    public camera: Camera = {};
    public characterLayouts: CharacterLayout[] = [];
}

export class CharacterLayout {

    static builder() {
        return new CharacterLayoutBuilder();
    }

    who: string;
    how?: Qualifier[];
    pos?: CharacterPositionTransform;

    constructor(
        name?: string,
        layoutConfig: YamlCharacterLayoutConfig = {}
    ) {
        this.who = name;
        if (layoutConfig.pos) {
            this.pos = new CharacterPositionTransform(name, layoutConfig.pos);
        }
        if (layoutConfig.how) {
            this.how = layoutConfig.how.split(" ").map(how => new Qualifier(name, how));
        }
    }
}

export class CharacterPositionTransform extends Transform {

    who?: string;

    constructor(
        name: string,
        config: YamlCharacterPositionConfig = {}
    ) {
        super(config.x, config.y, config.size);
        this.who = name;
    }
}

export class Camera {

    constructor(
        public zoom?: number,
        public pan?: Pan
    ) {}
}

export class CameraAnimation extends Camera {

    constructor(
        config: YamlCameraConfig = {}
    ) {
        super(config.zoom, config.pan);
    }
}

export interface Pan {
    x?: number,
    y?: number
}

export function getPanAsObject(panArray: [number, number]): Pan {
    return {x: panArray[0], y: panArray[1]};
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

export function extractQualifiers(layout: CommonLayout): Qualifier[] {
    if (layout && layout.characterLayouts) {
        return layout.characterLayouts.reduce((qualifiers, characterLayout) => [...qualifiers, ...characterLayout.how], [])
    } else {
        return [];
    }
}
