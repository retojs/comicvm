export class Rectangle {

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get dim(): { w: number, h: number } {
        return {
            w: this.width,
            h: this.height
        };
    }

    set dim(dim: { w: number, h: number }) {
        this.width = dim.w;
        this.height = dim.h;
    }

    get pos(): { x: number, y: number } {
        return {
            x: this.x,
            y: this.y
        };
    }

    set pos(pos: { x: number, y: number }) {
        this.x = pos.x;
        this.y = pos.y;
    }
}