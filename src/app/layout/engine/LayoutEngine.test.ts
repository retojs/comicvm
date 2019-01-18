import { Plot } from "../../plot/Plot";
import { LayoutParser } from "../LayoutParser";
import { LayoutEngine } from "./LayoutEngine";
import { STORY_TELLER } from "../../plot/PlotItem";
import { SAMPLE_PLOT } from "../../plot/sample.plot";
import { SAMPLE_LAYOUT } from "../sample.layout";
import { Canvas } from "../../dom/Canvas";

describe("LayoutEngine", () => {

    const samplePlot = SAMPLE_PLOT;
    const sampleLayout = SAMPLE_LAYOUT;

    let plot: Plot;
    let layoutParser: LayoutParser;
    let layoutEngine: LayoutEngine;

    beforeEach(() => {
        plot = new Plot(samplePlot);
        layoutParser = new LayoutParser(sampleLayout);
        layoutEngine = new LayoutEngine(plot, layoutParser.scene, new Canvas(null));
    });

    it("the constructor assigns the list of characters from the plot to the scene", () => {
        expect(layoutParser.scene.characters).toEqual(plot.characters.filter(ch => ch !== STORY_TELLER));
    });

    it("method assignPlotItems distributes the plot items among the panels", () => {
        layoutEngine.scene.panels.forEach(panel => {
            expect(panel.plotItems).toBeDefined();
            expect(panel.plotItems.length).toBe(panel.layoutProperties.plotItemCount);
        });
    });

    it("method layout defines the rectangular shapes of each page, strip and panel", () => {
        expect(layoutEngine.scene).toBeDefined();
        layoutEngine.scene.pages.forEach(page => {
            expect(page.shape).toBeDefined();
            page.strips.forEach(strip => {
                expect(strip.shape).toBeDefined();
                strip.panels.forEach(panel => {
                    expect(panel.shape).toBeDefined();
                })
            })
        });
    });

    it("method layoutCharacters assigns default positions to all characters", () => {
        layoutEngine.scene.panels.forEach(panel => {
            if (panel.actors && panel.actors.length > 0) {
                panel.characters.forEach(chr => {
                    expect(chr.defaultPosition).toBeDefined();
                });
            }
        });
    });
});
