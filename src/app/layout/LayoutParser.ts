import {
    CharacterLayoutProperties,
    CharacterPositionChange,
    createBackgroundLayout,
    createSceneLayout,
    PanelAnimationProperties,
    PanelLayoutProperties,
    PanelLayoutPropertyName
} from "./LayoutProperties";
import { BackgroundLayout, CharacterLayout, Layout, LayoutProperty, PageLayout, PanelLayout, StripLayout } from "./Layout";
import { PanelWidthsConfig, StripHeightsConfig } from "./Layout.config";
import { Square } from "../trigo/Square";
import { Scene } from "../model/Scene";
import { Page } from "../model/Page";
import { Strip } from "../model/Strip";
import { Panel } from "../model/Panel";
import { Qualifier } from "../model/Qualifier";
import { Background } from "../model/Background";
import * as YAML from "yaml";

export class LayoutParser {

    static parseLayout(scene: Scene): LayoutParser {
        return new LayoutParser(scene.layout).parseLayout(scene);
    }

    layout: Layout;

    constructor(input: string) {
        this.layout = YAML.parse(input);
    }

    parseLayout(scene: Scene): LayoutParser {
        const sceneLayout: Layout = YAML.parse(scene.layout);

        if (sceneLayout.scene) {
            scene.layoutProperties = createSceneLayout({
                zoom: sceneLayout.scene.zoom,
                pan: sceneLayout.scene.pan,
                characters: sceneLayout.scene.characters
            });
            scene.layoutProperties.characterProperties = this.parseCharacterLayoutProperties(sceneLayout.scene);
        }

        if (sceneLayout.backgrounds) {
            Object.keys(sceneLayout.backgrounds).forEach(key => {
                const background = sceneLayout.backgrounds[key];
                this.createBackground(key, background, scene);
            });
        }

        sceneLayout.pages.forEach((pageLayout: PageLayout, index) => {
            this.createPage(pageLayout, index, scene);
        });

        // connect panels with their background
        scene.panels.forEach(panel => {
            if (!panel.layoutProperties.backgroundId) {
                panel.layoutProperties.backgroundId = Background.defaultId;
            }
            let background: Background = scene.backgrounds.find(bgr => bgr.id === panel.layoutProperties.backgroundId);
            if (!background) {
                background = new Background(panel.layoutProperties.backgroundId);
                scene.addBackground(background);
            }
            background.addPanel(panel);
        });

        return this;
    }

    createBackground(id: string, bgrLayout: BackgroundLayout, scene: Scene): Background {
        const background = new Background(id);
        scene.addBackground(background);

        background.layoutProperties = createBackgroundLayout({
            id,
            zoom: bgrLayout.zoom,
            pan: bgrLayout.pan,
            characters: bgrLayout.characters
        });
        background.layoutProperties.characterProperties = this.parseCharacterLayoutProperties(bgrLayout);
        return background;
    }

    parseCharacterLayoutProperties(layout: BackgroundLayout): CharacterLayoutProperties[] {
        const chProps: CharacterLayoutProperties[] = [];
        Object.keys(layout)
            .filter(key =>
                key !== "zoom"
                && key !== "pan"
                && key !== "characters"
            )
            .forEach(name => {
                const chLayout: CharacterLayout = layout[name];
                const prop = new CharacterLayoutProperties(name);
                chProps.push(prop);
                if (chLayout.how) {
                    if (typeof chLayout.how === "string") {
                        prop.how.push(new Qualifier(name, chLayout.how));
                    } else {
                        prop.how = chLayout.how.map(how => new Qualifier(name, how));
                    }
                }
                if (chLayout.pos) {
                    prop.pos = new CharacterPositionChange(name, chLayout.pos.x, chLayout.pos.y, chLayout.pos.size);
                }
            });
        return chProps;
    }

    createPage(pageLayout: PageLayout, index, scene): Page {
        const page = new Page(index);
        scene.addPage(page);

        if (pageLayout.stripHeights) {
            page.stripConfig = new StripHeightsConfig(pageLayout.stripHeights);
        }
        pageLayout.strips.forEach((stripLayout: StripLayout, index) => {
            this.createStrip(stripLayout, index, page);
        });
        return page;
    }

    createStrip(stripLayout: StripLayout, index, page: Page): Strip {
        const strip = new Strip(index);
        page.addStrip(strip);

        if (stripLayout.panelWidths) {
            strip.panelConfig = new PanelWidthsConfig(stripLayout.panelWidths);
        }
        stripLayout.panels.forEach((panelLayout: PanelLayout, index) => {
            this.createPanel(panelLayout, index, strip);
        });
        return strip;
    }

    createPanel(panelLayout: PanelLayout, index: number, strip: Strip): Panel {
        const panel = new Panel(index);
        strip.addPanel(panel);

        // convert array of layout properties to object of type PanelLayoutProperties
        let layoutProperties = {};
        this.layout.panelProperties.forEach((prop, index) => {
                layoutProperties[prop] = this.parseLayoutProperty(prop, panelLayout[index])
            }
        );
        panel.layoutProperties = layoutProperties as PanelLayoutProperties;

        return panel;
    }

    parseLayoutProperty(propertyName: PanelLayoutPropertyName, input: LayoutProperty): any {
        switch (propertyName) {
            case PanelLayoutPropertyName.PlotItemCount:
            case PanelLayoutPropertyName.backgroundId:
            case PanelLayoutPropertyName.Zoom:
                return input;
            case PanelLayoutPropertyName.Pan:
                return input ? input : [];
            case PanelLayoutPropertyName.CharacterQualifier:
                return this.createQualifiers(input as string);
            case PanelLayoutPropertyName.CharacterPositions:
                return this.createPositionChanges(input as any);
            case PanelLayoutPropertyName.Animation:
                return this.createAnimationProperties(input as any);
        }
    }

    createQualifiers(input: string): Qualifier[] {
        let qualifiers: Qualifier[] = [];
        if (input) {
            const qualifierStrings: string[] = input.split(";");

            if (qualifierStrings && qualifierStrings.length > 0) {
                qualifiers = qualifierStrings.map(q => {
                    const colonPos = q.indexOf("=");
                    if (colonPos > 0) {
                        const who = q.substr(0, colonPos);
                        const how = q.substr(colonPos + 1);
                        return new Qualifier(who.trim(), how.trim());
                    } else {
                        throw new Error("qualifier without character name")
                    }
                });
            }
        }
        return qualifiers;
    }

    createPositionChanges(input: { [key: string]: Square }): CharacterPositionChange[] {
        let positionChanges: CharacterPositionChange[] = [];
        if (input) {
            const characterNames = Object.keys(input);
            if (characterNames && characterNames.length > 0) {
                positionChanges = characterNames.map(name => {
                    const pos: Square = input[name];
                    return new CharacterPositionChange(name, pos.x, pos.y, pos.size);
                });
            }
        }
        return positionChanges;
    }

    createAnimationProperties(input: PanelAnimationProperties): PanelAnimationProperties {
        if (input) {
            return new PanelAnimationProperties(input.zoom, input.pan);
        }
        return null;
    }
}