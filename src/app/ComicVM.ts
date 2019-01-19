import { Canvas } from "./dom/Canvas";
import { PaintConfig } from "./paint/PaintConfig";
import { Story } from "./model/Story";
import { Scene } from "./model/Scene";
import { ScenePainter } from "./paint/ScenePainter";

export class ComicVM {

    story: Story;
    canvas: Canvas;

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

    setupScene(index: number): Scene {
        return this.story.scenes[index].setup(this.canvas);
    }

    paintScene(index: number): void {
        ScenePainter.paintScene(
            this.setupScene(index),
            this.canvas
        );
    }
}