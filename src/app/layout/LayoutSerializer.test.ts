import * as fs from "fs";
import { LayoutSerializer } from "./LayoutSerializer";
import { LayoutParser } from "./LayoutParser";

describe("LayoutSerializer", () => {

    const outputFile = "src/app/layout/serialized-layout.yml";

    let yamlInput = fs.readFileSync("src/app/layout/sample-layout.yml", "utf8");
    let parser: LayoutParser;
    let serializer: LayoutSerializer;

    beforeEach(() => {
        parser = new LayoutParser(yamlInput);
        serializer = new LayoutSerializer(parser);
    });

    test("serializes layout", () => {
        const str = serializer.stringify();
        fs.writeFileSync(outputFile, str, "utf8");

        const reReadOutput = fs.readFileSync(outputFile, "utf8");
        const reReadOutputParser = new LayoutParser(reReadOutput);

        expect(reReadOutputParser.layout).toEqual(parser.layout);

        // expect(yamlInput.trim()).toEqual(reReadOutput.trim());
        // sadly this is never true. You need to manually open a diff view between input and output file to verify equality.

    });
});