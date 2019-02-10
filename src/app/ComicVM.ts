import { Canvas } from "./dom/Canvas";
import { PaintConfig } from "./paint/Paint.config";
import { Story } from "./model/Story";
import { Scene } from "./model/Scene";
import { ScenePainter } from "./paint/ScenePainter";
import { DomElementContainer } from "./dom/DomElement";

// TODO
// - generate documentation with jsdoc
// - write documentation
// - see: https://github.com/jsdoc3/jsdoc

export class ComicVM {

    story: Story;
    currentScene: Scene;

    container: DomElementContainer;
    canvas: Canvas;

    constructor(story: Story) {
        this.story = story;
    }

    static loadStory(storyName: string): Promise<ComicVM> {
        return Story.load(storyName)
            .then(story => new ComicVM(story));
    }

    getScene(index: number): Scene {
        return this.story.scenes[index];
    }

    paintScene(scene: Scene, container: DomElementContainer): void {
        this.currentScene = scene;
        this.container = container;
        this.canvas = new Canvas(
            container,
            PaintConfig.canvas.width,
            PaintConfig.canvas.height
        );
        this.repaintScene();
    }

    repaintScene(): void {
        if (!this.currentScene) { return; }
        this.canvas.clear();
        ScenePainter.paintScene(
            this.currentScene.setup(this.canvas, this.story.images),
            this.canvas
        );
    }
}