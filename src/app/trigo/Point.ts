export class Point {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translate(dx?: number, dy?: number): Point {
        this.x = dx ? this.x + dx : this.x;
        this.y = dy ? this.y + dy : this.y;

        return this;
    }

    distanceTo(point: Point): Point {
        return new Point(
            point.x - this.x,
            point.y - this.y
        )
    }
}