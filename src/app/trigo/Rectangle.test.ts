import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

describe("Rectangle", () => {

    it("method scale scales a rectangle relative to an origin", () => {
        let scaleMe = new Rectangle(100, 50, 50, 50);
        scaleMe.scale(0.5);
        expect(scaleMe.x).toBe(100);
        expect(scaleMe.y).toBe(50);
        expect(scaleMe.width).toBe(25);
        expect(scaleMe.height).toBe(25);

        scaleMe = new Rectangle(100, 50, 50, 50);
        const origin = new Point(100, 100);
        scaleMe.scale(0.5, origin);
        expect(scaleMe.x).toBe(100);
        expect(scaleMe.y).toBe(75);
        expect(scaleMe.width).toBe(25);
        expect(scaleMe.height).toBe(25);
    });

    it("method fitToBounds fits a rectangle into a rectangle", () => {
        const container = new Rectangle(0, 0, 100, 80);
        const fitMe = new Rectangle(20, 20, 80, 40);
        Rectangle.fitToBounds(fitMe, container);
        expect(fitMe.x).toBe(0);
        expect(fitMe.y).toBe(15);
        expect(fitMe.width).toBe(100);
        expect(fitMe.height).toBe(50);
    });
});