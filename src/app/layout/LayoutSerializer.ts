import {
    CharacterLayoutProperties,
    CharacterPositionChange,
    PanelLayoutProperties,
    PanelLayoutPropertyName,
    SceneLayoutProperties
} from "./LayoutProperties";
import { LayoutParser } from "./LayoutParser";
import { Page } from "../model/Page";
import { Strip } from "../model/Strip";
import { Panel } from "../model/Panel";
import { Background } from "../model/Background";
import { Scene } from "../model/Scene";
import { Qualifier } from "../model/Qualifier";
import * as YAML from "yaml";

export class LayoutSerializer {

    INDENT = "  ";
    NL = "\r\n";

    constructor(private layoutParser: LayoutParser) {};

    stringify(): string {

        let str = "---" + this.NL;

        str += this.stringifyPanelProperties({
            panelProperties: this.layoutParser.layout.panelProperties
        });

        str += "pages:" + this.NL
            + this.layoutParser.scene.pages.map((page, index) =>
                this.INDENT + "# page " + (index + 1) + this.NL
                + this.INDENT + "- "
                + this.stringifyPage(page, this.INDENT)
            ).join(this.NL)
            + this.NL;

        str += "backgrounds:" + this.NL
            + this.stringifyBackgrounds(this.layoutParser.scene.backgrounds, this.INDENT);

        str += "scene:" + this.NL
            + this.stringifyScene(this.layoutParser.scene, this.INDENT);

        return str;
    }

    stringifyPanelProperties(panelProperties: { panelProperties: PanelLayoutPropertyName[] }): string {
        return YAML.stringify(panelProperties);
    }

    stringifyScene(scene: Scene, indent: string) {
        return this.stringifySceneLayoutProperties(scene.layoutProperties, indent);
    }

    stringifyBackgrounds(backgrounds: Background[], indent: string) {
        let str = "";
        str += backgrounds.map(bgr => {
            let bgStr = "";
            if (bgr.layoutProperties) {
                bgStr += indent + bgr.id + ":" + this.NL;
                bgStr += this.stringifySceneLayoutProperties(bgr.layoutProperties, indent + this.INDENT);
            }
            return bgStr;
        }).join("");
        return str;
    }

    stringifySceneLayoutProperties(layoutProperties: SceneLayoutProperties, indent: string) {
        let bgStr = "";
        if (layoutProperties) {
            if (layoutProperties.zoom) {
                bgStr += indent + "zoom: " + layoutProperties.zoom + this.NL;
            }
            if (layoutProperties.pan) {
                bgStr += indent + "pan: [" + layoutProperties.pan.join(", ") + "]" + this.NL
            }
            if (layoutProperties.character) {
                bgStr += this.stringifyCharacterPropertes(layoutProperties.character, indent);
            }
        }
        return bgStr;
    }

    stringifyCharacterPropertes(layoutProperties: CharacterLayoutProperties[], indent): string {
        return layoutProperties.map(character => {
            let chStr = indent + character.who + ":" + this.NL;
            if (character.how) {
                chStr += this.INDENT + indent + "how:" + this.NL;
                chStr += character.how.map(q =>
                    this.INDENT + this.INDENT + indent + "- " + q.how
                ).join(this.NL) + this.NL;
            }
            if (character.pos) {
                chStr += this.INDENT + indent + "pos: "
                    + this.stringifyCharacterPosition(character.pos, false) + this.NL;
            }
            return chStr;
        }).join("");
    }

    stringifyPage(page: Page, indent: string): string {
        let str = "";
        let _indent = "";
        indent = indent + this.INDENT;
        if (page.stripConfig) {
            str += _indent + "stripHeights: [" + page.stripConfig.proportions.join(", ") + "]" + this.NL;
            _indent = indent;
        }
        str += _indent + "strips:" + this.NL
            + page.strips.map((strip, index) =>
                indent + this.INDENT + "# " + (index === 0 ? "upper" : "lower") + " strip" + this.NL
                + indent + this.INDENT + "- "
                + this.stringifyStrip(strip, indent + this.INDENT)
            ).join(this.NL);
        return str;
    }

    stringifyStrip(strip: Strip, indent: string): string {
        let str = "";
        let _indent = "";
        indent = indent + this.INDENT;
        if (strip.panelConfig) {
            str += _indent + "panelWidths: [" + strip.panelConfig.proportions.join(", ") + "]" + this.NL;
            _indent = indent;
        }
        str += _indent + "panels:" + this.NL
            + strip.panels.map(panel =>
                indent + this.INDENT + "- "
                + this.stringifyPanel(panel, indent + this.INDENT)
            ).join(this.NL);
        return str;
    }

    stringifyPanel(panel: Panel, indent: string): string {
        let props = this.layoutParser.layout.panelProperties.map((propName: PanelLayoutPropertyName) =>
            this.stringifyPanelLayoutProperty(propName, panel.layoutProperties)
        );
        while (props[props.length - 1] === null && props.length > 1) {
            props = props.slice(0, props.length - 1);
        }
        return props
            .map(p => "-" + (p === null ? "" : " " + p))
            .join(this.NL + indent + this.INDENT);
    }

    stringifyPanelLayoutProperty(propName: PanelLayoutPropertyName, properties: PanelLayoutProperties): string {
        switch (propName) {
            case PanelLayoutPropertyName.PlotItemCount:
                return "" + properties.plotItemCount;
            case PanelLayoutPropertyName.backgroundId:
                return properties.backgroundId === Background.defaultId ? null : properties.backgroundId;
            case PanelLayoutPropertyName.CharacterQualifier:
                if (properties.characterQualifier && properties.characterQualifier.length > 0) {
                    return this.stringifyQualifier(properties.characterQualifier);
                } else {
                    return null;
                }
            case PanelLayoutPropertyName.CharacterPositions:
                if (properties.characterPositions && properties.characterPositions.length > 0) {
                    return properties.characterPositions.map(pos =>
                        this.stringifyCharacterPosition(pos, true)
                    ).join("");
                } else {
                    return null;
                }
            case PanelLayoutPropertyName.Zoom:
                return properties.zoom ? "" + properties.zoom : null;
            case PanelLayoutPropertyName.Pan:
                if (properties.pan && properties.pan.length > 0) {
                    return "[" + properties.pan.join(", ") + "]";
                } else {
                    return null;
                }
        }
    }

    stringifyQualifier(qualifier: Qualifier[]): string {
        return qualifier.map(q => q.who + "=" + q.how).join("; ");
    }

    stringifyCharacterPosition(pos: CharacterPositionChange, printCharacterName: boolean): string {
        const positionProps = [];
        if (pos._dx !== null && pos._dx !== undefined) {
            positionProps.push("x: " + pos._dx);
        }
        if (pos._dy !== null && pos._dy !== undefined) {
            positionProps.push("y: " + pos._dy);
        }
        if (pos._scale !== null && pos._scale !== undefined) {
            positionProps.push("size: " + pos._scale);
        }
        return (printCharacterName ? pos.who + ": " : "")
            + "{" + positionProps.join(", ") + "}";
    }
}