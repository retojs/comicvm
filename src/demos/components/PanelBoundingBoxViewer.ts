import { Div } from "../../common/dom/Div";
import { DomElementContainer } from "../../common/dom/DomElement";
import { Canvas } from "../../common/dom/Canvas";
import { Panel } from "../../app/model/Panel";
import { Rectangle } from "../../common/trigo/Rectangle";
import { PanelPainter } from "../../app/paint/PanelPainter";
import { PaintConfig } from "../../app/paint/Paint.config";
import { PaintStyleConfig } from "../../common/style/PaintStyle";

const enum Mode {
    PaintPanel,
    PaintBackground
}

const PANEL_BORDER_STYLE = PaintStyleConfig.stroke("white", 1);
const PANEL_BBOX_STYLE = PaintStyleConfig.fillAndStroke("rgba(250, 0, 250, 0.3)", "magenta", 2);

export class PanelBoundingBoxViewer extends Div {

    mode: Mode = Mode.PaintBackground;

    canvas: Canvas;
    canvasShapeBounds: Rectangle;

    panel: Panel;
    panelPainter: PanelPainter;

    constructor(container: DomElementContainer,
                private width: number,
                private height: number
    ) {
        super(container, "panel-bounding-box");
        this.canvas = new Canvas(this, width, height);
        this.canvas.setFont(PaintConfig.canvas.font);
        this.canvasShapeBounds = this.canvas.shape.translateToOrigin();
        this.panelPainter = new PanelPainter(this.canvas);
    }

    get paintArea(): Rectangle {
        return Rectangle.fitIntoBounds(this.panel.backgroundImageShape.clone(), this.canvasShapeBounds)
            .translateToOrigin()
            .cutMarginOf(2);
    }

    setPanel(panel: Panel) {
        this.panel = panel;

        if (this.mode === Mode.PaintPanel) {
            const canvasShape = Rectangle.fitIntoBounds(panel.shape.clone(), this.canvasShapeBounds);
            this.canvas.setDimensions(canvasShape.width, canvasShape.height);
        }
        if (this.mode === Mode.PaintBackground) {
            const canvasShape = Rectangle.fitIntoBounds(panel.backgroundImageShape.clone(), this.canvasShapeBounds);
            this.canvas.setDimensions(canvasShape.width, canvasShape.height);
        }
    }

    paint(panel: Panel) {
        if (!panel) {
            return;
        }
        this.setPanel(panel);

        if (this.mode === Mode.PaintPanel) {
            this.canvas.transformTo(this.panel.shape, this.paintArea);
            this.panelPainter.paintPanel(panel);
        }

        if (this.mode === Mode.PaintBackground) {
            this.drawBackgroundImage();
            this.paintPanels();
            this.paintPanelBorders();
            this.paintSelectedPanel();
            this.paintCharacterBBox();
        }
    }

    repaint() {
        this.paint(this.panel);
    }

    drawBackgroundImage() {
        this.canvas.ctx.globalAlpha = 0.3;
        this.canvas.resetTransform();

        this.canvas.drawImage(this.panel.background.image, this.paintArea);
        // this.canvas.rect(this.paintArea, PaintStyleConfig.stroke("lime", 5));
    }

    paintPanels() {
        this.canvas.ctx.globalAlpha = 0.3;
        this.canvas.resetTransform();

        this.panel.background.panels.forEach(panel => {
            this.canvas.transformTo(panel.backgroundImageShape, this.paintArea);
            PaintConfig.of.panel.border.enabled = false;
            this.panelPainter.paintPanel(panel);
            PaintConfig.of.panel.border.enabled = true;
        });
    }

    paintPanelBorders() {
        this.canvas.ctx.globalAlpha = 1;
        this.canvas.resetTransform();

        this.panel.background.panels.forEach(panel => this.paintPanelBorderUnscaled(panel));
    }

    paintPanelBorderUnscaled(panel: Panel) {
        this.canvas.ctx.globalAlpha = 1;
        this.canvas.resetTransform();
        const shapeTransform = panel.backgroundImageShape.getShapeTransformTo(this.paintArea);
        this.canvas.rect(
            panel.shape.clone().transformAsPartOf(panel.backgroundImageShape, shapeTransform),
            PANEL_BORDER_STYLE
        );
    }

    paintSelectedPanel() {
        this.canvas.ctx.globalAlpha = 1;

        this.canvas.transformTo(this.panel.backgroundImageShape, this.paintArea);
        PaintConfig.of.panel.border.enabled = false;
        this.panelPainter.paintPanel(this.panel);
        PaintConfig.of.panel.border.enabled = true;
        this.paintPanelBorderUnscaled(this.panel);
    }

    paintCharacterBBox() {
        this.canvas.ctx.globalAlpha = 0.8;
        this.canvas.resetTransform();

        const shapeTransform = this.panel.backgroundImageShape.getShapeTransformTo(this.paintArea);
        const characterBBox = this.panel.getCharactersBackgroundBBox().transformAsPartOf(this.panel.backgroundImageShape, shapeTransform);
        this.canvas.rect(characterBBox, PANEL_BBOX_STYLE);
        // this.canvas.rect(this.panel.backgroundImageShape.clone().transform(shapeTransform), PaintStyleConfig.stroke("lime", 5));
    }
}

