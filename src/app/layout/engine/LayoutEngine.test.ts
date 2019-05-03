import { LayoutEngine } from "./LayoutEngine";
import { NARRATOR } from "../../plot/PlotItem";
import { SAMPLE_PLOT } from "../../plot/sample.plot";
import { SAMPLE_LAYOUT } from "../sample-layout/sample.layout";
import { Scene } from "../../model/Scene";

describe("LayoutEngine", () => {

    const samplePlot = SAMPLE_PLOT;
    const sampleLayout = SAMPLE_LAYOUT;

    let scene: Scene;
    let layoutEngine: LayoutEngine;

    beforeEach(() => {
        scene = new Scene("", sampleLayout, samplePlot).parseLayout();
        layoutEngine = new LayoutEngine(scene);
    });

    it("the constructor assigns the list of characters from the plot to the scene", () => {
        expect(scene.characters).toEqual(scene.plot.characters.filter(ch => ch !== NARRATOR));
    });

    it("method assignPlotItems distributes the plot items among the panels", () => {
        scene.panels.forEach(panel => {
            expect(panel.plotItems).toBeDefined();
            expect(panel.plotItems.length).toBe(panel.layout.plotItemCount);
        });
    });

    it("method layout defines the rectangular shapes of each page, strip and panel", () => {
        expect(scene).toBeDefined();
        scene.pages.forEach(page => {
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
        scene.panels.forEach(panel => {
            if (panel.actors && panel.actors.length > 0) {
                panel.characters.forEach(chr => {
                    expect(chr.defaultPosition).toBeDefined();
                });
            }
        });
    });
});
