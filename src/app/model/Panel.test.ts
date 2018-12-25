import { PlotItem } from "../plot/PlotItem";
import { Panel } from "./Panel";
import { Character } from "./Character";
import { Qualifier } from "./Qualifier";
import { Scene } from "./Scene";

describe("Panel", () => {

    let panel: Panel;
    let plotItems: PlotItem[];

    beforeEach(() => {
        panel = new Panel(0);
        panel.scene = new Scene();
        panel.scene.characters = ["Walt", "Mickey", "Minnie", "Goofy", "Weirdo"];

        plotItems = [
            new PlotItem({
                who: ["Mickey"],
                whoWith: ["Goofy"],
                how: [
                    new Qualifier("Mickey", "happy"),
                    new Qualifier("Mickey", "wet"),
                    new Qualifier("Goofy", "laughing"),
                ]
            }),
            new PlotItem({
                description: "It is a sunny day"
            }),
            new PlotItem({
                who: ["Mickey"],
                says: "Hey Goofy"
            })
        ];
    });

    test("method setPlotItems", () => {
        panel.setPlotItems(plotItems);

        expect(panel.actors).toEqual([
            new Character("Mickey", ["happy", "wet"]),
            new Character("Goofy", ["laughing"])
        ]);
        expect(panel.characters).toEqual([
            new Character("Walt"),
            new Character("Mickey", ["happy", "wet"]),
            new Character("Minnie"),
            new Character("Goofy", ["laughing"]),
            new Character("Weirdo")
        ]);
    });

    test("method getCharacterSlice", () => {
        panel.setPlotItems(plotItems);

        expect(panel.characters).toEqual([
            new Character("Walt"),
            new Character("Mickey", ["happy", "wet"]),
            new Character("Minnie"),
            new Character("Goofy", ["laughing"]),
            new Character("Weirdo")
        ]);
        expect(panel.getCharacterSlice(panel.actors)).toEqual([
            new Character("Mickey", ["happy", "wet"]),
            new Character("Minnie"),
            new Character("Goofy", ["laughing"])
        ]);
    });
});
