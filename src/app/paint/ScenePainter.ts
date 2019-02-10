import { Canvas } from "../dom/Canvas";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { PagePainter } from "./PagePainter";
import { Scene } from "../model/Scene";

export class ScenePainter {

    scene: Scene;
    canvas: Canvas;
    layoutEngine: LayoutEngine;
    pagePainter: PagePainter;

    constructor(scene: Scene, canvas: Canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.layoutEngine = new LayoutEngine(this.scene);
        this.pagePainter = new PagePainter(this.canvas);
    }

    static paintScene(scene: Scene, canvas: Canvas): ScenePainter {
        return new ScenePainter(scene, canvas).paintScene();
    }

    paintScene(): ScenePainter {
        this.canvas.clear();
        this.repaintScene();
        return this;
    }

    repaintScene() {
        this.layoutEngine.layout(this.canvas);
        this.scene.pages.forEach(page => this.pagePainter.paintPage(page));
    }
}