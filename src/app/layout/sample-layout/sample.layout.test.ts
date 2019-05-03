import * as YAML from "js-yaml";
import { YamlLayout } from "../YamlLayout";
import { SAMPLE_LAYOUT } from "./sample.layout";
// @ts-ignore
import * as sampleLayoutJson from "./sample.layout.json";

describe("sample layout", () => {

    let parsedLayout: YamlLayout.SceneLayoutConfig;

    // console.log("sample layout as JSON:", JSON.stringify(YAML.safeLoad(SAMPLE_LAYOUT), null, 2));
    // console.log("sample.layout.json:", JSON.stringify(sampleLayoutJson, null, 2));

    beforeEach(() => {
        parsedLayout = YAML.safeLoad(SAMPLE_LAYOUT);
    });

    it("the parsed YAML layout equals sample.layout.json", () => {
        expect(parsedLayout).toEqual(sampleLayoutJson);
    });

    it("The sample layout contains 2 pages with 2 and 1 strip resp., the properties backgrounds, zoom, pan and Mariel", () => {
        expect(parsedLayout.pages).toBeDefined();
        expect(parsedLayout.pages.length).toBe(2);
        expect(parsedLayout.pages[0].strips).toBeDefined();
        expect(parsedLayout.pages[0].strips.length).toBe(2);
        expect(parsedLayout.pages[1].strips).toBeDefined();
        expect(parsedLayout.pages[1].strips.length).toBe(1);
        expect(parsedLayout.backgrounds).toBeDefined();
        expect(parsedLayout.backgroundId).toBeDefined();
        expect(parsedLayout.zoom).toBeDefined();
        expect(parsedLayout.pan).toBeDefined();
        expect(parsedLayout.Mariel).toBeDefined();
    });
});