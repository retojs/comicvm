import { TextAlign } from "../layout/LayoutConfig";
import { LineCap } from "../dom/Canvas";

export class CanvasConfig {
    id = "comic-vm-canvas";
    width = 800;
    height = 1200;
    font = "40px Roboto";
}

export class PaintStyleConfig {

    enabled: boolean;

    strokeStyle: string;
    fillStyle: string;
    lineWidth: number;
    lineCap: LineCap;
    font: string;
    textAlign: TextAlign;

    private constructor(fillStyle?: string, strokeStyle?: string, lineWidth?: number, lineCap?: LineCap, font?: string, textAlign?: TextAlign, enabled?: boolean) {
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

    static text(color: string, textAlign?: TextAlign, font?: string, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(color, null, null, null, font, textAlign, enabled);
    }

    static fillAndStroke(fillStyle: string, strokeStyle: string, lineWidth?: number, lineCap?: LineCap, enabled?: boolean) {
        return new PaintStyleConfig(fillStyle, strokeStyle, lineWidth, lineCap, null, null, enabled);
    }
}

export class FeaturePaintStyleConfig {

    page = {
        background: PaintStyleConfig.fill("rgba(250, 200, 0, 0.05)"),
        separator: PaintStyleConfig.stroke("rgba(0, 0, 0, 0.2)", 2)
    };

    strip = {
        border: PaintStyleConfig.stroke("rgba(100, 200, 180, 0.4)", 5)
    };

    panel = {
        border: PaintStyleConfig.stroke("#000", 7.5),
        grid: PaintStyleConfig.stroke("#880", 1)
    };

    character = {
        name: PaintStyleConfig.text("#66f", TextAlign.Center),
        box: PaintStyleConfig.stroke("#66f", 6),
        bbox: PaintStyleConfig.fill("rgba(00, 00, 250, 0.1)"),
        actor: {
            name: PaintStyleConfig.text("#f00", TextAlign.Center),
            box: PaintStyleConfig.stroke("#f00", 6),
            bbox: PaintStyleConfig.fill("rgba(250, 0,0, 0.1)")
        }
    };

    bubble = {
        border: PaintStyleConfig.fillAndStroke("#fff", "#444", 5),
        text: PaintStyleConfig.text("#000", TextAlign.Center),
        pointer: PaintStyleConfig.stroke("#000", 5, LineCap.Round),
        pointerHalo: PaintStyleConfig.stroke("rgba(255, 255, 255, 0.7)", 12, LineCap.Round)
    }
}

export class PaintConfig {
    static canvas = new CanvasConfig();
    static of = new FeaturePaintStyleConfig();
}
