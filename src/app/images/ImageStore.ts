import { ImageQuery } from "./ImageQuery";
import { ImageSearchMatch, MatchQuality } from "./ImageSearchMatch";

type MatchesByImageName = { [key: string]: ImageSearchMatch };

export class ImageStore {

    imageNames: string[];

    constructor(imageNames: string[]) {
        this.imageNames = imageNames.map(name => name.trim().toLowerCase());
    }

    getBestMatchImageName(query: ImageQuery): string {
        const matchesByImageName: MatchesByImageName = {};
        this.addMatches(query.matches, MatchQuality.DEFAULT, matchesByImageName);
        this.addMatches(query.premiumMatches, MatchQuality.PREMIUM, matchesByImageName);
        this.addMatches(query.secondaryMatches, MatchQuality.SECONDARY, matchesByImageName);

        const sortedMatches: ImageSearchMatch[] = Object.keys(matchesByImageName)
            .map(key => matchesByImageName[key])
            .sort((a: ImageSearchMatch, b: ImageSearchMatch) => {
                if (a.premiumMatchCount !== b.premiumMatchCount) {
                    return b.premiumMatchCount - a.premiumMatchCount
                }
                if (a.defaultMatchCount !== b.defaultMatchCount) {
                    return b.defaultMatchCount - a.defaultMatchCount
                }
                if (a.secondaryMatchCount !== b.secondaryMatchCount) {
                    return b.secondaryMatchCount - a.secondaryMatchCount
                }
                return a.imageName.length - b.imageName.length; // prefer shorter image name
            });

        // console.log("sorted matches for query " + query.toString(), sortedMatches.reduce((str, match) => str + "\n" + match.toString(), ""));

        return sortedMatches && sortedMatches.length > 0 ? sortedMatches[0].imageName : "none.png";
    }

    addMatches(matches: string[], quality: MatchQuality, matchesByImageName: MatchesByImageName): void {
        matches.forEach(match => {
            this.findMatchingImageNames(match).forEach(imageName => {
                if (!matchesByImageName[imageName]) {
                    matchesByImageName[imageName] = new ImageSearchMatch(imageName);
                }
                matchesByImageName[imageName].addMatch(match, quality);
            });
        });
    }

    findMatchingImageNames(match: string): string[] {
        return this.imageNames.filter(imageName => imageName.indexOf(match.trim().toLowerCase()) > -1);
    }
}