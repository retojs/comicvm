import {PlotItem, PlotItemType, STORY_TELLER} from "./PlotItem";

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
                who: [STORY_TELLER],
                says: "Once upon a time...   "
            });
            expect(plotItem.who).toEqual([STORY_TELLER]);
            expect(plotItem._told).toEqual("Once upon a time...");
            expect(plotItem._type).toBe(PlotItemType.TOLD);
        });
    });
});