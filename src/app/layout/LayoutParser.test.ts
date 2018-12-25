import { LayoutParser } from "./LayoutParser";
import { BackgroundLayoutProperties, CharacterLayoutProperties, CharacterPosition, PanelLayoutProperties } from "./LayoutProperties";
import { Background } from "../model/Background";
import { Qualifier } from "../model/Qualifier";
import { Panel } from "../model/Panel";
import * as fs from "fs";

describe("LayoutParser", () => {

    let input = fs.readFileSync("src/app/layout/sample-layout.yml", "utf8");

    beforeEach(() => {});

    test("can parse a XAML file to JSON", () => {
        const layoutFromJson = require("./sample-layout.json");
        let parser = new LayoutParser(input);
        expect(parser.layout).toEqual(layoutFromJson);
    });

    test("creates page, strip and panel layout models from a YAML input", () => {

        let parser = new LayoutParser(input);

        expect(parser.scene).toBeDefined();
        expect(parser.scene.pages.length).toBe(2);
        expect(parser.scene.pages[0].strips.length).toBe(2);
        expect(parser.scene.pages[0].strips[0].panels.length).toBe(3);
        expect(parser.scene.pages[0].strips[1].panels.length).toBe(1);

        checkPanelProps(parser.scene.pages[0].strips[0].panels[0],
            new PanelLayoutProperties(
                2,
                "bgr-1",
                [
                    new Qualifier("Mariel", "surprised"),
                    new Qualifier("Dad", "smiling")
                ]
            )
        );
        checkPanelProps(parser.scene.pages[0].strips[0].panels[1],
            new PanelLayoutProperties(
                1,
                "bgr-2",
                [
                    new Qualifier("all", "happy")
                ],
                [
                    new CharacterPosition("Mariel", 1.4, undefined, 1.5)
                ]
            )
        );
        checkPanelProps(parser.scene.pages[0].strips[0].panels[2],
            new PanelLayoutProperties(
                0,
                "bgr-3",
                null,
                null,
                1.9,
                [1.3, 1.0]
            )
        );
        checkPanelProps(parser.scene.pages[0].strips[1].panels[0],
            new PanelLayoutProperties(
                3,
                "bgr-3"
            )
        );
        checkPanelProps(parser.scene.pages[1].strips[0].panels[0],
            new PanelLayoutProperties(
                1,
                Background.defaultId
            )
        );
        checkPanelProps(parser.scene.pages[1].strips[0].panels[1],
            new PanelLayoutProperties(
                2,
                "sunset-beach"
            )
        );
    });


    function checkPanelProps(panel: Panel, expectedProps: PanelLayoutProperties) {
        expect(panel.layoutProperties.plotItemCount).toBe(expectedProps.plotItemCount);
        expect(panel.layoutProperties.backgroundId).toBe(expectedProps.backgroundId);
        expect(panel.layoutProperties.characterQualifier).toEqual(expectedProps.characterQualifier);
        expect(panel.layoutProperties.characterPositions).toEqual(expectedProps.characterPositions);
        expect(panel.layoutProperties.zoom).toBe(expectedProps.zoom);
        expect(panel.layoutProperties.pan).toEqual(expectedProps.pan);
    }

    test("creates a background layout model from a YAML input", () => {

        let parser = new LayoutParser(input);
        expect(parser.scene.backgrounds).toBeDefined();
        expect(parser.scene.backgrounds.length).toBe(5);
        expect(parser.scene.backgrounds[0].id).toBe(Background.defaultId);
        expect(parser.scene.backgrounds[1].id).toBe("sunset-beach");
        expect(parser.scene.backgrounds[2].id).toBe("bgr-1");
        expect(parser.scene.backgrounds[3].id).toBe("bgr-2");
        expect(parser.scene.backgrounds[4].id).toBe("bgr-3");

        expect(parser.scene.backgrounds[0].panels.length).toBe(1);
        expect(parser.scene.backgrounds[1].panels.length).toBe(1);
        expect(parser.scene.backgrounds[2].panels.length).toBe(1);
        expect(parser.scene.backgrounds[3].panels.length).toBe(1);
        expect(parser.scene.backgrounds[4].panels.length).toBe(2);

        expect(parser.scene.backgrounds[0].layoutProperties).toEqual(
            new BackgroundLayoutProperties(
                Background.defaultId,
                1,
                [0.5, 1.5],
                [
                    new CharacterLayoutProperties(
                        "Mariel",
                        [
                            new Qualifier("Mariel", "sad"),
                            new Qualifier("Mariel", "happy")
                        ],
                        new CharacterPosition("Mariel", 2.3, 1.2, 1.5)
                    ),
                    new CharacterLayoutProperties(
                        "All",
                        [
                            new Qualifier("All", "fluffy")
                        ],
                        new CharacterPosition("All", 2.5)
                    )
                ]
            )
        );
        expect(parser.scene.backgrounds[1].layoutProperties).toEqual(
            new BackgroundLayoutProperties(
                "sunset-beach",
                1,
                [1, 1],
                [
                    new CharacterLayoutProperties(
                        "Papa",
                        [
                            new Qualifier("Papa", "old")
                        ],
                        new CharacterPosition("Papa", 5, 4, 2)
                    )
                ]));

    });

    test("creates a scene model from a YAML input", () => {
        let parser = new LayoutParser(input);
        expect(parser.scene.layoutProperties).toBeDefined();
        expect(parser.scene.layoutProperties.zoom).toBe(1);
        expect(parser.scene.layoutProperties.pan).toEqual([1, 1]);
        expect(parser.scene.layoutProperties.character).toEqual([
            new CharacterLayoutProperties(
                "Mariel",
                [new Qualifier("Mariel", "wet")],
                new CharacterPosition("Mariel", -1.2, undefined, 0.95)
            )]
        );

    });

    test("connects all panels to a scene, a page, a trip and a background", () => {
        let parser = new LayoutParser(input);
        parser.scene.panels.forEach(panel => {
            expect(panel.index).toBeDefined();
            expect(panel.scene).toBeDefined();
            expect(panel.background).toBeDefined();
            expect(panel.page).toBeDefined();
            expect(panel.strip).toBeDefined();
        });
    });

    test("connects all pages to a scene and it's panels", () => {
        let parser = new LayoutParser(input);
        parser.scene.pages.forEach(page => {
            expect(page.index).toBeDefined();
            expect(page.scene).toBeDefined();
            expect(page.strips).toBeDefined();
            expect(page.panels).toBeDefined();
        });
    });

    test("connects all backgrounds to a scene and it's panels", () => {
        let parser = new LayoutParser(input);
        parser.scene.backgrounds.forEach(bgr => {
            expect(bgr.id).toBeDefined();
            expect(bgr.scene).toBeDefined();
            expect(bgr.panels).toBeDefined();
        });
    });
});