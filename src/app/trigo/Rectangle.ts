import { Point } from "./Point";
import { MarginConfig } from "../layout/LayoutConfig";

export class Rectangle {

    _x: number;
    _y: number;
    _width: number;
    _height: number;

    constructor(x: number, y: number, width: number, height: number) {
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

    static fitToBounds(fitMe: Rectangle, container: Rectangle) {
        const scale = Math.min(container.width / fitMe.width, container.height / fitMe.height);
        fitMe.width *= scale;
        fitMe.height *= scale;
        return Rectangle.alignCentered(fitMe, container);
    }

    static fitAroundBounds(fitMe: Rectangle, contained: Rectangle) {
        const scale = Math.max(contained.width / fitMe.width, contained.height / fitMe.height);
        fitMe.width *= scale;
        fitMe.height *= scale;
        return Rectangle.alignCentered(fitMe, contained);
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

    addMargin(margin: MarginConfig): Rectangle {
        this.x -= margin.left;
        this.y -= margin.top;
        this.width += margin.horizontal;
        this.height += margin.vertical;

        return this;
    }

    cutMargin(margin: MarginConfig): Rectangle {
        this.x += margin.left;
        this.y += margin.top;
        this.width -= margin.horizontal;
        this.height -= margin.vertical;

        return this;
    }
}