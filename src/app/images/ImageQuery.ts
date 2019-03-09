export class ImageQuery {

    matches: string[];
    premiumMatches: string[];
    secondaryMatches: string[];

    constructor(matches: string[], premiumMatches?: string[], secondaryMatches?: string[]) {
        this.matches = matches || [];
        this.premiumMatches = premiumMatches || [];
        this.secondaryMatches = secondaryMatches || [];
    }

    addQuery(query: ImageQuery): ImageQuery {
        this.matches.push(...query.matches);
        this.premiumMatches.push(...query.premiumMatches);
        this.secondaryMatches.push(...query.secondaryMatches);
        return this;
    }

    toString(): string {
        return "premium matches: " + (this.premiumMatches.length === 0 ? "none " : this.premiumMatches.join(", "))
            + ", default matches: " + (this.matches.length === 0 ? "none " : this.matches.join(", "))
            + ", secondary matches: " + (this.secondaryMatches.length === 0 ? "none " : this.secondaryMatches.join(", "));
    }
}