import {Plot} from "./Plot";
import {PlotItem} from "./PlotItem";
import {PlotParser} from "./PlotParser";

describe("PlotParser", () => {

    let plot: Plot;
    let plotParser: PlotParser;

    beforeEach(() => {
        plot = new Plot(`
            place: Disneyland
            characters: Mickey, Goofy
        `);
        plotParser = new PlotParser(plot);
    });

    describe("method addPlotItem", () => {

        test("adds plot items with an ascending index number", () => {
            plotParser.addPlotItem(new PlotItem({}));
            expect(plotParser.plotItems.length).toBe(1);
            expect(plotParser.plotItems[0]._index).toBe(1);
            plotParser.addPlotItem(new PlotItem({}));
            expect(plotParser.plotItems.length).toBe(2);
            expect(plotParser.plotItems[1]._index).toBe(2);
        });
    });

    describe("method onCharacter", () => {
        test("handles lines starting with a character's name", () => {
            const spy = spyOn(plotParser, "onCharacter");
            plotParser.parseLine("Mickey says hi");
            expect(spy).toHaveBeenCalled();
        });

        test("creates new 'does' plot items where all mentioned characters are actors", () => {
            plotParser.parseLine("Mickey and Goofy walk down the street");

            expect(plotParser.currentPlotItem.who).toEqual(["Mickey", "Goofy"]);
            expect(plotParser.currentPlotItem.whoWith).toEqual([]);
            expect(plotParser.currentPlotItem.does).toEqual("Mickey and Goofy walk down the street");
        });

        test("creates new 'says' plot items where only the first mentioned character is the actor.", () => {
            plotParser.parseLine("Mickey to Goofy:");

            expect(plotParser.currentPlotItem.who).toEqual(["Mickey"]);
            expect(plotParser.currentPlotItem.whoWith).toEqual(["Goofy"]);
        });

        test("Adds characters from subsequent character declarations as actors to the same plot items.", () => {
            plotParser.parseLine("Mickey:");
            plotParser.parseLine("Goofy:");
            plotParser.parseLine("    What are you doing here?");

            expect(plotParser.currentPlotItem.who).toEqual(["Mickey", "Goofy"]);
            expect(plotParser.currentPlotItem.whoWith).toEqual([]);
            expect(plotParser.currentPlotItem.says).toEqual("What are you doing here?");
        });
    });

    describe("method onDescription", () => {

        test("adds a new plot items for each descriptions", () => {
            plotParser.parseLine("It's a sunny day in Disneyland.");
            expect(plotParser.currentPlotItem._description).toBe("It's a sunny day in Disneyland.");
            expect(plotParser.plotItems.length).toBe(1);

            plotParser.parseLine("It's summer and quite hot.");
            expect(plotParser.currentPlotItem._description).toBe("It's summer and quite hot.");
            expect(plotParser.plotItems.length).toBe(2);
        });
    });

    describe("method onDialog", () => {

        beforeEach(() => {
            plotParser.addPlotItem(new PlotItem({
                who: ["Mickey"]
            }));
        });

        test("creates a new plot item for each line of dialog.", () => {
            let line = "   Hey Goofy!";
            plotParser.parseLine(line);
            expect(plotParser.plotItems.length).toBe(1);
            expect(plotParser.currentPlotItem.who).toEqual(["Mickey"]);
            expect(plotParser.currentPlotItem.says).toEqual("Hey Goofy!");

            line = "   How are you?";
            plotParser.parseLine(line);
            expect(plotParser.plotItems.length).toBe(2);
            expect(plotParser.currentPlotItem.who).toEqual(["Mickey"]);
            expect(plotParser.currentPlotItem.says).toEqual("How are you?");
        });
    });

    describe("method onQualifier", () => {

        beforeEach(() => {
            plotParser.addPlotItem(new PlotItem({
                who: ["Mickey"],
                says: "Hey Goofy"
            }));
        });

        test("adds unnamed qualifiers to the current plot item and associates them with the current actor", () => {
            const line = "(surprised, wearing a hat)";
            plotParser.parseLine(line);
            expect(plotParser.currentPlotItem.how).toEqual([
                {who: "Mickey", how: "surprised"},
                {who: "Mickey", how: "wearing a hat"}
            ]);
        });

        test("adds named qualifier to the current plot item", () => {
            const line = "(Goofy: happy)";
            plotParser.parseLine(line);
            expect(plotParser.currentPlotItem.how).toEqual([
                {who: "Goofy", how: "happy"}
            ]);
        });

        test("adds named and unnamed qualifiers to the current plot item", () => {
            const line = "(surprised, Goofy: happy, wearing a hat)";
            plotParser.parseLine(line);
            expect(plotParser.currentPlotItem.how).toEqual([
                {who: "Mickey", how: "surprised"},
                {who: "Goofy", how: "happy"},
                {who: "Mickey", how: "wearing a hat"}
            ]);
        });

        test("", () => {
            const line = "  (Goofy: happy)";
            plotParser.parseLine(line);
            expect(plotParser.currentPlotItem.how).toEqual([
                {who: "Goofy", how: "happy"}
            ]);
        });
    });
});
