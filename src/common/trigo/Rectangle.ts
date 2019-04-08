import { Point } from "./Point";
import { Dimensions } from "./Dimensions";
import { Transform } from "./Transform";
import { Margin } from "../style/Margin";

export class Rectangle {

    _x: number;
    _y: number;
    _width: number;
    _height: number;

    static fromPoints(p1: Point, p2: Point) {
        return new Rectangle(
            Math.min(p1.x, p2.x),
            Math.min(p1.y, p2.y),
            Math.abs(p1.x - p2.x),
            Math.abs(p1.y - p2.y));
    }

    static fromDimensions(dimensions: Dimensions, x: number = 0, y: number = 0): Rectangle {
        return new Rectangle(x, y, dimensions.width, dimensions.height);
    }

    constructor(x?: number, y?: number, width?: number, height?: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    get x() {
        return this._x || 0;
    }

    set x(x: number) {
        this._x = x;
    }

    get y() {
        return this._y || 0;
    }

    set y(y: number) {
        this._y = y;
    }

    get width() {
        return this._width || 0;
    }

    set width(width: number) {
        this._width = width;
    }

    get height() {
        return this._height || 0;
    }

    set height(height: number) {
        this._height = height;
    }

    get center(): Point {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    get topLeft(): Point {
        return new Point(this.x, this.y);
    }

    get topRight(): Point {
        return new Point(this.x + this.width, this.y);
    }

    get bottomLeft(): Point {
        return new Point(this.x, this.y + this.height);
    }

    get bottomRight(): Point {
        return new Point(this.x + this.width, this.y + this.height);
    }

    static getBoundingBox(rectangles: Rectangle[]): Rectangle {
        let left = Number.MAX_VALUE,
            top = Number.MAX_VALUE,
            right = 0,
            bottom = 0;

        rectangles.forEach(rect => {
            left = rect.x < left ? rect.x : left;
            top = rect.y < top ? rect.y : top;
            right = rect.x + rect.width > right ? rect.x + rect.width : right;
            bottom = rect.y + rect.height > bottom ? rect.y + rect.height : bottom;
        });

        return new Rectangle(left, top, right - left, bottom - top);
    }

    static fitIntoBounds(fitMe: Rectangle, container: Rectangle) {
        const scale = Rectangle.getMinScale(fitMe, container);
        fitMe.width *= scale;
        fitMe.height *= scale;
        return Rectangle.alignCentered(fitMe, container);
    }

    static fitAroundBounds(fitMe: Rectangle, contained: Rectangle) {
        const scale = Rectangle.getMaxScale(fitMe, contained);
        fitMe.width *= scale;
        fitMe.height *= scale;
        return Rectangle.alignCentered(fitMe, contained);
    }

    static getMinScale(r1: Rectangle, r2: Rectangle): number {
        return Math.min(r2.width / r1.width, r2.height / r1.height);
    }

    static getMaxScale(r1: Rectangle, r2: Rectangle): number {
        return Math.max(r2.width / r1.width, r2.height / r1.height);
    }

    static alignCentered(alignMe: Rectangle, container: Rectangle): Rectangle {
        const offsetX = (container.width - alignMe.width) / 2,
            offsetY = (container.height - alignMe.height) / 2;
        alignMe.x = container.x + offsetX;
        alignMe.y = container.y + offsetY;
        return alignMe;
    }

    clone(): Rectangle {
        return new Rectangle(this._x, this._y, this._width, this._height);
    }

    translate(dx?: number, dy?: number): Rectangle {
        this.x = dx ? this.x + dx : this.x;
        this.y = dy ? this.y + dy : this.y;
        return this;
    }

    translateInvert(dx?: number, dy?: number): Rectangle {
        this.x = dx ? this.x - dx : this.x;
        this.y = dy ? this.y - dy : this.y;
        return this;
    }

    translateTo(position: Point): Rectangle {
        this.x = position.x;
        this.y = position.y;
        return this;
    }

    translateToOrigin(): Rectangle {
        this.x = 0;
        this.y = 0;
        return this;
    }

    transform(transform: Transform): Rectangle {
        this.x += transform.dx;
        this.y += transform.dy;
        this.width /= transform.scale;
        this.height /= transform.scale;
        return this;
    }

    transformTo(target: Rectangle): Rectangle {
        return this.transform(this.getShapeTransformTo(target))
    }

    getCanvasTransformTo(target: Rectangle): Transform {
        const scale = Rectangle.getMinScale(this, target);
        const targetShape = Rectangle.fitIntoBounds(this.clone(), target);
        const dx = targetShape.x / scale - this.x;
        const dy = targetShape.y / scale - this.y;
        return new Transform(dx, dy, scale);
    }

    getShapeTransformTo(target: Rectangle): Transform {
        const scale = Rectangle.getMinScale(this, target);
        const targetShape = Rectangle.fitIntoBounds(this.clone(), target);
        const dx = targetShape.x - this.x;
        const dy = targetShape.y - this.y;
        return new Transform(dx, dy, 1 / scale);
    }

    /**
     * Scales and translates this rectangle as if it was a part of the specified container
     * and the container was transformed by the specified transformation.
     *
     * @param transform
     * @param container
     */
    transformAsPartOf(container: Rectangle, transform: Transform): Rectangle {
        const distance = container.topLeft.distanceTo(this.topLeft);
        const transformedContainer = container.clone().transform(transform);
        this.x = transformedContainer.x + distance.x / transform.scale;
        this.y = transformedContainer.y + distance.y / transform.scale;
        this.width /= transform.scale;
        this.height /= transform.scale;
        return this;
    }

    scale(scale: number, origin?: Point): Rectangle {
        origin = origin || new Point(this.x, this.y);

        let dx = this.x - origin.x,
            dy = this.y - origin.y;
        this.x = origin.x + dx * scale;
        this.y = origin.y + dy * scale;
        this.width *= scale;
        this.height *= scale;

        return this;
    }

    expand(margin: number): Rectangle {
        this.x -= margin;
        this.y -= margin;
        this.width += margin * 2;
        this.height += margin * 2;

        return this;
    }

    shrink(margin: number): Rectangle {
        return this.expand(-margin);
    }

    addMargin(margin: Margin): Rectangle {
        this.x -= margin.left;
        this.y -= margin.top;
        this.width += margin.horizontal;
        this.height += margin.vertical;

        return this;
    }

    addMarginOf(width: number): Rectangle {
        return this.addMargin(new Margin(width));
    }

    cutMargin(margin: Margin): Rectangle {
        this.x += margin.left;
        this.y += margin.top;
        this.width -= margin.horizontal;
        this.height -= margin.vertical;

        return this;
    }

    cutMarginOf(width: number): Rectangle {
        return this.cutMargin(new Margin(width));
    }

    contains(point: Point): boolean {
        return this.x < point.x
            && this.x + this.width > point.x
            && this.y < point.y
            && this.y + this.height > point.y
    }

    toString() {
        return `Rectangle: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`;
    }
}