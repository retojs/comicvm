import { Div } from "../dom/Div";
import { DomElementContainer } from "../dom/DomElement";
import { Rectangle } from "../trigo/Rectangle";
import { Offset } from "../trigo/Offset";
import { Point } from "../trigo/Point";
import { MarginConfig } from "../layout/Layout.config";

/**
 * The width of the border around the resizable DIV.
 * (Needed to calculate position and size correctly.)
 */
export const resizableElementBorderWidth = 4;
export const resizableElementBorder = new MarginConfig(
    0,
    2 * resizableElementBorderWidth,
    2 * resizableElementBorderWidth,
    0
);

enum ResizeDirection {
    Horizontal,
    Vertical,
    TopRight,
    BottomRight,
    BottomLeft,
    TopLeft
}

export class ResizableDiv extends Div {

    initialMousePos: Point;
    initialShape: Rectangle;
    mouseMoveHandler: EventListener;

    constructor(container: DomElementContainer, styleClass?: string, innerHTML?: string,) {
        super(container, styleClass, innerHTML);
        this.class = 'resizable-div';
        this.createHandles();
    }

    createHandles() {
        const top = new Div(this, "resizable-div__handle--top");
        const topRight = new Div(this, "resizable-div__handle--top-right");
        const right = new Div(this, "resizable-div__handle--right");
        const bottomRight = new Div(this, "resizable-div__handle--bottom-right");
        const bottom = new Div(this, "resizable-div__handle--bottom");
        const bottomLeft = new Div(this, "resizable-div__handle--bottom-left");
        const left = new Div(this, "resizable-div__handle--left");
        const topLeft = new Div(this, "resizable-div__handle--top-left");
        const middle = new Div(this, "resizable-div__handle--middle");

        top.onMouseDown = this.createMouseDownHandler(
            this.resizeTop.bind(this),
            ResizeDirection.Vertical
        );
        topRight.onMouseDown = this.createMouseDownHandler(
            this.resizeTopRight.bind(this),
            ResizeDirection.TopRight
        );
        right.onMouseDown = this.createMouseDownHandler(
            this.resizeRight.bind(this),
            ResizeDirection.Horizontal
        );
        bottomRight.onMouseDown = this.createMouseDownHandler(
            this.resizeBottomRight.bind(this),
            ResizeDirection.BottomRight
        );
        bottom.onMouseDown = this.createMouseDownHandler(
            this.resizeBottom.bind(this),
            ResizeDirection.Vertical
        );
        bottomLeft.onMouseDown = this.createMouseDownHandler(
            this.resizeBottomLeft.bind(this),
            ResizeDirection.BottomLeft
        );
        left.onMouseDown = this.createMouseDownHandler(
            this.resizeLeft.bind(this),
            ResizeDirection.Horizontal
        );
        topLeft.onMouseDown = this.createMouseDownHandler(
            this.resizeTopLeft.bind(this),
            ResizeDirection.TopLeft
        );
        middle.onMouseDown = this.createMouseDownHandler(
            this.move.bind(this),
            null
        );

        document.addEventListener("mouseup", () => {
            console.log("mouse up");
            this.initialMousePos = null;
        });

        document.addEventListener("mousemove", (event: MouseEvent) => {
            if (this.initialMousePos) {
                this.mouseMoveHandler(event);
            }
        });
    }

    createMouseDownHandler(mouseMoveHandler: (dSize: number) => void, direction: ResizeDirection): EventListener {
        return function handleMouseDown(event: MouseEvent) {
            this.initialMousePos = new Point(event.clientX, event.clientY);
            this.initialShape = this.shape.clone();
            this.mouseMoveHandler = (event: MouseEvent) => {
                const dPos = this.getMovedOffset(event);
                if (direction == null) {
                    mouseMoveHandler(dPos);
                } else {
                    let dSize = 0;
                    switch (direction) {
                        case ResizeDirection.Horizontal:
                            dSize = dPos.dx;
                            break;
                        case ResizeDirection.Vertical:
                            dSize = dPos.dy;
                            break;
                        case ResizeDirection.TopRight:
                            dSize = getMaxAbs(dPos.dx, -dPos.dy);
                            break;
                        case ResizeDirection.BottomRight:
                            dSize = getMaxAbs(dPos.dx, dPos.dy);
                            break;
                        case ResizeDirection.BottomLeft:
                            dSize = getMaxAbs(-dPos.dx, dPos.dy);
                            break;
                        case ResizeDirection.TopLeft:
                            dSize = getMaxAbs(-dPos.dx, -dPos.dy);
                            break;
                    }
                    mouseMoveHandler(dSize);
                }
            }
        }.bind(this);

        function getMaxAbs(a: number, b: number): number {
            return Math.abs(a) >= Math.abs(b) ? a : b;
        }
    }

    move(dPos: Offset) {
        this.shape = this.initialShape.clone()
            .translate(dPos.dx, dPos.dy)
            .cutMargin(resizableElementBorder);
    }

    resizeTop(dSize: number) {
        const shape = this.initialShape.clone().translate(dSize / 2, dSize);
        this.shape = this.resize(shape, -dSize);
    }

    resizeTopRight(dSize: number) {
        const shape = this.initialShape.clone().translate(0, -dSize);
        this.shape = this.resize(shape, dSize);
    }

    resizeRight(dSize: number) {
        const shape = this.initialShape.clone().translate(0, -dSize / 2);
        this.shape = this.resize(shape, dSize);
    }

    resizeBottomRight(dSize: number) {
        const shape = this.initialShape.clone();
        this.shape = this.resize(shape, dSize);
    }

    resizeBottom(dSize: number) {
        const shape = this.initialShape.clone().translate(-dSize / 2, 0);
        this.shape = this.resize(shape, dSize);
    }

    resizeBottomLeft(dSize: number) {
        const shape = this.initialShape.clone().translate(-dSize, 0);
        this.shape = this.resize(shape, dSize);
    }

    resizeLeft(dSize: number) {
        const shape = this.initialShape.clone().translate(dSize, dSize / 2);
        this.shape = this.resize(shape, -dSize);
    }

    resizeTopLeft(dSize: number) {
        const shape = this.initialShape.clone().translate(-dSize, -dSize);
        this.shape = this.resize(shape, dSize);
    }

    resize(shape: Rectangle, dSize: number): Rectangle {
        shape.cutMargin(resizableElementBorder);
        shape.width += dSize;
        shape.height += dSize;
        return shape;
    }

    getMovedOffset(event: MouseEvent): Offset {
        return new Offset(
            event.clientX - this.initialMousePos.x,
            event.clientY - this.initialMousePos.y,
        )
    };
}