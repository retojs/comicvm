import { Font } from "./Font";
import { TextAlign } from "./TextAlign";
import { Line } from "../trigo/Line";

export const enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}

export const enum GradientType {
    Linear = "linar",
    Radial = "radial"
}

export interface GradientProperties {
    type: GradientType;
    colors: string[];
    direction: Line;
    fill: boolean;
    stroke: boolean;
}

export class PaintStyleConfig {

    enabled: boolean;

    strokeStyle: string | CanvasGradient;
    fillStyle: string | CanvasGradient;
    lineWidth: number;
    lineCap: LineCap;
    font: Font;
    textAlign: TextAlign;
    gradient: GradientProperties;

    private constructor(fillStyle?: string | CanvasGradient,
                        strokeStyle?: string | CanvasGradient,
                        lineWidth?: number,
                        lineCap?: LineCap,
                        font?: Font,
                        textAlign?: TextAlign,
                        gradient?: GradientProperties,
                        enabled?: boolean) {
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
        this.font = font;
        this.textAlign = textAlign;
        this.gradient = gradient;
        this.enabled = enabled === undefined ? true : enabled;
    }

    static stroke(color: string, lineWidth?: number, lineCap?: LineCap, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(null, color, lineWidth, lineCap, null, null, null, enabled);
    }

    static fill(color: string, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(color, null, null, null, null, null, null, enabled);
    }

    static text(color: string, textAlign?: TextAlign, font?: Font, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(color, null, null, null, font, textAlign, null, enabled);
    }

    static fillAndStroke(fillStyle: string, strokeStyle: string, lineWidth?: number, lineCap?: LineCap, enabled?: boolean) {
        return new PaintStyleConfig(fillStyle, strokeStyle, lineWidth, lineCap, null, null, null, enabled);
    }

    static gradientFill(type: GradientType, colors: string[], direction?: Line) {
        return new PaintStyleConfig(null, null, null, null, null, null,
            {type, colors, direction, fill: true, stroke: false}
        );
    }

    static gradientStroke(type: GradientType, colors: string[], direction?: Line, lineWidth?: number) {
        return new PaintStyleConfig(null, null, lineWidth, null, null, null,
            {type, colors, direction, fill: false, stroke: true}
        );
    }

    clone(): PaintStyleConfig {
        return new PaintStyleConfig(this.strokeStyle, this.fillStyle, this.lineWidth, this.lineCap, this.font, this.textAlign, this.gradient, this.enabled);
    }
}