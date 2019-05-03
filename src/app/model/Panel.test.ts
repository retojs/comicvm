import { PlotItem } from "../plot/PlotItem";
import { Panel } from "./Panel";
import { Character } from "./Character";
import { Qualifier } from "./Qualifier";
import { Scene } from "./Scene";
import { SceneOrBackgroundLayout } from "../layout/Layout";

describe("Panel", () => {

    let panel: Panel;
    let plotItems: PlotItem[];

    beforeEach(() => {
        panel = new Panel(0, 0);
        panel.scene = new Scene("", "", "");
        panel.scene.layout = {
            characters: ["Walt", "Mickey", "Minnie", "Goofy", "Weirdo"]
        } as SceneOrBackgroundLayout;

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

    it("method setPlotItems", () => {
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

    it("method getCharacterSlice", () => {
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

    it("method extractBubbles", () => {
        const plotItems = [];
        plotItems.push(new PlotItem({who: ["Mickey"], says: "Hey Goofy!"}));
        plotItems.push(new PlotItem({who: ["Mickey"], says: "Have you met Minnie?"}));
        plotItems.push(new PlotItem({who: ["Minnie"], says: "Hi Goofy!"}));
        plotItems.push(new PlotItem({who: ["Goofy"], says: "Nice to meet you, Minnie."}));
        plotItems.push(new PlotItem({who: ["Minnie"], says: "My pleasure, Goofy."}));

        panel.extractBubbles(plotItems);

        expect(panel.bubbles.length).toBe(4);
        expect(panel.bubbles[0].who).toEqual(["Mickey"]);
        expect(panel.bubbles[1].who).toEqual(["Minnie"]);
        expect(panel.bubbles[2].who).toEqual(["Goofy"]);
        expect(panel.bubbles[3].who).toEqual(["Minnie"]);
        expect(panel.bubbles[0].says).toBe("Hey Goofy! Have you met Minnie?");
        expect(panel.bubbles[1].says).toBe("Hi Goofy!");
        expect(panel.bubbles[2].says).toBe("Nice to meet you, Minnie.");
        expect(panel.bubbles[3].says).toBe("My pleasure, Goofy.");
    });
});
