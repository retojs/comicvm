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
const PANEL_BBOX_BGR_STYLE = PaintStyleConfig.fill("rgba(250, 0, 250, 0.25)");
const PANEL_BBOX_BORDER_STYLE = PaintStyleConfig.stroke("magenta", 2);

const PANEL_START_SHAPE_STYLE = PaintStyleConfig.stroke("white", 2.5);
const PANEL_END_SHAPE_STYLE = PaintStyleConfig.stroke("white", 2.5);
const PANEL_START_END_SHAPE_CONNECTIONS_STYLE = PaintStyleConfig.stroke("white", 1);

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
            this.paintCharacterBBoxBackground();
            this.paintSelectedPanel();
            this.paintCharacterBBoxBorder();
            this.paintPanelStartAndEndShapes(this.panel);
        }
    }

    repaint() {
        this.paint(this.panel);
    }

    drawBackgroundImage() {
        this.canvas.ctx.globalAlpha = 0.3;
        this.canvas.resetTransform();
        this.canvas.transformTo(this.panel.backgroundImageShape, this.paintArea);

        const t = this.panel.animationTime;
        this.panel.animationTime = 0.5;
        this.panelPainter.paintBackground(this.panel);
        this.panel.animationTime = t;
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

    paintPanelStartAndEndShapes(panel: Panel) {
        this.canvas.ctx.globalAlpha = 1;
        this.canvas.resetTransform();

        const backgroundImageStartShape = panel.backgroundImageStartShape;
        const startShapeTransform = backgroundImageStartShape.getShapeTransformTo(this.paintArea);
        const panelStartShape = panel.shape.clone().transformAsPartOf(backgroundImageStartShape, startShapeTransform);
        this.canvas.rect(
            panelStartShape,
            PANEL_START_SHAPE_STYLE
        );

        const backgroundImageEndShape = panel.backgroundImageEndShape;
        const endShapeTransform = backgroundImageEndShape.getShapeTransformTo(this.paintArea);
        const panelEndShape = panel.shape.clone().transformAsPartOf(backgroundImageEndShape, endShapeTransform);
        this.canvas.rect(
            panelEndShape,
            PANEL_END_SHAPE_STYLE
        );

        this.canvas.lineFromTo(panelStartShape.topLeft, panelEndShape.topLeft, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
        this.canvas.lineFromTo(panelStartShape.topRight, panelEndShape.topRight, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
        this.canvas.lineFromTo(panelStartShape.bottomLeft, panelEndShape.bottomLeft, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
        this.canvas.lineFromTo(panelStartShape.bottomRight, panelEndShape.bottomRight, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
    }

    paintSelectedPanel() {
        this.canvas.ctx.globalAlpha = 1;

        this.canvas.transformTo(this.panel.backgroundImageShape, this.paintArea);
        PaintConfig.of.panel.border.enabled = false;
        this.panelPainter.paintPanel(this.panel);
        PaintConfig.of.panel.border.enabled = true;
        this.paintPanelBorderUnscaled(this.panel);
    }

    paintCharacterBBoxBackground() {
        this.paintCharacterBBox(charactersBBox => this.canvas.rect(charactersBBox, PANEL_BBOX_BGR_STYLE))
    }

    paintCharacterBBoxBorder() {
        this.paintCharacterBBox(charactersBBox => this.canvas.rect(charactersBBox, PANEL_BBOX_BORDER_STYLE))
    }

    paintCharacterBBox(paintFn: (charactersBBox: Rectangle) => void) {
        if (paintFn == null || typeof paintFn !== 'function') {
            return;
        }
        this.canvas.ctx.globalAlpha = 0.8;
        this.canvas.resetTransform();

        const shapeTransform = this.panel.backgroundImageShape.getShapeTransformTo(this.paintArea);
        const charactersBBox = this.panel.getCharactersBackgroundBBox().transformAsPartOf(this.panel.backgroundImageShape, shapeTransform);
        paintFn(charactersBBox);

        // paint background image shape
        // this.canvas.rect(this.panel.backgroundImageShape.clone().transform(shapeTransform), PaintStyleConfig.stroke("lime", 3));
    }
}

