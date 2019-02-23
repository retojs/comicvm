import { Canvas } from "../app/dom/Canvas";
import { Point } from "../app/trigo/Point";
import { PaintStyleConfig } from "../app/paint/Paint.config";
import { DomElementContainer } from "../app/dom/DomElement";
import { DEFAULT_CANVAS_WIDTH, Demo } from "./Demo";
import { LayoutConfig } from "../app/layout/Layout.config";
import { Rectangle } from "../app/trigo/Rectangle";

// TODO
// - rename to bubble pointer demo
// - write canvas-demo abstract base class
// - write demo selector

export class BezierBubblePointerDemo implements Demo {

    name = "Bezier Bubble Pointer";
    desc = "This tool helps with the calculation of the bubble pointer bezier curves. (double click to set pointer)";

    create(container: DomElementContainer) {
        const myCanvas = new Canvas(container, DEFAULT_CANVAS_WIDTH, 400);

        const distanceLeftRight = 100;

        let from = new Point(LayoutConfig.page.width * 0.4, 1000); // the tip of the pointer
        let to = new Point(LayoutConfig.page.width * 0.5, 250); // where the pointer lines touch the bottom border of the bubble
        let toLeft = to.clone().translate(-distanceLeftRight / 2);
        let toRight = to.clone().translate(distanceLeftRight / 2);
        let mouseBounds = Rectangle.from(from, to);

        const initialMousePos = myCanvas.getMousePositionFromCanvasPosition(
            to.x + (from.x - to.x) * LayoutConfig.bubble.pointer.controlPointVerticalPosition,
            to.y + (from.y - to.y) * LayoutConfig.bubble.pointer.controlPointVerticalPosition
        );
        drawBubblePointer(initialMousePos.x, initialMousePos.y);

        let isMoving = false;

        myCanvas.onMouseDown = (event: MouseEvent) => {
            isMoving = true;
            repaint(event);
        };

        myCanvas.onMouseUp = () => {
            isMoving = false;
        };

        myCanvas.onMouseMove = (event: MouseEvent) => {
            if (isMoving) { repaint(event); }
        };

        myCanvas.onDblClick = (event: MouseEvent) => {
            from = myCanvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);
            mouseBounds = Rectangle.from(from, to);
            repaint(event);
        };

        function repaint(event: MouseEvent) {
            window.requestAnimationFrame(() => {
                myCanvas.clear();
                drawBubblePointer(event.clientX, event.clientY);
            });
        }

        function drawBubblePointer(clientX, clientY) {
            const mousePos = myCanvas.getCanvasPositionFromMousePosition(clientX, clientY)
                .constrainY(mouseBounds);

            const fromToDistance = to.distanceTo(from);
            const fixedRangeTop = to.clone().translate(0, fromToDistance.y * calcFixedRangeTop(from, to)); // control points will have the same distance as toLeft and toRight above this y position
            const dy = fixedRangeTop.distanceTo(mousePos).y;
            const cpDistance = dy / fixedRangeTop.distanceTo(from).y;
            const cpLeft = mousePos.clone().translate((1 - (mousePos.y < fixedRangeTop.y ? 0 : cpDistance)) * -distanceLeftRight / 2);
            const cpRight = mousePos.clone().translate((1 - (mousePos.y < fixedRangeTop.y ? 0 : cpDistance)) * distanceLeftRight / 2);

            myCanvas.clear();
            myCanvas.lineXY(
                0, fixedRangeTop.y,
                LayoutConfig.page.width, fixedRangeTop.y,
                PaintStyleConfig.stroke("lightgrey", 2)
            );
            myCanvas.lineFromTo(toLeft, cpLeft, PaintStyleConfig.stroke("lightgrey", 2));
            myCanvas.lineFromTo(toRight, cpRight, PaintStyleConfig.stroke("lightgrey", 2));
            myCanvas.bezier(from, toLeft, cpLeft, PaintStyleConfig.stroke("black", 8));
            myCanvas.bezier(from, toRight, cpRight, PaintStyleConfig.stroke("black", 8));
            myCanvas.circle(from, 10, PaintStyleConfig.fill("teal"));
            myCanvas.circle(toLeft, 10, PaintStyleConfig.fill("pink"));
            myCanvas.circle(toRight, 10, PaintStyleConfig.fill("pink"));
            myCanvas.circle(cpLeft, 10, PaintStyleConfig.fill("orange"));
            myCanvas.circle(cpRight, 10, PaintStyleConfig.fill("orange"));
        }

        /**
         * Calculates the vertical position where the distance of the control points equals
         * the distance of the two bubble pointer lines where they touch the bottom border of the bubble.
         *
         * @param from The tip of the pointer (lower point)
         * @param to Point where the pointer touches the bottom border of the bubble (upper point)
         */
        function calcFixedRangeTop(from: Point, to: Point): number {
            const w1 = LayoutConfig.bubble.pointer.widthNearBubble;
            const w2 = LayoutConfig.bubble.pointer.controlPointWidth;
            const h1 = from.y - to.y;
            const h2 = h1 * (1 - LayoutConfig.bubble.pointer.controlPointVerticalPosition);
            return (1 - (h2 / w2 * w1) / h1);
        }
    }
}