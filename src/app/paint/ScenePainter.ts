import { Canvas } from "./Canvas";
import { LayoutParser } from "../layout/LayoutParser";
import { LayoutEngine } from "../layout/LayoutEngine";
import { PagePainter } from "./PagePainter";
import { Plot } from "../plot/Plot";
import { LayoutConfig } from "../layout/LayoutConfig";
import { Scene } from "../model/Scene";

export class ScenePainter {

    plot: Plot;
    layoutParser: LayoutParser;
    layoutEngine: LayoutEngine;


    canvas: Canvas;
    pagePainter: PagePainter;

    constructor(layout: string, plot: string) {
        this.plot = new Plot(plot);
        this.layoutParser = new LayoutParser(layout);
        this.layoutEngine = new LayoutEngine(this.layoutParser, this.plot);

        this.canvas = new Canvas(LayoutConfig.canvas.id, LayoutConfig.canvas.width, LayoutConfig.canvas.height);
        this.pagePainter = new PagePainter(this.canvas);

        this.paintScene();
    }

    get scene(): Scene {
        return this.layoutParser.scene;
    };

    paintScene() {
        this.canvas.clear();
        this.scene.pages.forEach(page => this.pagePainter.paintPage(page));
    }

    repaintScene() {
        this.layoutEngine.layout();
        this.paintScene();
    }
}