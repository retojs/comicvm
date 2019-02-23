import { BubbleLayoutEngine } from "./BubbleLayoutEngine";
import { Canvas } from "../../dom/Canvas";
import { LayoutEngine } from "./LayoutEngine";
import { SAMPLE_PLOT } from "../../plot/sample.plot";
import { SAMPLE_LAYOUT } from "../sample.layout";
import { Bubble } from "../../model/Bubble";
import { Scene } from "../../model/Scene";

// Note: This test needs to be run with the karma test runner since it involves canvas.

describe("BubbleLayoutEngine", () => {

    const samplePlot = SAMPLE_PLOT;
    const sampleLayout = SAMPLE_LAYOUT;

    let scene: Scene;
    let canvas: Canvas;
    let layoutEngine: LayoutEngine;
    let bubbleLayoutEngine: BubbleLayoutEngine;

    beforeEach(() => {
        scene = new Scene("", sampleLayout, samplePlot).parseLayout();
        canvas = new Canvas(null, 600, 1800);
        layoutEngine = new LayoutEngine(scene);
        bubbleLayoutEngine = new BubbleLayoutEngine();
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
            const bubbleLines: Bubble[][] = bubbleLayoutEngine.layoutBubblesIntoLines(panel);
            expect(bubbleLines).toBeDefined();
        })
    })
});