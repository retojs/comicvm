import { Rectangle } from "./Rectangle";

export class Dimensions {

    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    static fromRectangle(shape: Rectangle): Dimensions {
        return new Dimensions(shape.width, shape.height);
    }

    clone(): Dimensions {
        return new Dimensions(this.width, this.height);
    }

    scale(scale: number): Dimensions {
        this.width *= scale;
        this.height *= scale;
        return this;
    }

    scaleTo(width: number) {
        this.scale(width / this.width)
    }
}