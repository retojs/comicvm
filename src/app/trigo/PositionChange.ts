import { Square } from "./Square";

export class PositionChange {

    _dx: number;
    _dy: number;
    _scale: number;

    constructor(dx: number, dy: number, scale?: number) {
        this._dx = dx;
        this._dy = dy;
        this._scale = scale;
    }

    get dx() {
        return this._dx || 0;
    }

    get dy() {
        return this._dy || 0;
    }

    get scale() {
        return this._scale || 1.0;
    }

    clone(): PositionChange {
        return new PositionChange(this._dx, this._dy, this._scale);
    }

    adjust(square: Square): void {
        const size = square.size * this.scale,
            x = square.x + (this.dx * square.size) - (size - square.size) / 2,
            y = square.y + (this.dy * square.size) - (size - square.size) / 2;

        square.x = x;
        square.y = y;
        square.size = size;
    }
}