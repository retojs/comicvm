import { Canvas } from "../common/dom/Canvas";
import { Point } from "../common/trigo/Point";
import { DomElementContainer } from "../common/dom/DomElement";
import { LayoutConfig } from "../app/layout/Layout.config";
import { Rectangle } from "../common/trigo/Rectangle";
import { Demo, DEMO_DEFAULT_WIDTH } from "./Demo";
import { PaintStyleConfig } from "../common/style/PaintStyle";
import { DemoContext } from "./DemoContext";


// TODO
//  - rename to bubble pointer demo
//  - write canvas-demo abstract base class
//  - write demo selector

export class BezierBubblePointerDemo implements Demo {

    name = "Bezier Bubble Pointer";
    desc = "This tool helps with the calculation of the bubble pointer bezier curves. (double click to set pointer)";

    create(container: DomElementContainer) {
        const layoutConfig = new LayoutConfig();
        const myCanvas = new Canvas(container, DEMO_DEFAULT_WIDTH, 400, DEMO_DEFAULT_WIDTH / layoutConfig.page.width);

        DemoContext.setupCanvasPositionListeners(myCanvas);

        const distanceLeftRight = 100;
        
        let from = new Point(layoutConfig.page.width * 0.4, 1000); // the tip of the pointer
        let to = new Point(layoutConfig.page.width * 0.5, 250); // where the pointer lines touch the bottom border of the bubble
        let toLeft = to.clone().translate(-distanceLeftRight / 2);
        let toRight = to.clone().translate(distanceLeftRight / 2);
        let mouseBounds = Rectangle.fromPoints(from, to);

        const initialMousePos = myCanvas.getDomPositionFromCanvasPosition(
            to.x + (from.x - to.x) * layoutConfig.bubble.pointer.controlPoint.verticalOffset,
            to.y + (from.y - to.y) * layoutConfig.bubble.pointer.controlPoint.verticalOffset
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
            mouseBounds = Rectangle.fromPoints(from, to);
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
                layoutConfig.page.width, fixedRangeTop.y,
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
            const w1 = layoutConfig.bubble.pointer.bubbleEndsDistance;
            const w2 = layoutConfig.bubble.pointer.controlPoint.width;
            const h1 = from.y - to.y;
            const h2 = h1 * (1 - layoutConfig.bubble.pointer.controlPoint.verticalOffset);
            return (1 - (h2 / w2 * w1) / h1);
        }
    }
}