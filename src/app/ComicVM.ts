import { Story } from "./model/Story";
import { Scene } from "./model/Scene";
import { ScenePainter } from "./paint/ScenePainter";
import { DomElementContainer } from "./dom/DomElement";
import { ComicVmCanvas } from "./paint/ComicVmCanvas";
import { Canvas } from "./dom/Canvas";

// TODO
// - generate documentation with jsdoc
// - write documentation
// - see: https://github.com/jsdoc3/jsdoc

export class ComicVM {

    story: Story;
    currentScene: Scene;

    canvas: Canvas;

    constructor(story: Story) {
        this.story = story;
    }

    static loadStory(storyName: string): Promise<ComicVM> {
        return Story.load(storyName)
            .then(story => new ComicVM(story));
    }

    getSceneAt(index: number): Scene {
        return this.story.scenes[index];
    }

    getScene(name: string): Scene {
        return this.story.scenes.find(scene => scene.name === name);
    }

    paintScene(scene: Scene, container: DomElementContainer | Canvas): void {
        this.currentScene = scene;
        if (container instanceof Canvas) {
            this.canvas = container as Canvas;
        } else {
            this.canvas = new ComicVmCanvas(container);
        }
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