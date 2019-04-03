export class Offset {

    dx: number;
    dy: number;

    constructor(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    };

    invert(): Offset {
        return new Offset(-this.dx, -this.dy);
    }
}