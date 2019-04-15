import { Story } from "./model/Story";
import { Scene } from "./model/Scene";
import { ScenePainter } from "./paint/ScenePainter";
import { DomElementContainer } from "../common/dom/DomElement";
import { ComicVmCanvas } from "./paint/ComicVmCanvas";
import { Canvas } from "../common/dom/Canvas";
import { Images } from "./images/Images";
import { PaintConfig } from "./paint/Paint.config";

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

    get images(): Images {
        return this.story.images;
    }

    getSceneAt(index: number): Scene {
        return this.story.scenes[index];
    }

    getScene(name: string): Scene {
        return this.story.scenes.find(scene => scene.name === name);
    }

    setCurrentScene(name: string): Scene {
        this.currentScene = this.getScene(name);
        return this.currentScene;
    }

    setupScene(scene: Scene | string, container: DomElementContainer | Canvas): Scene {
        if (typeof scene === 'string') {
            this.currentScene = this.getScene(scene as string);
        } else {
            this.currentScene = scene;
        }
        if (container instanceof Canvas) {
            this.canvas = container as Canvas;
        } else {
            this.canvas = new ComicVmCanvas(container);
        }
        this.canvas.setFont(PaintConfig.canvas.font);
        this.currentScene.setup(this.canvas, this.images);
        return this.currentScene;
    }

    paintCurrentScene(container: DomElementContainer | Canvas) {
        this.paintScene(this.currentScene, container);
    }

    paintScene(scene: Scene, container: DomElementContainer | Canvas): void {
        this.setupScene(scene, container);
        this.repaintScene();
    }

    repaintScene(setupScene?: boolean): void {
        if (!this.currentScene) {
            throw new Error("No current scene to repaint")
        }
        if (setupScene) {
            this.currentScene.setup(this.canvas, this.story.images);
        }
        this.canvas.clear();
        ScenePainter.paintScene(
            this.currentScene,
            this.canvas
        );
    }
}