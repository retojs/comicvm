import { ScenePainter } from "./paint/ScenePainter";
import { Canvas } from "./dom/Canvas";
import { PaintConfig } from "./paint/PaintConfig";

export class ComicVM {

    plot: string;
    layout: string;
    canvas: Canvas;
    scenePainter: ScenePainter;

    private constructor() {}

    static create(plot: string, layout: string, canvas?: Canvas): ComicVM {

        const instance = new ComicVM();

        if (canvas) {
            instance.canvas = canvas;
        } else {
            instance.canvas = new Canvas(
                PaintConfig.canvas.id,
                PaintConfig.canvas.width,
                PaintConfig.canvas.height
            );
        }

        instance.scenePainter = new ScenePainter(
            plot,
            layout,
            instance.canvas
        );

        return instance;
    }
}