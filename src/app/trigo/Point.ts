import { Rectangle } from "./Rectangle";

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

    constrain(bounds: Rectangle): Point {
        return this.constrainX(bounds).constrainY(bounds);
    }

    constrainX(bounds: Rectangle): Point {
        this.x = Math.max(bounds.x, Math.min(bounds.x + bounds.width, this.x));
        return this;
    }

    constrainY(bounds: Rectangle): Point {
        this.y = Math.max(bounds.y, Math.min(bounds.y + bounds.height, this.y));
        return this;
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }

}