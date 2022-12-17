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

const LIGHT_TEAL = "rgb(0, 150, 150)";
const LIGHTER_TEAL = "rgb(50, 200, 200)";

const PANEL_BORDER_STYLE = PaintStyleConfig.stroke("white", 1);
const PANEL_BBOX_BGR_STYLE = PaintStyleConfig.fill("rgba(250, 0, 250, 0.25)");
const PANEL_BBOX_BORDER_STYLE = PaintStyleConfig.stroke("magenta", 2);
const SELECTED_PANEL_BORDER_STYLE = PaintStyleConfig.stroke(LIGHT_TEAL, 1.5);

const SMALLER_PANEL_SHAPE_STYLE = PaintStyleConfig.stroke(LIGHT_TEAL, 1.5);
const LARGER_PANEL_SHAPE_STYLE = PaintStyleConfig.stroke(LIGHT_TEAL, 2.5);
const PANEL_START_END_SHAPE_CONNECTIONS_STYLE = PaintStyleConfig.stroke(LIGHTER_TEAL, 1);

export class PanelBoundingBoxViewer extends Div {

    mode: Mode = Mode.PaintBackground;

    canvas: Canvas;
    canvasShapeBounds: Rectangle;

    panel: Panel;
    panelPainter: PanelPainter;

    paintArea: Rectangle;

    constructor(container: DomElementContainer,
        private width: number,
        private height: number
    ) {
        super(container, "panel-bounding-box");
        this.canvas = new Canvas(this, width, height);
        this.canvas.setFont(PaintConfig.canvas.font);
        this.canvasShapeBounds = this.canvas.shape.translateToOrigin();

        this.panelPainter = new PanelPainter(this.canvas);
        this.panelPainter.animateBubbles = true;
    }

    setPanel(panel: Panel) {
        this.panel = panel;

        this.paintArea = Rectangle.fitIntoBounds(this.panel.backgroundImageShape.clone(), this.canvasShapeBounds)
            .translateToOrigin()
            .cutMarginOf(2);

        let canvasShape: Rectangle;
        if (this.mode === Mode.PaintPanel) {
            canvasShape = Rectangle.fitIntoBounds(panel.shape.clone(), this.canvasShapeBounds);
        }
        if (this.mode === Mode.PaintBackground) {
            canvasShape = Rectangle.fitIntoBounds(panel.backgroundImageShape.clone(), this.canvasShapeBounds);
        }
        this.canvas.setDimensions(canvasShape.width, canvasShape.height);
    }

    paint() {
        this.canvas.clear();

        if (this.mode === Mode.PaintPanel) {
            this.canvas.transformTo(this.panel.shape, this.paintArea);
            this.panelPainter.paintPanel(this.panel);
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

    drawBackgroundImage() {
        this.canvas.globalAlpha = 0.3;
        this.canvas.resetTransform();
        this.canvas.transformTo(this.panel.backgroundImageShape, this.paintArea);

        this.panelPainter.paintBackground(this.panel);
    }

    paintPanels() {
        this.canvas.globalAlpha = 0.3;
        this.canvas.resetTransform();

        this.panel.background.panels.forEach(panel => {
            this.canvas.transformTo(panel.backgroundImageShape, this.paintArea);
            PaintConfig.of.panel.border.enabled = false;
            this.panelPainter.paintPanel(panel);
            PaintConfig.of.panel.border.enabled = true;
        });
    }

    paintPanelBorders() {
        this.canvas.globalAlpha = 1;
        this.canvas.resetTransform();

        this.panel.background.panels.forEach(panel => this.paintPanelBorderUnscaled(panel));
    }

    paintPanelBorderUnscaled(panel: Panel) {
        this.canvas.globalAlpha = 1;
        this.canvas.resetTransform();
        if (panel.backgroundImageStartShape) {
            this.paintPanelBorder(panel, panel.backgroundImageStartShape);
        }
        if (panel.backgroundImageEndShape) {
            this.paintPanelBorder(panel, panel.backgroundImageEndShape);
        }
        if ((!panel.backgroundImageStartShape && !panel.backgroundImageEndShape)
            || this.panel === panel) {
            this.paintPanelBorder(panel, panel.backgroundImageShape);
        }
    }

    private paintPanelBorder(panel: Panel, shape: Rectangle) {
        const shapeTransform = shape.getShapeTransformTo(this.paintArea);
        const borderShape = panel.shape.clone().transformAsPartOf(shape, shapeTransform);
        this.canvas.rect(borderShape, this.panel === panel ? SELECTED_PANEL_BORDER_STYLE : PANEL_BORDER_STYLE);
    }

    paintPanelStartAndEndShapes(panel: Panel) {
        this.canvas.globalAlpha = 1;
        this.canvas.resetTransform();

        const backgroundImageStartShape = panel.backgroundImageStartShape;
        const startShapeTransform = backgroundImageStartShape.getShapeTransformTo(this.paintArea);
        const panelStartShape = panel.shape.clone().transformAsPartOf(backgroundImageStartShape, startShapeTransform);

        const backgroundImageEndShape = panel.backgroundImageEndShape;
        const endShapeTransform = backgroundImageEndShape.getShapeTransformTo(this.paintArea);
        const panelEndShape = panel.shape.clone().transformAsPartOf(backgroundImageEndShape, endShapeTransform);

        this.canvas.lineFromTo(panelStartShape.topLeft, panelEndShape.topLeft, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
        this.canvas.lineFromTo(panelStartShape.topRight, panelEndShape.topRight, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
        this.canvas.lineFromTo(panelStartShape.bottomLeft, panelEndShape.bottomLeft, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);
        this.canvas.lineFromTo(panelStartShape.bottomRight, panelEndShape.bottomRight, PANEL_START_END_SHAPE_CONNECTIONS_STYLE);

        this.canvas.rect(
            panelStartShape,
            panelStartShape.width < panelEndShape.width ? SMALLER_PANEL_SHAPE_STYLE : LARGER_PANEL_SHAPE_STYLE
        );

        this.canvas.rect(
            panelEndShape,
            panelStartShape.width > panelEndShape.width ? SMALLER_PANEL_SHAPE_STYLE : LARGER_PANEL_SHAPE_STYLE
        );
    }

    paintSelectedPanel() {
        this.canvas.globalAlpha = 1;

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
        this.canvas.globalAlpha = 0.8;
        this.canvas.resetTransform();

        const shapeTransform = this.panel.backgroundImageShape.getShapeTransformTo(this.paintArea);
        const charactersBBox = this.panel.getCharactersBackgroundBBox().transformAsPartOf(this.panel.backgroundImageShape, shapeTransform);
        paintFn(charactersBBox);

        // paint background image shape
        // this.canvas.rect(this.panel.backgroundImageShape.clone().transform(shapeTransform), PaintStyleConfig.stroke("lime", 3));
    }
}

