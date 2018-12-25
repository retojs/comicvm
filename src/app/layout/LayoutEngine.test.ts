import * as fs from "fs";
import { LayoutEngine } from "./LayoutEngine";
import { LayoutParser } from "./LayoutParser";
import { Plot } from "../plot/Plot";

describe("LayoutEngine", () => {

    const sampleLayout = fs.readFileSync("src/app/layout/sample-layout.yml", "utf8");

    let plot: Plot;
    let layoutParser: LayoutParser;
    let layoutEngine: LayoutEngine;

    beforeEach(() => {
        plot = new Plot(samplePlot);
        layoutParser = new LayoutParser(sampleLayout);
        layoutEngine = new LayoutEngine(layoutParser, plot);
    });

    test("the constructor assigns the list of characters from the plot to the scene", () => {
        expect(layoutParser.scene.characters).toEqual(plot.characters);
    });

    test("method assignPlotItems distributes the plot items among the panels", () => {
        layoutEngine.scene.panels.forEach(panel => {
            expect(panel.plotItems).toBeDefined();
            expect(panel.plotItems.length).toBe(panel.layoutProperties.plotItemCount);
        });
    });

    test("method layout defines the rectangular shapes of each page, strip and panel", () => {
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

    const samplePlot = `
    
Title: Kick Off

Characters: Mariel, Basil, Silas

Place: main-beach
_____
Plot:

Mariel neben Silas:
(Silas:waiting)
    Bequem so?

Basil:
    Yup, sitzt perfekt.

(waiting)
    Also dann...
    Achtung!
    Fertig?
Basil und Silas:
(jump, Silas:jump)
    Los!

Mariel, Basil und Silas:
(Basil:swim, Silas:swim)
    Quiek!

Basil und Silas springen mit Mariel ins Wasser.
Silas schwimmt voraus.
Mariel reitet auf Basil.
`
});