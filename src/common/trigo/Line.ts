import { Point } from "./Point";

export class Line {

    from: Point;
    to: Point;

    constructor(from?: Point, to?: Point) {
        this.from = from;
        this.to = to;
    }

    setFrom(x: number, y: number): Line {
        this.from = new Point(x, y);
        return this;
    }

    setTo(x: number, y: number): Line {
        this.to = new Point(x, y);
        return this;
    }

    get isVertical(): boolean {
        return this.from.x === this.to.x;
    }

    get isHorizontal(): boolean {
        return this.from.y === this.to.y;
    }

    get gradient(): number {
        const dx = this.from.x - this.to.x;
        const dy = this.from.y - this.to.y;
        if (dx) {
            return dy / dx;
        } else {
            return Number.POSITIVE_INFINITY;
        }
    }

    get verticalIntercept(): number {
        return this.from.y - this.from.x * this.gradient;
    }

    /**
     * Returns the parameters of the line equation ax + by = c
     */
    get parameters(): { a: number, b: number, c: number } {

        // the calculation is explained here:
        //  https://de.wikipedia.org/wiki/Koordinatenform

        return {
            a: this.from.y - this.to.y,
            b: this.to.x - this.from.x,
            c: this.from.x * this.to.y - this.from.x * this.to.y
        };
    }

    get width(): number {
        return Math.max(this.from.x, this.to.x) - Math.min(this.from.x, this.to.x);
    }

    get height(): number {
        return Math.max(this.from.y, this.to.y) - Math.min(this.from.y, this.to.y);
    }

    getPointAtX(x: number): Point {
        const dx: number = x - this.from.x;
        return this.from.clone().translate(dx, this.gradient * dx);
    }

    translate(dx?: number, dy?: number): Line {
        this.from.translate(dx, dy);
        this.to.translate(dx, dy);
        return this;
    }

    clone(): Line {
        return new Line(this.from.clone(), this.to.clone());
    }

    isParallel(line: Line) {
        return this.gradient === line.gradient;
    }

    hasIntersectionWith(line: Line): boolean {
        return !this.isParallel(line);
    }

    intersection(line: Line): Point {

        // TODO: refactor using line equation ax + by = c
        //      see Line.parameters() and https://de.wikipedia.org/wiki/Koordinatenform
        //      for the result see https://de.wikipedia.org/wiki/Schnittpunkt

        if (!this.hasIntersectionWith(line)) {
            return null;
        }
        if (this.isVertical) {
            return line.getPointAtX(this.from.x);
        }

        const x = (line.verticalIntercept - this.verticalIntercept) / (this.gradient - line.gradient);
        const y = this.verticalIntercept + this.gradient * x;

        return new Point(x, y);
    }
}