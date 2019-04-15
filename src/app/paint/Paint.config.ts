import { TextAlign } from "../../common/style/TextAlign";
import { Font } from "../../common/style/Font";
import { LineCap, PaintStyleConfig } from "../../common/style/PaintStyle";

export class CanvasConfig {

    width = 720;
    height = Math.round(720 * Math.sqrt(2));

    font = new Font(36, "Roboto");
}

export const thinLineWidth = 3;
export const normalLineWidth = 6;
export const thickLineWidth = 12;

export class FeaturePaintStyleConfig {

    page = {
        background: PaintStyleConfig.fill("white"),
        separator: PaintStyleConfig.stroke("rgba(0, 0, 0, 0.2)", thinLineWidth)
    };

    strip = {
        border: PaintStyleConfig.stroke("rgba(100, 200, 180, 0.4)", normalLineWidth, LineCap.Butt, false)
    };

    panel = {
        border: PaintStyleConfig.stroke("black", normalLineWidth),
        grid: PaintStyleConfig.stroke("rgba(180, 180, 0, 0.4)", 1)
    };

    background = {
        placeholder: PaintStyleConfig.fillAndStroke('rgba(180, 240, 60, 0.2)', 'rgba(120, 180, 30, 0.8)')
    };

    character = {
        name: PaintStyleConfig.text("#66f", TextAlign.Center),
        box: PaintStyleConfig.stroke("#66f", normalLineWidth),
        bbox: PaintStyleConfig.fill("rgba(00, 00, 250, 0.1)"),
        actor: {
            name: PaintStyleConfig.text("red", TextAlign.Center),
            box: PaintStyleConfig.stroke("red", normalLineWidth),
            bbox: PaintStyleConfig.fill("rgba(250, 0,0, 0.1)")
        }
    };

    bubble = {
        textBox: PaintStyleConfig.fillAndStroke("white", "teal", thinLineWidth),
        text: PaintStyleConfig.text("black", TextAlign.Center),
        offScreen: {
            text: PaintStyleConfig.text("black", TextAlign.Left)
        },
        pointer: PaintStyleConfig.stroke("teal", thinLineWidth, LineCap.Butt),
        pointerHalo: PaintStyleConfig.stroke("rgba(255, 255, 255, 0.7)", thickLineWidth, LineCap.Butt)
    }
}

export class PaintConfig {

    static canvas = new CanvasConfig();
    static of = new FeaturePaintStyleConfig();
}


export function setPaintConfigFinal() {
    PaintConfig.of.character.actor.name.enabled = false;
    PaintConfig.of.character.actor.box.enabled = false;
    PaintConfig.of.character.actor.bbox.enabled = false;
    PaintConfig.of.character.name.enabled = false;
    PaintConfig.of.character.box.enabled = false;
    PaintConfig.of.character.bbox.enabled = false;

    PaintConfig.of.panel.grid.enabled = false;
}

export function setPaintConfigEdit() {
    PaintConfig.of.character.actor.name.enabled = true;
    PaintConfig.of.character.actor.box.enabled = true;
    PaintConfig.of.character.actor.bbox.enabled = true;
    PaintConfig.of.character.name.enabled = true;
    PaintConfig.of.character.box.enabled = true;
    PaintConfig.of.character.bbox.enabled = true;

    PaintConfig.of.panel.grid.enabled = true;
}