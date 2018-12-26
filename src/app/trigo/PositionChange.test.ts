import { Square } from "./Square";
import { PositionChange } from "./PositionChange";

describe("PositionChange", () => {

    test("method adjust scales squares", () => {
        const square = new Square(10, 10, 10);
        const positionChange = new PositionChange(0, 0, 2);
        positionChange.adjust(square);

        // rectangle is scaled from the center, therefore x and y changed
        expect(square.size).toBe(20);
        expect(square.x).toBe(5);
        expect(square.y).toBe(5);
    });

    test("method adjust scales and translates squares", () => {
        const square = new Square(10, 10, 10);
        const positionChange = new PositionChange(0.5, 1, 2);
        positionChange.adjust(square);

        // translation is measured in the size before it's scaled, i.e. dx = 0.5 * 10 = 5, dy = 1.0 * 10 = 10
        expect(square.size).toBe(20);
        expect(square.x).toBe(10);
        expect(square.y).toBe(15);
    });
});