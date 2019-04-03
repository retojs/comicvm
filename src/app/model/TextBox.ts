import { Rectangle } from "../../common/trigo/Rectangle";

export class TextBox {

    lines: string[];
    lineHeight: number;
    maxLineWidth: number;
    actualMaxLineWidth: number;

    constructor(lines: string[], lineHeight: number, maxLineWidth: number, actualMaxLineWidth: number) {
        this.lines = lines;
        this.lineHeight = lineHeight;
        this.maxLineWidth = maxLineWidth;
        this.actualMaxLineWidth = actualMaxLineWidth;
    }

    get width(): number {
        return this.actualMaxLineWidth;
    }

    get height(): number {
        return this.lineHeight * this.lines.length;
    }

    get shape(): Rectangle {
        return new Rectangle(
            0,
            0,
            this.width,
            this.height
        )
    }
}
