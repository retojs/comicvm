import { Rectangle } from "../trigo/Rectangle";
import { PaintStyleConfig } from "../paint/Paint.config";
import { Canvas } from "../dom/Canvas";

describe("should be a visual test", () => {

    it("You can transform the canvas or the shape", ()=> {
        const canvas: Canvas = new Canvas(null);
        const shapeBounds: Rectangle = new Rectangle(10, 10, 100, 100);
        const test = new Rectangle(10, 10, 400, 400);
        const t = test.getCanvasTransformTo(shapeBounds);
        const tt = test.getShapeTransformTo(shapeBounds);
        canvas.rect(test, PaintStyleConfig.stroke("red", 3));
        canvas.transform(t);
        canvas.rect(test, PaintStyleConfig.stroke("green", 5));
        canvas.resetTransform();
        canvas.rect(test.transform(tt), PaintStyleConfig.stroke("lime", 3));
    });
});