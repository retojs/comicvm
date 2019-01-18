import { Point } from "./Point";
import { Line } from "./Line";

export class Circle {

    origin: Point;
    radius: number;

    constructor(origin: Point, radius: number) {
        this.origin = origin;
        this.radius = radius
    }

    intersection(line: Line): Point[] {
        // make circle center the origin of our coordinate system:
        line.translate(-this.origin.x, -this.origin.y);

        // calculate intersection:
        //
        const result = [new Point(0, 0), new Point(0,0)];


        // move coordinates back to normal
        result.forEach(point => point.translate(this.origin.x, this.origin.y));

        return [new Point(0, 0), new Point(0, 0)];
    }
}