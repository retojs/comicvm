import { PanelWidthsConfig, StripHeightsConfig } from "./Layout.config";
import { Scene } from "../model/Scene";
import { Page } from "../model/Page";
import { Strip } from "../model/Strip";
import { Panel } from "../model/Panel";
import { Background } from "../model/Background";
import * as YAML from "js-yaml";
import { YamlLayout } from "./YamlLayout";
import { ALL_CHARACTERS, CameraAnimation, CharacterLayout, flatCharacters, PanelLayout, SceneOrBackgroundLayout } from "./Layout";
import YamlPageLayoutConfig = YamlLayout.PageLayoutConfig;
import YamlBackgroundLayoutConfig = YamlLayout.BackgroundLayoutConfig;
import YamlSceneLayoutConfig = YamlLayout.SceneLayoutConfig;
import YamlCharacterLayoutConfig = YamlLayout.CharacterLayoutConfig;
import YamlCharacterLayoutProperty = YamlLayout.CharacterLayoutProperty;
import YamlCharacterPositionConfig = YamlLayout.CharacterPositionConfig;
import YamlStripLayoutConfig = YamlLayout.StripLayoutConfig;
import YamlPanelLayoutProperties = YamlLayout.PanelLayoutProperties;
import YamlPanelLayoutConfig = YamlLayout.PanelLayoutConfig;
import PanelLayoutProperty = YamlLayout.PanelLayoutProperty;

export class LayoutParser {

    static parseLayout(scene: Scene): LayoutParser {
        return new LayoutParser(scene).parseLayout();
    }

    static getPageCount(scene: Scene): number {
        return new LayoutParser(scene).parseLayout().yamlSceneLayout.pages.length;
    }

    scene: Scene;

    yamlSceneLayout: YamlSceneLayoutConfig;

    private panelSceneIndex: number;

    constructor(scene: Scene) {
        this.scene = scene;
        this.yamlSceneLayout = YAML.safeLoad(scene.layoutYaml);
    }

    get characters(): string[] {
        return flatCharacters([...this.scene.characters, ALL_CHARACTERS]);
    }

    parseLayout(): LayoutParser {

        this.createScene();
        this.parseBackgroundsLayout();
        this.parsePagesLayout();
        this.connectPanelsWithBackgrounds();

        return this;
    }

    parseBackgroundsLayout() {
        if (this.yamlSceneLayout && this.yamlSceneLayout.backgrounds) {
            for (let backgroundId in this.yamlSceneLayout.backgrounds) {
                this.createBackground(backgroundId, this.yamlSceneLayout.backgrounds[backgroundId]);
            }
        }
    }

    parsePagesLayout() {
        if (this.yamlSceneLayout && this.yamlSceneLayout.pages) {
            this.panelSceneIndex = 1;

            this.yamlSceneLayout.pages.forEach((pageLayout: YamlPageLayoutConfig, index) => {
                this.createPage(pageLayout, index);
            });
        }
    }

    connectPanelsWithBackgrounds() {
        this.scene.panels.forEach(panel => {
            if (this.scene.layout.backgroundId
                && Background.defaultId !== this.scene.layout.backgroundId
                && Background.defaultId === panel.layout.backgroundId) {
                panel.layout.backgroundId = this.scene.layout.backgroundId;
            }
            let background: Background = this.scene.backgrounds.find(bgr => bgr.id === panel.layout.backgroundId);
            if (!background) {
                background = new Background(panel.layout.backgroundId);
                this.scene.addBackground(background);
            }
            background.addPanel(panel);
        });
    }

    createScene(): void {
        if (this.yamlSceneLayout) {
            this.scene.layout = SceneOrBackgroundLayout.builder()
                .backgroundId(this.yamlSceneLayout.backgroundId)
                .characters(this.yamlSceneLayout.characters)
                .zoom(this.yamlSceneLayout.zoom)
                .pan(this.yamlSceneLayout.pan)
                .characterLayouts(this.createCharacterLayouts(this.yamlSceneLayout))
                .build();
        }
    }

    createBackground(backgroundId: string, yamlBackgroundLayout: YamlBackgroundLayoutConfig): Background {
        const background = new Background(backgroundId);
        this.scene.addBackground(background);

        background.layout = SceneOrBackgroundLayout.builder()
            .backgroundId(backgroundId)
            .characters(yamlBackgroundLayout.characters)
            .zoom(yamlBackgroundLayout.zoom)
            .pan(yamlBackgroundLayout.pan)
            .characterLayouts(this.createCharacterLayouts(yamlBackgroundLayout))
            .build();

        return background;
    }

    createPage(pageLayout: YamlPageLayoutConfig, index: number): Page {
        const page = new Page(index);
        this.scene.addPage(page);

        if (pageLayout.stripHeights) {
            page.stripHeightsConfig = new StripHeightsConfig(pageLayout.stripHeights);
        }
        pageLayout.strips.forEach((stripLayout: YamlStripLayoutConfig, index) => {
            this.createStrip(stripLayout, index, page);
        });
        return page;
    }

    createStrip(stripLayout: YamlStripLayoutConfig, index, page: Page): Strip {
        const strip = new Strip(index);
        page.addStrip(strip);

        if (stripLayout.panelWidths) {
            strip.panelWidthsConfig = new PanelWidthsConfig(stripLayout.panelWidths);
        }
        stripLayout.panels.forEach((panelLayout: YamlPanelLayoutProperties, index) => {
            this.createPanel(panelLayout, index, strip);
        });
        return strip;
    }

    createPanel(panelLayout: YamlPanelLayoutProperties, index: number, strip: Strip): Panel {
        const panel = new Panel(index, this.panelSceneIndex++);
        strip.addPanel(panel);

        const panelLayoutBuilder = PanelLayout.builder();

        panelLayout.forEach((prop: PanelLayoutProperty) => {
            if (typeof prop === "number") {
                panelLayoutBuilder.plotItemCount(prop);
            } else if (typeof prop === "string") {
                panelLayoutBuilder.backgroundId(prop);
            } else if (typeof prop === "object") {
                const layoutConfig: YamlPanelLayoutConfig = prop as YamlPanelLayoutConfig;

                panelLayoutBuilder.zoom(layoutConfig.zoom);
                panelLayoutBuilder.pan(layoutConfig.pan);
                if (layoutConfig.animate) {
                    panelLayoutBuilder.animation(new CameraAnimation(layoutConfig.animate));
                }
                (this.createCharacterLayouts(layoutConfig) || [])
                    .forEach(characterLayout => panelLayoutBuilder.characterLayout(characterLayout));
            }
        });

        panel.layout = panelLayoutBuilder.build();

        return panel;
    }

    createCharacterLayouts(layout: YamlBackgroundLayoutConfig): CharacterLayout[] {
        return this.characters
            .filter(name => layout[name])
            .map(name => {
                let config: YamlCharacterLayoutConfig = {};
                const yaml: YamlCharacterLayoutProperty = layout[name];
                if (yaml["pos"] || yaml["how"]) {
                    config = yaml as YamlCharacterLayoutConfig
                } else if (yaml["x"] || yaml["y"] || yaml["size"]) {
                    config.pos = yaml as YamlCharacterPositionConfig;
                } else if (typeof yaml === "string") {
                    config.how = yaml;
                }
                return new CharacterLayout(name, config);
            });
    }
}