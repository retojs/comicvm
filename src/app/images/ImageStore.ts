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
                if (a.getMatchCount(MatchQuality.PREMIUM) !== b.getMatchCount(MatchQuality.PREMIUM)) {
                    return b.getMatchCount(MatchQuality.PREMIUM) - a.getMatchCount(MatchQuality.PREMIUM)
                }
                if (a.getMatchCount(MatchQuality.DEFAULT) !== b.getMatchCount(MatchQuality.DEFAULT)) {
                    return b.getMatchCount(MatchQuality.DEFAULT) - a.getMatchCount(MatchQuality.DEFAULT)
                }
                if (a.getMatchCount(MatchQuality.SECONDARY) !== b.getMatchCount(MatchQuality.SECONDARY)) {
                    return b.getMatchCount(MatchQuality.SECONDARY) - a.getMatchCount(MatchQuality.SECONDARY)
                }
                return a.imageName.length - b.imageName.length;
            });

        // console.log("sorted matches for query " + query.toString(), sortedMatches.reduce((str, match) => str + "\n" + match.toString(), ""));

        return sortedMatches ? sortedMatches[0].imageName : "none";
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