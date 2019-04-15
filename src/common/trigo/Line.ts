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

    get gradient(): number {
        const dx = this.from.x - this.to.x;
        const dy = this.from.y - this.to.y;
        if (dx) {
            return dy / dx;
        } else {
            return 0;
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

    translate(dx?: number, dy?: number): Line {
        this.from.translate(dx, dy);
        this.to.translate(dx, dy);
        return this;
    }

    clone(): Line {
        return new Line(this.from.clone(), this.to.clone());
    }

    intersection(line: Line): Point {

        // TODO refactor using line equation ax + by = c
        //      see Line.parameters() and https://de.wikipedia.org/wiki/Koordinatenform

        // intersect condition: x1 = x2, y1 = y2
        //
        // line 1: y = verticalIntercept1 + gradient1 * x
        // line 2: y = verticalIntercept2 + gradient2 * x
        //
        //  --> verticalIntercept1 + gradient1 * x                 =  verticalIntercept2 + gradient2 * x
        //  -->                      gradient1 * x - gradient2 * x =  verticalIntercept2 - verticalIntercept1
        //  -->                 x * (gradient1     - gradient2)    =  verticalIntercept2 - verticalIntercept1
        //  -->                 x                                  = (verticalIntercept2 - verticalIntercept1) / (gradient1 - gradient2)

        const x = (line.verticalIntercept - this.verticalIntercept) / (this.gradient - line.gradient);
        const y = this.verticalIntercept + this.gradient * x;
        return new Point(x, y);
    }
}