import {PlotItem, STORY_TELLER} from "./PlotItem";
import {PlotParser} from "./PlotParser";

export class Plot {

    input: string;

    plotParser: PlotParser;

    plotItems: PlotItem[] = [];

    constructor(input: string) {
        this.input = input || '';
        this.plotParser = new PlotParser(this);
        this.plotItems = this.plotParser.parseInput();
    }

    /**
     * The place must be specified after the keyword "place:".
     */
    get place(): string {
        if (this.input.toLowerCase().indexOf("place:") < 0) {
            return "Somewhere";
        }
        const matches = this.input.match(/place:(.*)/i);
        return matches ? matches[1].trim() : ''
    };

    /**
     * The plot content must be specified after the keyword "plot:"
     */
    get content(): string {
        if (this.input.toLowerCase().indexOf("plot:") < 0) {
            return '';
        }
        const splits = this.input.split(/plot:/i);
        return splits ? splits[1].trim() : '';
    }

    /**
     * Characters must be declared after the keyword "characters:"
     */
    get characters(): string[] {
        if (this.input.toLowerCase().indexOf("characters:") < 0) {
            return [];
        }
        const matches = this.input.match(/characters:(.*)/i);
        const characters = matches ? matches[1]
                .split(",")
                .map(name => name.trim())
            : [];
        characters.push(STORY_TELLER);
        return characters;
    }
}