import { CharacterLayout, CharacterPositionTransform, CommonLayout, Pan } from "../Layout";
import { Qualifier } from "../../model/Qualifier";

export class CommonLayoutBuilder<T extends CommonLayout, V> {

    protected readonly layout: T;

    constructor(layout: T) {
        this.layout = layout;
    }

    build(): T {
        return this.layout;
    }

    backgroundId(backgroundId: string): V {
        this.layout.backgroundId = backgroundId;
        return this as unknown as V;
    }

    zoom(zoom: number): V {
        if (typeof zoom != null && !isNaN(zoom)) {
            if (zoom < 0) {
                throw new Error("zoom can not be negative (" + zoom + ")");
            }
            this.layout.camera = {
                ...this.layout.camera,
                zoom
            };
        }
        return this as unknown as V;
    }

    pan(pan: Pan): V {
        if (pan != null) {
            this.layout.camera = {
                ...this.layout.camera,
                ...{pan}
            };
        }
        return this as unknown as V;
    }

    characterLayouts(characterLayouts: CharacterLayout[]): V {
        (characterLayouts || []).forEach(layout => this.characterLayout(layout));
        return this as unknown as V;
    }

    characterLayout(characterLayout: CharacterLayout): V {
        this.layout.characterLayouts = [
            ...(this.layout.characterLayouts || []),
            characterLayout
        ];
        return this as unknown as V;
    }

    characterQualifier(qualifier: Qualifier): V {
        const characterLayout: CharacterLayout = this.findCharacterLayout(qualifier.who);
        if (characterLayout) {
            characterLayout.how = [
                ...(characterLayout.how || []),
                qualifier
            ]
        } else {
            this.characterLayout({
                who: qualifier.who,
                how: [qualifier]
            });
        }
        return this as unknown as V;
    }

    characterQualifiers(...qualifiers: Qualifier[]): V {
        qualifiers.forEach(q => this.characterQualifier(q));
        return this as unknown as V;
    }

    characterPosition(pos: CharacterPositionTransform): V {
        const characterLayout = this.findCharacterLayout(pos.who);
        if (characterLayout) {
            characterLayout.pos = pos;
        } else {
            this.characterLayout({
                who: pos.who,
                pos: pos
            });
        }
        return this as unknown as V;
    }

    private findCharacterLayout(name: string): CharacterLayout {
        return (this.layout.characterLayouts || []).find(layout => layout.who === name);
    }
}