import { ImageStore } from "./ImageStore";
import { ImageQuery } from "./ImageQuery";

describe("ImageStore", () => {

    const fileNames = [
        "a",
        "b",
        "c",
        "d",
        "a.b",
        "a.c",
        "a.d",
        "b.c",
        "b.d",
        "c.d",
        "a.b.c",
        "a.b.d",
        "a.c.d",
        "b.c.d",
        "a.b.c.d",
        "q.r.s.t.u.v",
        "u.v.w.x.y.z"
    ];

    let imageStore: ImageStore;

    describe("method getBestMatchImageName(query)", () => {

        beforeEach(() => {
            imageStore = new ImageStore(fileNames);
        });

        it("returns the image name with most matches", () => {
            let query = new ImageQuery(["b", "c"], ["a"], ["d"]);
            expect(imageStore.getBestMatchImageName(query)).toBe("a.b.c.d");
        });

        it("returns the shortest of multiple equivalent matches", () => {
            let query = new ImageQuery(["b"], ["a"], ["x"]);
            expect(imageStore.getBestMatchImageName(query)).toBe("a.b"); // not "a.b.d" or "a.b.c"
        });

        it("returns the best match regarding premium matches", () => {
            const secondaryC = new ImageQuery(["a", "b"], ["c"]);
            const secondaryD = new ImageQuery(["a", "b"], ["d"]);
            expect(imageStore.getBestMatchImageName(secondaryC)).toBe("a.b.c");
            expect(imageStore.getBestMatchImageName(secondaryD)).toBe("a.b.d");
        });

        it("returns the best match regarding secondary matches", () => {
            const secondaryC = new ImageQuery(["a", "b"], null, ["c"]);
            const secondaryD = new ImageQuery(["a", "b"], null, ["d"]);
            expect(imageStore.getBestMatchImageName(secondaryC)).toBe("a.b.c");
            expect(imageStore.getBestMatchImageName(secondaryD)).toBe("a.b.d");
        });

        it("prefers premium matches over any number of default  matches", () => {
            const defaultABCD = new ImageQuery(["a", "b", "c", "d"]);
            const premiumQ = new ImageQuery(["a", "b", "c", "d"], ["q"]);
            expect(imageStore.getBestMatchImageName(defaultABCD)).toBe("a.b.c.d");
            expect(imageStore.getBestMatchImageName(premiumQ)).toBe("q.r.s.t.u.v");
        });

        it("prefers premium matches over any number of secondary matches", () => {
            const defaultABCD = new ImageQuery(null, null, ["a", "b", "c", "d"]);
            const premiumQ = new ImageQuery(null, ["q"], ["a", "b", "c", "d"]);
            expect(imageStore.getBestMatchImageName(defaultABCD)).toBe("a.b.c.d");
            expect(imageStore.getBestMatchImageName(premiumQ)).toBe("q.r.s.t.u.v");
        });

        it("prefers default matches over any number of secondary matches", () => {
            const secondaryABCD = new ImageQuery(null, null, ["a", "b", "c", "d"]);
            const defaultQ = new ImageQuery(["q"], null, ["a", "b", "c", "d"]);
            expect(imageStore.getBestMatchImageName(secondaryABCD)).toBe("a.b.c.d");
            expect(imageStore.getBestMatchImageName(defaultQ)).toBe("q.r.s.t.u.v");
        });
    });
});