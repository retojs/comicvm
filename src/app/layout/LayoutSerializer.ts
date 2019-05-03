import { Scene } from "../model/Scene";

export class LayoutSerializer {

    INDENT = "  ";
    NL = "\r\n";

    constructor(private scene: Scene) {};

    stringify(): string {

        let str = "---" + this.NL;

        // str += "pages:" + this.NL
        //     + this.scene.pages.map((page, index) =>
        //         this.INDENT + "# page " + (index + 1) + this.NL
        //         + this.INDENT + "- "
        //         + this.stringifyPage(page, this.INDENT)
        //     ).join(this.NL)
        //     + this.NL;
        //
        // str += "backgrounds:" + this.NL
        //     + this.stringifyBackgrounds(this.scene.backgrounds, this.INDENT);
        //
        // str += "scene:" + this.NL
        //     + this.stringifyScene(this.scene, this.INDENT);

        return str;
    }

    // stringifyPanelProperties(panelProperties: { panelProperties: PanelLayoutPropertyName[] }): string {
    //     return YAML.safeDump(panelProperties);
    // }
    //
    // stringifyScene(scene: Scene, indent: string) {
    //     return this.stringifySceneLayoutProperties(scene.layout, indent);
    // }
    //
    // stringifyBackgrounds(backgrounds: Background[], indent: string) {
    //     let str = "";
    //     str += backgrounds.map(bgr => {
    //         let bgStr = "";
    //         if (bgr.layout) {
    //             bgStr += indent + bgr.id + ":" + this.NL;
    //             bgStr += this.stringifySceneLayoutProperties(bgr.layout, indent + this.INDENT);
    //         }
    //         return bgStr;
    //     }).join("");
    //     return str;
    // }
    //
    // stringifySceneLayoutProperties(layoutProperties: SceneLayoutConfig, indent: string) {
    //     let bgStr = "";
    //     if (layoutProperties) {
    //         if (layoutProperties.zoom) {
    //             bgStr += indent + "zoom: " + layoutProperties.zoom + this.NL;
    //         }
    //         if (layoutProperties.pan) {
    //             bgStr += indent + "pan: [" + layoutProperties.pan.join(", ") + "]" + this.NL
    //         }
    //         if (layoutProperties.characterLayouts) {
    //             bgStr += this.stringifyCharacterPropertes(layoutProperties.characterLayouts, indent);
    //         }
    //     }
    //     return bgStr;
    // }
    //
    // stringifyCharacterPropertes(layoutProperties: CharacterLayoutConfig[], indent): string {
    //     return layoutProperties.map(character => {
    //         let chStr = indent + character.who + ":" + this.NL;
    //         if (character.how) {
    //             chStr += this.INDENT + indent + "how:" + this.NL;
    //             chStr += character.how.map(q =>
    //                 this.INDENT + this.INDENT + indent + "- " + q.how
    //             ).join(this.NL) + this.NL;
    //         }
    //         if (character.pos) {
    //             chStr += this.INDENT + indent + "pos: "
    //                 + this.stringifyCharacterPosition(character.pos, false) + this.NL;
    //         }
    //         return chStr;
    //     }).join("");
    // }
    //
    // stringifyPage(page: Page, indent: string): string {
    //     let str = "";
    //     let _indent = "";
    //     indent = indent + this.INDENT;
    //     if (page.stripHeightsConfig) {
    //         str += _indent + "stripHeights: [" + page.stripHeightsConfig.proportions.join(", ") + "]" + this.NL;
    //         _indent = indent;
    //     }
    //     str += _indent + "strips:" + this.NL
    //         + page.strips.map((strip, index) =>
    //             indent + this.INDENT + "# " + (index === 0 ? "upper" : "lower") + " strip" + this.NL
    //             + indent + this.INDENT + "- "
    //             + this.stringifyStrip(strip, indent + this.INDENT)
    //         ).join(this.NL);
    //     return str;
    // }
    //
    // stringifyStrip(strip: Strip, indent: string): string {
    //     let str = "";
    //     let _indent = "";
    //     indent = indent + this.INDENT;
    //     if (strip.panelWidthsConfig) {
    //         str += _indent + "panelWidths: [" + strip.panelWidthsConfig.proportions.join(", ") + "]" + this.NL;
    //         _indent = indent;
    //     }
    //     str += _indent + "panels:" + this.NL
    //         + strip.panels.map(panel =>
    //             indent + this.INDENT + "- "
    //             + this.stringifyPanel(panel, indent + this.INDENT)
    //         ).join(this.NL);
    //     return str;
    // }
    //
    // stringifyPanel(panel: Panel, indent: string): string {
    //     // let props = this.scene.layoutParser.yamlScenelayout.camera.panelProperties.map((propName: PanelLayoutPropertyName) =>
    //     //     this.stringifyPanelLayoutProperty(propName, panel.layout)
    //     // );
    //     // while (props[props.length - 1] == null && props.length > 1) {
    //     //     props = props.slice(0, props.length - 1);
    //     // }
    //     // return props
    //     //     .map(p => "-" + (p == null ? "" : " " + p))
    //     //     .join(this.NL + indent + this.INDENT);
    //     return "TODO: stringifyPanel";
    // }
    //
    // stringifyPanelLayoutProperty(propName: PanelLayoutPropertyName, properties: PanelLayoutConfig): string {
    //     switch (propName) {
    //         case PanelLayoutPropertyName.PlotItemCount:
    //             return "" + properties.plotItemCount;
    //         case PanelLayoutPropertyName.backgroundId:
    //             return properties.backgroundId === Background.defaultId ? null : properties.backgroundId;
    //         case PanelLayoutPropertyName.CharacterQualifier:
    //             if (properties.characterQualifier && properties.characterQualifier.length > 0) {
    //                 return this.stringifyQualifier(properties.characterQualifier);
    //             }
    //             break;
    //         case PanelLayoutPropertyName.characterLayouts:
    //             if (properties.characterLayouts && properties.characterLayouts.length > 0) {
    //                 return properties.characterLayouts.map(pos =>
    //                     this.stringifyCharacterPosition(pos, true)
    //                 ).join("");
    //             }
    //             break;
    //         case PanelLayoutPropertyName.Zoom:
    //             return properties.zoom ? "" + properties.zoom : null;
    //         case PanelLayoutPropertyName.Pan:
    //             if (properties.pan && properties.pan.length > 0) {
    //                 return "[" + properties.pan.join(", ") + "]";
    //             }
    //             break;
    //         case PanelLayoutPropertyName.Animation:
    //             if (properties.animation) {
    //                 return properties.animation.toString();
    //             }
    //             break;
    //     }
    // }
    //
    // stringifyQualifier(qualifier: Qualifier[]): string {
    //     return qualifier.map(q => q.who + "=" + q.how).join("; ");
    // }
    //
    // stringifyCharacterPosition(pos: CharacterPositionTransform, printCharacterName: boolean): string {
    //     const positionProps = [];
    //     if (pos._dx !== null && pos._dx !== undefined) {
    //         positionProps.push("x: " + pos._dx);
    //     }
    //     if (pos._dy !== null && pos._dy !== undefined) {
    //         positionProps.push("y: " + pos._dy);
    //     }
    //     if (pos._scale !== null && pos._scale !== undefined) {
    //         positionProps.push("size: " + pos._scale);
    //     }
    //     return (printCharacterName ? pos.who + ": " : "")
    //         + "{" + positionProps.join(", ") + "}";
    // }
}