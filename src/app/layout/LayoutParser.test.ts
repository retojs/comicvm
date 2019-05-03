import { LayoutParser } from "./LayoutParser";
import { Background } from "../model/Background";
import { Qualifier } from "../model/Qualifier";
import { SAMPLE_LAYOUT } from "./sample-layout/sample.layout";
import { Scene } from "../model/Scene";
import {
    ALL_CHARACTERS,
    CameraAnimation,
    CharacterLayout,
    CharacterPositionTransform,
    PanelLayout,
    SceneOrBackgroundLayout
} from "./Layout";

describe("LayoutParser", () => {

    const sampleLayout = SAMPLE_LAYOUT;

    let scene: Scene;

    beforeEach(() => {
        scene = new Scene("", sampleLayout, "Characters: Mariel, Dad, Basil, Silas").parseLayout();
    });

    it("creates page, strip and panels from a YAML input", () => {

        expect(scene.pages.length).toBe(2);

        expect(scene.pages[0].stripHeightsConfig.proportions).toEqual([0.4, 0.6]);
        expect(scene.pages[0].strips.length).toBe(2);
        expect(scene.pages[0].strips[0].panelWidthsConfig.proportions).toEqual([0.3, 0.4, 0.3]);
        expect(scene.pages[0].strips[0].panels.length).toBe(3);
        expect(scene.pages[0].strips[1].panels.length).toBe(1);

        expect(scene.pages[1].strips.length).toBe(1);
        expect(scene.pages[1].strips[0].panels.length).toBe(2);
    });

    it("assigns panel index values", () => {
        expect(scene.pages[0].strips[0].panels[0].qualifiedIndex).toBe("page-1-strip-1-panel-1");
        expect(scene.pages[0].strips[0].panels[0].sceneIndex).toBe(1);
        expect(scene.pages[0].strips[0].panels[1].qualifiedIndex).toBe("page-1-strip-1-panel-2");
        expect(scene.pages[0].strips[0].panels[1].sceneIndex).toBe(2);
        expect(scene.pages[0].strips[0].panels[2].qualifiedIndex).toBe("page-1-strip-1-panel-3");
        expect(scene.pages[0].strips[0].panels[2].sceneIndex).toBe(3);
        expect(scene.pages[0].strips[1].panels[0].qualifiedIndex).toBe("page-1-strip-2-panel-1");
        expect(scene.pages[0].strips[1].panels[0].sceneIndex).toBe(4);
        expect(scene.pages[1].strips[0].panels[0].qualifiedIndex).toBe("page-2-strip-1-panel-1");
        expect(scene.pages[1].strips[0].panels[0].sceneIndex).toBe(5);
        expect(scene.pages[1].strips[0].panels[1].qualifiedIndex).toBe("page-2-strip-1-panel-2");
        expect(scene.pages[1].strips[0].panels[1].sceneIndex).toBe(6);
    });

    it("creates a panel layout configuration for each panel", () => {
        comparePanelLayout(scene.pages[0].strips[0].panels[0].layout,
            PanelLayout.builder()
                .plotItemCount(2)
                .backgroundId("bgr-1")
                .characterQualifiers(
                    new Qualifier("Mariel", "surprised"),
                    new Qualifier("Dad", "smiling")
                )
                .build()
        );

        comparePanelLayout(scene.pages[0].strips[0].panels[1].layout,
            PanelLayout.builder()
                .plotItemCount(1)
                .backgroundId("scene-background")
                .characterQualifier(
                    new Qualifier("all", "happy")
                )
                .characterPosition(
                    new CharacterPositionTransform("Mariel", {x: 1.4, size: 1.5})
                )
                .build()
        );

        comparePanelLayout(scene.pages[0].strips[0].panels[2].layout,
            PanelLayout.builder()
                .plotItemCount(0)
                .backgroundId("bgr-2")
                .zoom(1.9)
                .pan({x: 1.3, y: 1})
                .build()
        );

        comparePanelLayout(scene.pages[0].strips[1].panels[0].layout,
            PanelLayout.builder()
                .plotItemCount(3)
                .backgroundId("bgr-2")
                .characterPosition(
                    new CharacterPositionTransform("Silas", {y: 1.7, size: 1.5})
                )
                .characterQualifier(
                    new Qualifier("Silas", "wet")
                )
                .build()
        );

        comparePanelLayout(scene.pages[1].strips[0].panels[0].layout,
            PanelLayout.builder()
                .plotItemCount(1)
                .backgroundId("scene-background")
                .animation({zoom: 1, pan: {x: -1, y: 0.5}})
                .build()
        );

        comparePanelLayout(scene.pages[1].strips[0].panels[1].layout,
            PanelLayout.builder()
                .plotItemCount(2)
                .backgroundId("sunset-beach")
                .build()
        );

        function comparePanelLayout(actual: PanelLayout, expected: PanelLayout) {
            if (anyDefined(actual.plotItemCount, expected.plotItemCount)) {
                expect(actual.plotItemCount).toBe(expected.plotItemCount);
            }
            if (anyDefined(actual.backgroundId, expected.backgroundId)) {
                expect(actual.backgroundId).toBe(expected.backgroundId);
            }
            if (anyDefined(actual.camera, expected.camera)) {
                expect(actual.camera).toEqual(expected.camera);
            }
            if (anyDefined(actual.animation, expected.animation)) {
                expect(actual.animation).toEqual(expected.animation);
            }
            if (anyDefined(actual.characterLayouts, expected.characterLayouts)) {
                expect(actual.characterLayouts).toBeDefined();
                expect(actual.characterLayouts.length).toBe(expected.characterLayouts.length);
                actual.characterLayouts.forEach(characterLayout =>
                    expect(characterLayout).toEqual(
                        expected.characterLayouts.find(layout => layout.who === characterLayout.who)
                    )
                );
            }
        }

        function anyDefined(a: any, b: any) {
            return a != null || b != null;
        }
    });

    it("creates a background layout model from a YAML input", () => {
        expect(scene.backgrounds).toBeDefined();
        expect(scene.backgrounds.length).toBe(4);

        const sceneBackground = scene.backgrounds.find(bgr => bgr.id === "scene-background");
        const bgr1 = scene.backgrounds.find(bgr => bgr.id === "bgr-1");
        const bgr2 = scene.backgrounds.find(bgr => bgr.id === "bgr-2");
        const sunsetBeach = scene.backgrounds.find(bgr => bgr.id === "sunset-beach");

        expect(sceneBackground).toBeDefined();
        expect(sceneBackground.panels.length).toBe(2);
        expect(bgr1).toBeDefined();
        expect(bgr1.panels.length).toBe(1);
        expect(bgr2).toBeDefined();
        expect(bgr2.panels.length).toBe(2);
        expect(sunsetBeach).toBeDefined();
        expect(sunsetBeach.panels.length).toBe(1);

        compareBackgroundLayout(
            sceneBackground.layout,
            SceneOrBackgroundLayout.builder()
                .backgroundId(Background.defaultId)
                .zoom(1)
                .pan({x: 0.5, y: 1.5})
                .characterLayout(CharacterLayout.builder()
                    .who(ALL_CHARACTERS)
                    .pos(new CharacterPositionTransform(ALL_CHARACTERS, {y: 1.5}))
                    .build()
                )
                .characterLayout(CharacterLayout.builder()
                    .who("Mariel")
                    .how(new Qualifier("Mariel", "sad"))
                    .how(new Qualifier("Mariel", "happy"))
                    .pos(new CharacterPositionTransform("Mariel", {x: 2.3, y: 1.5, size: 1.5}))
                    .build()
                )
                .build()
        );

        compareBackgroundLayout(
            sunsetBeach.layout,
            SceneOrBackgroundLayout.builder()
                .backgroundId("sunset-beach")
                .zoom(1)
                .pan({x: 1, y: 1})
                .characterLayout(CharacterLayout.builder()
                    .who("Basil")
                    .how(new Qualifier("Basil", "screaming"))
                    .pos(new CharacterPositionTransform("Basil", {x: 1.5, y: -0.5, size: 2}))
                    .build()
                ).build()
        );

        function compareBackgroundLayout(actual: SceneOrBackgroundLayout, expected: SceneOrBackgroundLayout) {
            expect(actual.camera).toEqual(expected.camera);
            if (expected.characterLayouts) {
                expect(actual.characterLayouts).toBeDefined();
                expect(actual.characterLayouts.length).toBe(expected.characterLayouts.length);
                actual.characterLayouts.forEach(characterLayout => {
                    expect(characterLayout).toEqual(
                        expected.characterLayouts.find(layout => layout.who === characterLayout.who)
                    );
                });
            }
        }
    });

    it("creates a scene model from a YAML input", () => {
        expect(scene.layout).toBeDefined();
        expect(scene.layout.backgroundId).toBe("scene-background");
        expect(scene.layout.camera.zoom).toBe(1);
        expect(scene.layout.camera.pan).toEqual({x: 1, y: 1});
        expect(scene.layout.characterLayouts).toBeDefined();
        expect(scene.layout.characterLayouts.length).toBe(1);
        expect(scene.layout.characterLayouts[0]).toEqual(
            CharacterLayout.builder()
                .who("Mariel")
                .how(new Qualifier("Mariel", "fluffy"))
                .pos(new CharacterPositionTransform("Mariel", {x: -1.2, size: 0.75}))
                .build()
        );
    });

    it("connects all panels to a scene, a page, a strip and a background", () => {
        scene.panels.forEach(panel => {
            expect(panel.stripIndex).toBeDefined();
            expect(panel.scene).toBeDefined();
            expect(panel.background).toBeDefined();
            expect(panel.page).toBeDefined();
            expect(panel.strip).toBeDefined();
        });
    });

    it("connects all pages to a scene and its panels", () => {
        scene.pages.forEach(page => {
            expect(page.index).toBeDefined();
            expect(page.scene).toBeDefined();
            expect(page.strips).toBeDefined();
            expect(page.panels).toBeDefined();
        });
    });

    it("connects all backgrounds to a scene and its panels", () => {
        scene.backgrounds.forEach(bgr => {
            expect(bgr.id).toBeDefined();
            expect(bgr.scene).toBeDefined();
            expect(bgr.panels).toBeDefined();
        });
    });

    it("parses animation properties", () => {
        const animProps: CameraAnimation = scene.pages[1].panels[0].layout.animation;
        expect(animProps.zoom).toBe(1);
        expect(animProps.pan).toBeDefined();
        expect(animProps.pan.x).toBe(-1);
        expect(animProps.pan.y).toBe(0.5);
    });
})
;