import { Div } from "../../common/dom/Div";
import { DomElementContainer } from "../../common/dom/DomElement";
import { Rectangle } from "../../common/trigo/Rectangle";
import { Offset } from "../../common/trigo/Offset";
import { Point } from "../../common/trigo/Point";
import { Square } from "../../common/trigo/Square";

enum ResizeDirection {
    Horizontal,
    Vertical,
    TopRight,
    BottomRight,
    BottomLeft,
    TopLeft
}

export class ResizableDiv extends Div {

    private initialMousePos: Point;
    private initialShape: Rectangle;
    private mouseMoveHandler: EventListener;

    private onSizeChangeHandler: (size: Rectangle) => void = () => {};

    constructor(container: DomElementContainer, styleClass?: string, innerHTML?: string,) {
        super(container, styleClass, innerHTML);
        this.class = 'resizable-div';
        this.createHandles();
    }

    set onSizeChange(onSizeChange: (size: Square) => void) {
        this.onSizeChangeHandler = onSizeChange;
    }

    private createHandles() {
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
            this.initialMousePos = null;
        });

        document.addEventListener("mousemove", (event: MouseEvent) => {
            if (this.initialMousePos) {
                this.mouseMoveHandler(event);
            }
        });
    }

    private createMouseDownHandler(mouseMoveHandler: (dSize: number) => void,
                                   resizeDirection: ResizeDirection): EventListener {

        return function handleMouseDown(event: MouseEvent) {
            this.initialMousePos = new Point(event.clientX, event.clientY);
            this.initialShape = this.shape.clone();
            this.mouseMoveHandler = (event: MouseEvent) => {
                const dPos = this.getMovedOffset(event);
                if (resizeDirection == null) {
                    mouseMoveHandler(dPos);
                } else {
                    let dSize = 0;
                    switch (resizeDirection) {
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

    private move(dPos: Offset) {
        this.shape = this.initialShape.clone().translate(dPos.dx, dPos.dy);
        this.onSizeChangeHandler(this.shape.clone());
    }

    private resizeTop(dSize: number) {
        const shape = this.initialShape.clone().translate(dSize / 2, dSize);
        this.shape = this.resize(shape, -dSize);
    }

    private resizeTopRight(dSize: number) {
        const shape = this.initialShape.clone().translate(0, -dSize);
        this.shape = this.resize(shape, dSize);
    }

    private resizeRight(dSize: number) {
        const shape = this.initialShape.clone().translate(0, -dSize / 2);
        this.shape = this.resize(shape, dSize);
    }

    private resizeBottomRight(dSize: number) {
        const shape = this.initialShape.clone();
        this.shape = this.resize(shape, dSize);
    }

    private resizeBottom(dSize: number) {
        const shape = this.initialShape.clone().translate(-dSize / 2, 0);
        this.shape = this.resize(shape, dSize);
    }

    private resizeBottomLeft(dSize: number) {
        const shape = this.initialShape.clone().translate(-dSize, 0);
        this.shape = this.resize(shape, dSize);
    }

    private resizeLeft(dSize: number) {
        const shape = this.initialShape.clone().translate(dSize, dSize / 2);
        this.shape = this.resize(shape, -dSize);
    }

    private resizeTopLeft(dSize: number) {
        const shape = this.initialShape.clone().translate(-dSize, -dSize);
        this.shape = this.resize(shape, dSize);
    }

    private resize(shape: Rectangle, dSize: number): Rectangle {
        shape.width += dSize;
        shape.height += dSize;
        this.onSizeChangeHandler(shape.clone());
        return shape;
    }

    private getMovedOffset(event: MouseEvent): Offset {
        return new Offset(
            event.clientX - this.initialMousePos.x,
            event.clientY - this.initialMousePos.y,
        )
    };
}