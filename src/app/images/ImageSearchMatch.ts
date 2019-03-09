export enum MatchQuality {
    DEFAULT = "DEFAULT",
    PREMIUM = "PREMIUM",
    SECONDARY = "SECONDARY"
}

export class ImageSearchMatch {

    imageName: string;
    matches: { [key in MatchQuality]: string[] } = {DEFAULT: null, PREMIUM: null, SECONDARY: null};

    constructor(imageName: string) {
        this.imageName = imageName;
    }

    get premiumMatches() {
        return this.getMatches(MatchQuality.PREMIUM);
    }

    get premiumMatchCount() {
        return this.getMatchCount(MatchQuality.PREMIUM);
    }

    get defaultMatches() {
        return this.getMatches(MatchQuality.DEFAULT);
    }

    get defaultMatchCount() {
        return this.getMatchCount(MatchQuality.DEFAULT);
    }

    get secondaryMatches() {
        return this.getMatches(MatchQuality.SECONDARY);
    }

    get secondaryMatchCount() {
        return this.getMatchCount(MatchQuality.SECONDARY);
    }

    addMatch(match: string, quality: MatchQuality): void {
        if (!this.matches[quality]) {
            this.matches[quality] = [];
        }
        this.matches[quality].push(match);
    }

    getMatches(quality: MatchQuality): string[] {
        if (!this.matches[quality]) {
            return [];
        }
        return this.matches[quality];
    }

    getMatchCount(quality: MatchQuality): number {
        return this.getMatches(quality).length;
    }

    toString() {
        return "image name " + this.imageName + " has"
            + " premium matches: " + (this.premiumMatches.length === 0 ? "none " : this.premiumMatches.join(", "))
            + ", default matches: " + (this.defaultMatches.length === 0 ? "none " : this.defaultMatches.join(", "))
            + ", secondary matches: " + (this.secondaryMatches.length === 0 ? "none " : this.secondaryMatches.join(", "));
    }
}