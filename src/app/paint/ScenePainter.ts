import { Canvas } from "../dom/Canvas";
import { LayoutParser } from "../layout/LayoutParser";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { PagePainter } from "./PagePainter";
import { Plot } from "../plot/Plot";
import { Scene } from "../model/Scene";

export class ScenePainter {

    scene: Scene;
    canvas: Canvas;
    layoutEngine: LayoutEngine;
    pagePainter: PagePainter;

    constructor(plot: string, layout: string, canvas: Canvas) {
        this.canvas = canvas;
        this.scene = new LayoutParser(layout).scene;
        this.layoutEngine = new LayoutEngine(new Plot(plot), this.scene, this.canvas);
        this.pagePainter = new PagePainter(this.canvas);

        this.paintScene();
    }

    paintScene() {
        this.canvas.clear();
        this.scene.pages.forEach(page => this.pagePainter.paintPage(page));
    }

    repaintScene() {
        this.layoutEngine.layout();
        this.paintScene();
    }
}