import {Plot} from "./Plot";
import {PlotItem} from "./PlotItem";

enum InputType {
    CHARACTER,
    DESCRIPTION,
    DIALOG,
    QUALIFIER,
}

export class PlotParser {

    plotItems: PlotItem[] = [];
    currentPlotItem: PlotItem;

    constructor(private plot: Plot) {}

    addPlotItem(plotItem: PlotItem) {
        plotItem._index = this.plotItems.length + 1;
        this.plotItems.push(plotItem);
        this.currentPlotItem = plotItem;
    }

    parseInput(): PlotItem[] {
        this.plot.content.split("\n").forEach(line => {
            if (!!line.trim()) {
                this.parseLine(line);
            }
        });
        return this.plotItems;
    }

    parseLine(line: string): void {
        switch (this.getInputType(line)) {
            case InputType.CHARACTER:
                return this.onCharacter(line);
            case InputType.DESCRIPTION:
                return this.onDescription(line);
            case InputType.DIALOG:
                return this.onDialog(line);
            case InputType.QUALIFIER:
                return this.onQualifier(line);
        }
    }

    getInputType(line: string): InputType {
        if (this.isWrappedInParenthesis(line)) {
            return InputType.QUALIFIER;
        } else if (this.beginsWithWhiteSpace(line)) {
            return InputType.DIALOG;
        } else if (this.beginsWithCharacterName(line)) {
            return InputType.CHARACTER;
        } else {
            return InputType.DESCRIPTION;
        }
    }

    isWrappedInParenthesis(line: string): boolean {
        return /\(.*\)/i.test(line);
    }

    beginsWithWhiteSpace(line: string): boolean {
        return /^\s/.test(line);
    }

    beginsWithCharacterName(line: string): boolean {
        return this.plot.characters.some(name => line.trim().toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    onCharacter(line: string): void {
        const who = [this.plot.characters.find(name => line.trim().toLowerCase().indexOf(name.toLowerCase()) === 0)];
        const whoWith = this.plot.characters.filter(name => line.toLowerCase().indexOf(name.toLowerCase()) > -1);

        if (!this.currentPlotItem
            || (!this.currentPlotItem.who || this.currentPlotItem._action)) {
            this.addPlotItem(new PlotItem({who, whoWith}))
        } else {
            // Create only a single plot item in case multiple character declarations follow one another.
            // (This is the case if currentPlotItem.who is set but not currentPlotItem._action...)
            this.currentPlotItem._actors.push(...who);
            this.currentPlotItem._characters.push(...whoWith);
        }

        if (line.trim().indexOf(":") !== line.trim().length - 1) {
            // If the line is no character declaration ending with a colon then it's a 'does' action.
            this.currentPlotItem.does = line.trim();
            this.currentPlotItem.who = [...who, ...whoWith];
        }
    }

    onDescription(line: string): void {
        this.addPlotItem(new PlotItem({
            description: line.trim()
        }));
    }

    onDialog(line: string): void {
        if (!this.currentPlotItem) {
            throw new Error("No current plot item. Please note that dialog lines need a preceding character declaration.")
        }
        if (this.currentPlotItem.says) {
            // create a new plot item for each line of dialog
            this.addPlotItem(this.currentPlotItem.clone())
        }
        this.currentPlotItem.says = line.trim();
    }

    onQualifier(line: string): void {
        let qualifiers = line.match(/(.+)/i);
        qualifiers = qualifiers[0].replace(/[()]/g, '').split(",");
        qualifiers.forEach(q => {
            if (q.indexOf(":") >= 0) {
                // current qualifier is assigned to a name like "name: qualifier"
                const how = q.substr(q.indexOf(":") + 1).trim();
                const who = q.substr(0, q.indexOf(":")).trim();
                this.currentPlotItem.how.push({who, how});
            } else {
                // current qualifier is not assigned to a name
                this.currentPlotItem.who.forEach(who => {
                    this.currentPlotItem.how.push({who: who, how: q.trim()});
                });
            }
        });
    }
}