import { Canvas } from "./Canvas";
import { LayoutParser } from "../layout/LayoutParser";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { PagePainter } from "./PagePainter";
import { Plot } from "../plot/Plot";
import { Scene } from "../model/Scene";
import { PaintConfig } from "./PaintConfig";

export class ScenePainter {

    scene: Scene;
    canvas: Canvas;
    layoutEngine: LayoutEngine;
    pagePainter: PagePainter;

    constructor(plot: string, layout: string) {
        this.scene = new LayoutParser(layout).scene;
        this.canvas = new Canvas(PaintConfig.canvas.id, PaintConfig.canvas.width, PaintConfig.canvas.height);
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