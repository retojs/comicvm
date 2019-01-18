import { Canvas } from "../dom/Canvas";
import { PanelPainter } from "./PanelPainter";
import { Page } from "../model/Page";
import { Point } from "../trigo/Point";
import { PaintConfig } from "./PaintConfig";

export class PagePainter {

    canvas: Canvas;

    panelPainter: PanelPainter;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.panelPainter = new PanelPainter(canvas);
    }

    paintPage(page: Page) {
        this.canvas.rect(page.shape, PaintConfig.of.page.background);
        this.canvas.lineFromTo(
            new Point(
                page.shape.x,
                page.shape.y + page.shape.height
            ),
            new Point(
                page.shape.x + page.shape.width,
                page.shape.y + page.shape.height
            ),
            PaintConfig.of.page.separator
        );

        page.strips.forEach(strip => this.canvas.rect(strip.shape, PaintConfig.of.strip.border));

        page.panels.forEach(panel => this.panelPainter.paintPanel(panel));
    }
}