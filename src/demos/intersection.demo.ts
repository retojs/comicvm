import { Canvas } from "../common/dom/Canvas";
import { Point } from "../common/trigo/Point";
import { Line } from "../common/trigo/Line";
import { Demo, DEMO_DEFAULT_WIDTH } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { LayoutConfig } from "../app/layout/Layout.config";
import { PaintStyleConfig } from "../common/style/PaintStyle";

const dotRadius = 5;
const lineWidth = 1;

export class IntersectionDemo implements Demo {

    name = "Intersection Demo";
    desc = "Look! I can calculate intersections :D (Click the mouse to change positions)";

    create(container: DomElementContainer) {
        const layoutConfig = new LayoutConfig();
        const myCanvas = new Canvas(container, DEMO_DEFAULT_WIDTH, DEMO_DEFAULT_WIDTH);

        let origin = new Point(300, 400);
        let crossingLine = new Line().setFrom(0, 320).setTo(layoutConfig.page.width, 140);

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
            crossingLine.from.y = 200 + Math.random() * 600;
            crossingLine.to.y = 200 + Math.random() * 600;
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

            if (intersection) {
                myCanvas.begin();
                myCanvas.lineFromTo(origin, intersection, PaintStyleConfig.stroke("#4caf50"));
                myCanvas.lineFromTo(mousePos, intersection, PaintStyleConfig.stroke("#4caf50"));
                myCanvas.circle(intersection, dotRadius, PaintStyleConfig.fillAndStroke("rgba(30, 150, 240, 0.5)", "#4caf50", lineWidth));
                myCanvas.end();
            }
        }

        function initDrawing() {
            myCanvas.clear();
            myCanvas.begin();
            myCanvas.line(crossingLine, PaintStyleConfig.stroke("#2196f3"));
            myCanvas.circle(origin, dotRadius, PaintStyleConfig.fillAndStroke("rgba(240, 30, 150, 0.5)", "purple", lineWidth));
            myCanvas.end();
        }
    }
}