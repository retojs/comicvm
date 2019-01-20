import { Canvas } from "./dom/Canvas";
import { PaintConfig } from "./paint/PaintConfig";
import { Story } from "./model/Story";
import { Scene } from "./model/Scene";
import { ScenePainter } from "./paint/ScenePainter";

export class ComicVM {

    story: Story;
    canvas: Canvas;

    currentScene: Scene;

    constructor(story: Story, canvas?: Canvas) {
        this.story = story;

        if (canvas) {
            this.canvas = canvas;
        } else {
            this.canvas = new Canvas(
                PaintConfig.canvas.id,
                PaintConfig.canvas.width,
                PaintConfig.canvas.height
            );
        }
    }

    static loadStory(storyName: string): Promise<ComicVM> {
        return Story.load(storyName)
            .then(story => new ComicVM(story));
    }

    getScene(index: number): Scene {
        return this.story.scenes[index];
    }

    paintScene(scene: Scene): void {
        this.canvas.clear();
        this.currentScene = scene;
        ScenePainter.paintScene(
            this.currentScene.setup(this.canvas, this.story.images),
            this.canvas
        );
    }

    repaintScene(): void {
        if (!this.currentScene) { return; }
        console.log("current scene ", this.currentScene);
        this.paintScene(this.currentScene);
    }
}