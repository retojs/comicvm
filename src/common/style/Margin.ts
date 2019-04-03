export interface MarginProperties {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class Margin implements Margin {

    top: number;
    right: number;
    bottom: number;
    left: number;

    initial: MarginProperties;

    constructor(top: number, right?: number, bottom?: number, left?: number) {
        this.top = this.bottom = top;
        this.right = this.left = right == null ? this.top : right;
        this.bottom = bottom == null ? this.bottom : bottom;
        this.left = left == null ? this.left : left;

        this.initial = {top, right, bottom, left};
    }

    get horizontal() {
        return this.right + this.left;
    }

    get vertical() {
        return this.top + this.bottom;
    }

    get asString() {
        return [this.initial.top, this.initial.right, this.initial.bottom, this.initial.left]
            .filter(n => !!n)
            .join(" ");
    }
}
