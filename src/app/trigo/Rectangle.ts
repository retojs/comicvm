export class Rectangle {

    width: number;
    height: number;
    x: number;
    y: number;

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