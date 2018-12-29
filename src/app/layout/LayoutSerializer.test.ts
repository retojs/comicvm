import { LayoutSerializer } from "./LayoutSerializer";
import { LayoutParser } from "./LayoutParser";
import { SAMPLE_LAYOUT } from "./sample.layout";

describe("LayoutSerializer", () => {

    let yamlInput = SAMPLE_LAYOUT;

    let parser: LayoutParser;
    let serializer: LayoutSerializer;

    beforeEach(() => {
        parser = new LayoutParser(yamlInput);
        serializer = new LayoutSerializer(parser);
    });

    it("serializes layout", () => {
        const str = serializer.stringify();

        // fs.writeFileSync("src/app/layout/serialized.layout.yml", str, "utf8");

        expect(removeWhitespace(str)).toEqual(removeWhitespace(yamlInput));
    });

    function removeWhitespace(str: string): string {
        return str.replace(/\s+/g, '');
    }
});