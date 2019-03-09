import { LayoutParser } from "./LayoutParser";
import { CharacterLayoutProperties, CharacterPositionChange, createBackgroundLayout, PanelLayoutProperties } from "./LayoutProperties";
import { Background } from "../model/Background";
import { Qualifier } from "../model/Qualifier";
import { Panel } from "../model/Panel";
import { SAMPLE_LAYOUT } from "./sample.layout";
import { Scene } from "../model/Scene";

describe("LayoutParser", () => {

    const sampleLayout = SAMPLE_LAYOUT;

    let scene: Scene;

    beforeEach(() => {
        scene = new Scene("", sampleLayout, "").parseLayout();
    });

    it("creates page, strip and panel layout models from a YAML input", () => {

        expect(scene.pages.length).toBe(2);
        expect(scene.pages[0].strips.length).toBe(2);
        expect(scene.pages[0].strips[0].panels.length).toBe(3);
        expect(scene.pages[0].strips[1].panels.length).toBe(1);

        checkPanelProps(scene.pages[0].strips[0].panels[0],
            new PanelLayoutProperties(
                2,
                "bgr-1",
                [
                    new Qualifier("Mariel", "surprised"),
                    new Qualifier("Dad", "smiling")
                ]
            )
        );
        checkPanelProps(scene.pages[0].strips[0].panels[1],
            new PanelLayoutProperties(
                1,
                "bgr-2",
                [
                    new Qualifier("all", "happy")
                ],
                [
                    new CharacterPositionChange("Mariel", 1.4, undefined, 1.5)
                ]
            )
        );
        checkPanelProps(scene.pages[0].strips[0].panels[2],
            new PanelLayoutProperties(
                0,
                "bgr-3",
                null,
                null,
                1.9,
                [1.3, 1.0]
            )
        );
        checkPanelProps(scene.pages[0].strips[1].panels[0],
            new PanelLayoutProperties(
                3,
                "bgr-3",
                null,
                [
                    new CharacterPositionChange("Silas", undefined, 1.7, 1.5)
                ]
            )
        );
        checkPanelProps(scene.pages[1].strips[0].panels[0],
            new PanelLayoutProperties(
                1,
                Background.defaultId
            )
        );
        checkPanelProps(scene.pages[1].strips[0].panels[1],
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

    it("creates a background layout model from a YAML input", () => {
        expect(scene.backgrounds).toBeDefined();
        expect(scene.backgrounds.length).toBe(5);
        expect(scene.backgrounds[0].id).toBe(Background.defaultId);
        expect(scene.backgrounds[1].id).toBe("sunset-beach");
        expect(scene.backgrounds[2].id).toBe("bgr-1");
        expect(scene.backgrounds[3].id).toBe("bgr-2");
        expect(scene.backgrounds[4].id).toBe("bgr-3");

        expect(scene.backgrounds[0].panels.length).toBe(1);
        expect(scene.backgrounds[1].panels.length).toBe(1);
        expect(scene.backgrounds[2].panels.length).toBe(1);
        expect(scene.backgrounds[3].panels.length).toBe(1);
        expect(scene.backgrounds[4].panels.length).toBe(2);

        expect(scene.backgrounds[0].layoutProperties).toEqual(
            createBackgroundLayout({
                id: Background.defaultId,
                zoom: 1,
                pan: [0.5, 1.5],
                characterProperties: [
                    new CharacterLayoutProperties(
                        "Mariel",
                        [
                            new Qualifier("Mariel", "sad"),
                            new Qualifier("Mariel", "happy")
                        ],
                        new CharacterPositionChange("Mariel", 2.3, 1.5, 1.5)
                    ),
                    new CharacterLayoutProperties(
                        "all",
                        [
                            new Qualifier("all", "fluffy")
                        ],
                        new CharacterPositionChange("all", 2.5)
                    )
                ]
            })
        );
        expect(scene.backgrounds[1].layoutProperties).toEqual(
            createBackgroundLayout({
                id: "sunset-beach",
                zoom: 1,
                pan: [1, 1],
                characterProperties: [
                    new CharacterLayoutProperties(
                        "Basil",
                        [
                            new Qualifier("Basil", "screaming")
                        ],
                        new CharacterPositionChange("Basil", 1.5, -0.5, 2)
                    )
                ]
            })
        );
    });

    it("creates a scene model from a YAML input", () => {
        expect(scene.layoutProperties).toBeDefined();
        expect(scene.layoutProperties.zoom).toBe(1);
        expect(scene.layoutProperties.pan).toEqual([1, 1]);
        expect(scene.layoutProperties.characterProperties).toEqual([
            new CharacterLayoutProperties(
                "Mariel",
                [new Qualifier("Mariel", "wet")],
                new CharacterPositionChange("Mariel", -1.2, undefined, 0.75)
            )]
        );

    });

    it("connects all panels to a scene, a page, a trip and a background", () => {
        scene.panels.forEach(panel => {
            expect(panel.index).toBeDefined();
            expect(panel.scene).toBeDefined();
            expect(panel.background).toBeDefined();
            expect(panel.page).toBeDefined();
            expect(panel.strip).toBeDefined();
        });
    });

    it("connects all pages to a scene and it's panels", () => {
        scene.pages.forEach(page => {
            expect(page.index).toBeDefined();
            expect(page.scene).toBeDefined();
            expect(page.strips).toBeDefined();
            expect(page.panels).toBeDefined();
        });
    });

    it("connects all backgrounds to a scene and it's panels", () => {
        scene.backgrounds.forEach(bgr => {
            expect(bgr.id).toBeDefined();
            expect(bgr.scene).toBeDefined();
            expect(bgr.panels).toBeDefined();
        });
    });
});