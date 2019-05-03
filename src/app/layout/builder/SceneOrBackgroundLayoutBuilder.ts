import { SceneOrBackgroundLayout } from "../Layout";
import { CommonLayoutBuilder } from "./CommonLayoutBuilder";

export class SceneOrBackgroundLayoutBuilder extends CommonLayoutBuilder<SceneOrBackgroundLayout, SceneOrBackgroundLayoutBuilder> {

    protected readonly layout: SceneOrBackgroundLayout;

    constructor() {
        super(new SceneOrBackgroundLayout());
    }

    characters(characters: (string | string[])[]): SceneOrBackgroundLayoutBuilder {
        this.layout.characters = characters;
        return this;
    }
}