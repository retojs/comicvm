import { TextAlign } from "../layout/Layout.config";
import { LineCap } from "../dom/Canvas";

export class CanvasConfig {

    width = 720;
    height = Math.round(720 * Math.sqrt(2));

    font = new FontConfig(40, "Roboto");
}

export class FontConfig {

    constructor(
        public size,
        public family,
    ) {}

    toString(): string {
        return this.size + "px " + this.family;
    }
}

export class PaintStyleConfig {

    enabled: boolean;

    strokeStyle: string;
    fillStyle: string;
    lineWidth: number;
    lineCap: LineCap;
    font: FontConfig;
    textAlign: TextAlign;

    private constructor(fillStyle?: string, strokeStyle?: string, lineWidth?: number, lineCap?: LineCap, font?: FontConfig, textAlign?: TextAlign, enabled?: boolean) {
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

    static text(color: string, textAlign?: TextAlign, font?: FontConfig, enabled?: boolean): PaintStyleConfig {
        return new PaintStyleConfig(color, null, null, null, font, textAlign, enabled);
    }

    static fillAndStroke(fillStyle: string, strokeStyle: string, lineWidth?: number, lineCap?: LineCap, enabled?: boolean) {
        return new PaintStyleConfig(fillStyle, strokeStyle, lineWidth, lineCap, null, null, enabled);
    }
}

export class FeaturePaintStyleConfig {

    page = {
        background: PaintStyleConfig.fill("white"),
        separator: PaintStyleConfig.stroke("rgba(0, 0, 0, 0.2)", 2)
    };

    strip = {
        border: PaintStyleConfig.stroke("rgba(100, 200, 180, 0.4)", 5, LineCap.Butt, false)
    };

    panel = {
        border: PaintStyleConfig.stroke("black", 7.5),
        grid: PaintStyleConfig.stroke("rgba(180, 180, 0, 0.4)", 1)
    };

    background = {
        placeholder: PaintStyleConfig.fillAndStroke('rgba(180, 240, 60, 0.2)', 'rgba(120, 180, 30, 0.8)')
    };

    character = {
        name: PaintStyleConfig.text("#66f", TextAlign.Center),
        box: PaintStyleConfig.stroke("#66f", 6),
        bbox: PaintStyleConfig.fill("rgba(00, 00, 250, 0.1)"),
        actor: {
            name: PaintStyleConfig.text("red", TextAlign.Center),
            box: PaintStyleConfig.stroke("red", 6),
            bbox: PaintStyleConfig.fill("rgba(250, 0,0, 0.1)")
        }
    };

    bubble = {
        textBox: PaintStyleConfig.fillAndStroke("white", "#444", 5),
        text: PaintStyleConfig.text("black", TextAlign.Center),
        offScreen: {
            text: PaintStyleConfig.text("black", TextAlign.Left)
        },
        pointer: PaintStyleConfig.stroke("black", 5, LineCap.Butt),
        pointerHalo: PaintStyleConfig.stroke("rgba(255, 255, 255, 0.7)", 12, LineCap.Butt)
    }
}

export class PaintConfig {
    static canvas = new CanvasConfig();
    static of = new FeaturePaintStyleConfig();
}
