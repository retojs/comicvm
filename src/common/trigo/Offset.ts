import { Point } from "./Point";

export class Offset extends Point {

    get dx(): number {
        return this.x;
    };

    get dy(): number {
        return this.y;
    };

    constructor(dx: number, dy: number) {
        super(dx, dy)
    };
}