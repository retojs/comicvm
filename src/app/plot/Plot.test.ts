import {Plot} from "./Plot";
import {PlotItem, STORY_TELLER} from "./PlotItem";

describe("Plot", () => {

    let plot: Plot;

    beforeEach(() => {
        plot = new Plot('');
    });

    it("has a getter 'place' returning the string after the keyword 'place:' in the parsed input", () => {
        const place = "The Place";
        plot = new Plot(`
            This is a test plot.
            PlacE: ${place}
        `);
        expect(plot.place).toBe(place);

        plot = new Plot("invalid");
        expect(plot.place).toBe("Somewhere");
    });

    it("has a getter 'content' returning the text after the keyword 'plot:' in the parsed input", () => {
        const content = "This plot has no content";
        plot = new Plot(`
            This is a test plot.
            place: somewhere
            PloT: ${content}
        `);
        expect(plot.content).toBe(content);

        plot = new Plot("invalid");
        expect(plot.content).toBe('');
    });

    it("has a getter 'characters' returning the names after the keyword 'characters:' in the parsed input plus the name STORYTELLER", () => {
        const characters = ["Doc", "Dopey", "Bashful", "Grumpy", "Sneezy", "Sleepy", "Happy"];
        plot = new Plot(`
            This is a test plot.
            place: somewhere
            CharacterS: ${characters}
            plot: ...
        `);
        expect(plot.characters).toEqual(characters.concat([STORY_TELLER]));

        plot = new Plot("invalid");
        expect(plot.characters).toEqual([]);
    });

});