import { Canvas } from "./Canvas";
import { LayoutConfig } from "../layout/LayoutConfig";
import { PanelPainter } from "./PanelPainter";
import { Page } from "../model/Page";

export class PagePainter {

    canvas: Canvas;

    panelPainter: PanelPainter;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.panelPainter = new PanelPainter(canvas);
    }

    paintPage(page: Page) {
        this.canvas.rect(page.shape, LayoutConfig.feature.page.background);
        this.canvas.line(
            {
                x: page.shape.x,
                y: page.shape.y + page.shape.height
            },
            {
                x: page.shape.x + page.shape.width,
                y: page.shape.y + page.shape.height
            },
            LayoutConfig.feature.page.separator
        );

        page.strips.forEach(strip => this.canvas.rect(strip.shape, LayoutConfig.feature.strip.border));

        page.panels.forEach(panel => this.panelPainter.paintPanel(panel));
    }
}