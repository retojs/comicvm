import { Square } from "../trigo/Square";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/LayoutConfig";

export class Character {

    name: string;
    how: string[] = [];

    defaultPosition?: Square;
    backgroundPosition?: Square;
    panelPosition?: Square;

    constructor(name: string, how?: string[]) {
        this.name = name;
        if (how && how.length > 0) {
            how.forEach(q => this.addQualifier(q));
        }
    }

    addQualifier(how: string) {
        if (!this.hasQualifier(how)) {
            this.how.push(how);
        }
    }

    hasQualifier(qualifier: string): boolean {
        return this.how.indexOf(qualifier) > -1;
    }

    getPosition(): Square {
        let position: Square;
        if (CharacterPositionLayoutLevel.DEFAULT === LayoutConfig.characterPositionLayoutLevel
            && this.defaultPosition) {
            position = this.defaultPosition;
        }
        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && this.backgroundPosition) {
            position = this.backgroundPosition;
        }
        if (CharacterPositionLayoutLevel.PANEL === LayoutConfig.characterPositionLayoutLevel
            && this.panelPosition) {
            position = this.panelPosition;
        }
        return position;
    }
}