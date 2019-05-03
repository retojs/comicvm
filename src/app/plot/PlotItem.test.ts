import {PlotItem, PlotItemType, NARRATOR} from "./PlotItem";

describe("PlotItem", () => {

    let plotItem: PlotItem;

    beforeEach(() => {
        plotItem = new PlotItem({
            who: ["Hero"],
            does: "sighs",
            how: [
                {who: "Hero", how: "desperate"}
            ],
        });
    });

    describe("PlotItem.normalize()", () => {

        it("removes duplicates from who and whoWith properties", () => {
            plotItem = new PlotItem({
                who: ["Hero", "Hero"],
                whoWith: ["Sidekick", "Sidekick", "Hero"]
            });
            expect(plotItem.who).toEqual(["Hero"]);
            expect(plotItem.whoWith).toEqual(["Sidekick"]);
        });

        it("assigns stuff the story teller says to the _told property", () => {
            plotItem = new PlotItem({
                who: [NARRATOR],
                says: "Once upon a time...   "
            });
            expect(plotItem.who).toEqual([NARRATOR]);
            expect(plotItem._action).toEqual("Once upon a time...");
            expect(plotItem.says).toEqual("Once upon a time...");
            expect(plotItem._type).toBe(PlotItemType.SAYS);
        });
    });
});