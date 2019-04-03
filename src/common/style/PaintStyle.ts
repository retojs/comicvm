import { Font } from "./Font";
import { TextAlign } from "./TextAlign";

export const enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}

export class PaintStyleConfig {

    enabled: boolean;

    strokeStyle: string;
    fillStyle: string;
    lineWidth: number;
    lineCap: LineCap;
    font: Font;
    textAlign: TextAlign;

    private constructor(fillStyle?: string, strokeStyle?: string, lineWidth?: number, lineCap?: LineCap, font?: Font, textAlign?: TextAlign, enabled?: boolean) {
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
        this.font = font;
        this.textAlign = textAlign;
        this.enabled = enabled === undefined ? true : enabled;
    }

    static stroke(color: string, lineWidth?: number, lineCap?: LineCap, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(null, color, lineWidth, lineCap, null, null, enabled);
    }

    static fill(color: string, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(color, null, null, null, null, null, enabled);
    }

    static text(color: string, textAlign?: TextAlign, font?: Font, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(color, null, null, null, font, textAlign, enabled);
    }

    static fillAndStroke(fillStyle: string, strokeStyle: string, lineWidth?: number, lineCap?: LineCap, enabled?: boolean) {
        return new PaintStyleConfig(fillStyle, strokeStyle, lineWidth, lineCap, null, null, enabled);
    }
}