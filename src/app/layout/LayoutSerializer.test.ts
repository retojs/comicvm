import { LayoutSerializer } from "./LayoutSerializer";
import { SAMPLE_LAYOUT } from "./sample-layout/sample.layout";
import { Scene } from "../model/Scene";
import * as fs from "fs";

const WRITE_TO_FILE = true;

xdescribe("LayoutSerializer", () => {

    const yamlInput = SAMPLE_LAYOUT;

    let scene: Scene;
    let serializer: LayoutSerializer;

    beforeEach(() => {
        scene = new Scene("", yamlInput, "").parseLayout();
        serializer = new LayoutSerializer(scene);
    });

    it("serializes layout", () => {
        const str = serializer.stringify();

        if (WRITE_TO_FILE) {
            fs.writeFileSync("src/app/layout/serialized.layout.yml", str, "utf8");
        }
        expect(removeWhitespace(str)).toEqual(removeWhitespace(yamlInput));
    });

    function removeWhitespace(str: string): string {
        return str.replace(/\s+/g, '');
    }
});