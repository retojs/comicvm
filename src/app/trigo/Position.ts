export class Position {

    x: number;
    y: number;
    size?: number;

    constructor(x: number, y: number, size?: number) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
}