import { TextLayoutEngine } from "./TextLayoutEngine";
import { Canvas } from "../../dom/Canvas";
import { Plot } from "../../plot/Plot";
import { LayoutParser } from "../LayoutParser";
import { LayoutEngine } from "./LayoutEngine";
import { SAMPLE_PLOT } from "../../plot/sample.plot";
import { SAMPLE_LAYOUT } from "../sample.layout";
import { Bubble } from "../../model/Bubble";

// Note: This test needs to be run with the karma test runner since it involves canvas.

describe("TextLayoutEngine", () => {

    const samplePlot = SAMPLE_PLOT;
    const sampleLayout = SAMPLE_LAYOUT;

    let plot: Plot;
    let layoutParser: LayoutParser;
    let layoutEngine: LayoutEngine;
    let canvas: Canvas;
    let textLayoutEngine: TextLayoutEngine;

    beforeEach(() => {

        plot = new Plot(samplePlot);
        layoutParser = new LayoutParser(sampleLayout);
        layoutEngine = new LayoutEngine(plot, layoutParser.scene, new Canvas(null, 800, 1200));

        canvas = new Canvas(null, 600, 1800);
        textLayoutEngine = new TextLayoutEngine(canvas);
    });

    it("method layoutPanelBubbles defines the with and heights of all bubbles in a panel", () => {
        layoutEngine.scene.panels.forEach(panel => {
            panel.bubbles.forEach(bubble => {
                expect(bubble.shape).toBeDefined();
                expect(bubble.shape.x).toBeGreaterThan(0);
                expect(bubble.shape.x).toBeGreaterThan(0);
                expect(bubble.shape.width).toBeGreaterThan(0);
                expect(bubble.shape.height).toBeGreaterThan(0);
            });
        });
    });

    it("method layoutBubblesIntoLines puts all bubbles of a panel into lines of bubbles", () => {
        layoutEngine.scene.panels.forEach(panel => {
            const bubbleLines: Bubble[][] = textLayoutEngine.layoutBubblesIntoLines(panel);
            expect(bubbleLines).toBeDefined();
        })
    })
});