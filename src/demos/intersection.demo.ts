import { Canvas } from "../app/dom/Canvas";
import { Point } from "../app/trigo/Point";
import { Line } from "../app/trigo/Line";
import { PaintStyleConfig } from "../app/paint/Paint.config";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH, Demo } from "./Demo";
import { DomElementContainer } from "../app/dom/DomElement";
import { LayoutConfig } from "../app/layout/Layout.config";

export class IntersectionDemo implements Demo {

    name = "Intersection Demo";
    desc = "Look! I can calculate intersections :D (Click the mouse to change positions)";

    create(container: DomElementContainer) {
        const myCanvas = new Canvas(container, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT);

        let origin = new Point(800, 800);
        let crossingLine = new Line().setFrom(0, 1800).setTo(LayoutConfig.page.width, 300);

        let isDrawing = false;

        initDrawing();

        myCanvas.onMouseDown = (event: MouseEvent) => {
            isDrawing = true;
            repaint(event);
        };

        myCanvas.onMouseUp = () => {
            isDrawing = false;
        };

        myCanvas.onMouseMove = (event: MouseEvent) => {
            if (isDrawing) { repaint(event); }
        };

        myCanvas.onDblClick = (event: MouseEvent) => {
            resetDemo(event);
        };

        function resetDemo(event: MouseEvent) {
            origin = myCanvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);
            crossingLine.from.y = 200 + Math.random() * (LayoutConfig.page.height - 1000);
            crossingLine.to.y = 200 + Math.random() * (LayoutConfig.page.height - 1000);
            initDrawing();
        }

        function repaint(event: MouseEvent) {
            window.requestAnimationFrame(() => {
                drawIntersection(event.clientX, event.clientY);
            });
        }

        function drawIntersection(clientX, clientY) {
            const mousePos = myCanvas.getCanvasPositionFromMousePosition(clientX, clientY);
            const mouseLine = new Line(origin, mousePos);
            const intersection = mouseLine.intersection(crossingLine);

            myCanvas.begin();
            myCanvas.lineFromTo(origin, intersection, PaintStyleConfig.stroke("#4caf50"));
            myCanvas.lineFromTo(mousePos, intersection, PaintStyleConfig.stroke("#4caf50"));
            myCanvas.circle(intersection, 20, PaintStyleConfig.fillAndStroke("rgba(30, 150, 240, 0.5)", "#4caf50", 3));
            myCanvas.end();
        }

        function initDrawing() {
            myCanvas.clear();
            myCanvas.begin();
            myCanvas.line(crossingLine, PaintStyleConfig.stroke("#2196f3"));
            myCanvas.circle(origin, 20, PaintStyleConfig.fillAndStroke("rgba(240, 30, 150, 0.5)", "purple", 3));
            myCanvas.end();
        }
    }
}