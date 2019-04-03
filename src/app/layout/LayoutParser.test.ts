import { LayoutParser } from "./LayoutParser";
import {
    CharacterLayoutProperties,
    CharacterPositionTransform,
    createBackgroundLayout,
    PanelAnimationProperties,
    PanelLayoutProperties
} from "./LayoutProperties";
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
        expect(scene.pages[1].strips.length).toBe(1);
        expect(scene.pages[1].strips[0].panels.length).toBe(2);

        expect(scene.pages[0].strips[0].panels[0].qualifiedIndex).toBe("page-0-strip-0-panel-0");
        expect(scene.pages[0].strips[0].panels[0].sceneIndex).toBe(0);
        expect(scene.pages[0].strips[0].panels[1].qualifiedIndex).toBe("page-0-strip-0-panel-1");
        expect(scene.pages[0].strips[0].panels[1].sceneIndex).toBe(1);
        expect(scene.pages[0].strips[0].panels[2].qualifiedIndex).toBe("page-0-strip-0-panel-2");
        expect(scene.pages[0].strips[0].panels[2].sceneIndex).toBe(2);
        expect(scene.pages[0].strips[1].panels[0].qualifiedIndex).toBe("page-0-strip-1-panel-0");
        expect(scene.pages[0].strips[1].panels[0].sceneIndex).toBe(3);
        expect(scene.pages[1].strips[0].panels[0].qualifiedIndex).toBe("page-1-strip-0-panel-0");
        expect(scene.pages[1].strips[0].panels[0].sceneIndex).toBe(4);
        expect(scene.pages[1].strips[0].panels[1].qualifiedIndex).toBe("page-1-strip-0-panel-1");
        expect(scene.pages[1].strips[0].panels[1].sceneIndex).toBe(5);

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
                    new CharacterPositionTransform("Mariel", 1.4, undefined, 1.5)
                ]
            )
        );
        checkPanelProps(scene.pages[0].strips[0].panels[2],
            new PanelLayoutProperties(
                0,
                "bgr-3",
                [],
                [],
                1.9,
                [1.3, 1.0]
            )
        );
        checkPanelProps(scene.pages[0].strips[1].panels[0],
            new PanelLayoutProperties(
                3,
                "bgr-3",
                [],
                [
                    new CharacterPositionTransform("Silas", undefined, 1.7, 1.5)
                ]
            )
        );
        checkPanelProps(scene.pages[1].strips[0].panels[0],
            new PanelLayoutProperties(
                1,
                Background.defaultId,
                [],
                [],
                null,
                [],
                {zoom: 1, pan: [-1, 0.5]}
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
        if (!bothNullOrUndefined(panel.layoutProperties.plotItemCount, expectedProps.plotItemCount)) {
            expect(panel.layoutProperties.plotItemCount).toBe(expectedProps.plotItemCount);
        }
        if (!bothNullOrUndefined(panel.layoutProperties.backgroundId, expectedProps.backgroundId)) {
            expect(panel.layoutProperties.backgroundId).toBe(expectedProps.backgroundId);
        }
        if (!bothNullOrUndefined(panel.layoutProperties.characterQualifier, expectedProps.characterQualifier)) {
            expect(panel.layoutProperties.characterQualifier).toEqual(expectedProps.characterQualifier);
        }
        if (!bothNullOrUndefined(panel.layoutProperties.characterPositions, expectedProps.characterPositions)) {
            expect(panel.layoutProperties.characterPositions).toEqual(expectedProps.characterPositions);
        }
        if (!bothNullOrUndefined(panel.layoutProperties.zoom, expectedProps.zoom)) {
            expect(panel.layoutProperties.zoom).toBe(expectedProps.zoom);
        }
        if (!bothNullOrUndefined(panel.layoutProperties.pan, expectedProps.pan)) {
            expect(panel.layoutProperties.pan).toEqual(expectedProps.pan);
        }
        if (!bothNullOrUndefined(panel.layoutProperties.animation, expectedProps.animation)) {
            expect(panel.layoutProperties.animation).toEqual(expectedProps.animation);
        }
    }

    function bothNullOrUndefined(a: any, b: any) {
        return a == null && b == null;
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
                        new CharacterPositionTransform("Mariel", 2.3, 1.5, 1.5)
                    ),
                    new CharacterLayoutProperties(
                        "all",
                        [
                            new Qualifier("all", "fluffy")
                        ],
                        new CharacterPositionTransform("all", 2.5)
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
                        new CharacterPositionTransform("Basil", 1.5, -0.5, 2)
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
                new CharacterPositionTransform("Mariel", -1.2, undefined, 0.75)
            )]
        );

    });

    it("connects all panels to a scene, a page, a trip and a background", () => {
        scene.panels.forEach(panel => {
            expect(panel.stripIndex).toBeDefined();
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

    it("parses animation properties", () => {
        const animProps: PanelAnimationProperties = scene.pages[1].panels[0].layoutProperties.animation;
        expect(animProps.zoom).toBe(1);
        expect(animProps.pan).toBeDefined();
        expect(animProps.pan.length).toBe(2);
        expect(animProps.pan[0]).toBe(-1);
        expect(animProps.pan[1]).toBe(0.5);

    });
});