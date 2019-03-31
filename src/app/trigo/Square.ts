import { Rectangle } from "./Rectangle";
import { Transform } from "./Transform";

export class Square extends Rectangle {

    static fromRectangle(rect: Rectangle): Square {
        return new Square(rect.x, rect.y, Math.min(rect.width, rect.height));
    }

    constructor(x: number, y: number, size: number) {
        super(x, y, size, size);
    }

    get _size() {
        return this._width;
    }

    get size() {
        return this._size || 1.0;
    }

    set size(size: number) {
        this._width = size;
        this._height = size;
    }

    clone(): Square {
        return new Square(this.x, this.y, this.size);
    }

    transform(transform: Transform) {
        transform.transform(this);
        return this;
    }
}