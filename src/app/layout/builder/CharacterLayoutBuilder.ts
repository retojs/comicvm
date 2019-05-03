import { CharacterLayout, CharacterPositionTransform } from "../Layout";
import { Qualifier } from "../../model/Qualifier";

export class CharacterLayoutBuilder {

    private readonly layout: CharacterLayout;

    constructor() {
        this.layout = new CharacterLayout();
    }

    build(): CharacterLayout {
        return this.layout;
    }

    who(who: string): CharacterLayoutBuilder {
        this.layout.who = who;
        return this;
    }

    how(how: Qualifier): CharacterLayoutBuilder {
        this.layout.how = [
            ...(this.layout.how || []),
            how
        ];
        return this;
    }

    pos(pos: CharacterPositionTransform): CharacterLayoutBuilder {
        this.layout.pos = pos;
        return this;
    }
}