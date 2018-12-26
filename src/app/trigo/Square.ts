import { Rectangle } from "./Rectangle";
import { PositionChange } from "./PositionChange";

export class Square extends Rectangle {

    constructor(x: number, y: number, size: number) {
        super(x, y, size, size);
    }

    get _size() {
        return this._width;
    }

    get size() {
        return this._width || 1.0;
    }

    set size(size: number) {
        this._width = size;
        this._height = size;
    }

    clone(): Square {
        return new Square(this.x, this.y, this.size);
    }

    adjust(positionChange: PositionChange) {
        positionChange.adjust(this);
    }
}