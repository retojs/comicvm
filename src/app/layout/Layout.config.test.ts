import { ProportionsConfig } from "./Layout.config";

describe('ProportionsConfig', () => {

    test('getSum returns the sum of its proportions from index 0 to the specified index', () => {
        const proportions = new ProportionsConfig([0.2, 0.2]);
        expect(proportions.getSum(0)).toBe(0);
        expect(proportions.getSum(1)).toBe(0.2);
        expect(proportions.getSum(2)).toBe(0.4);
        expect(proportions.getSum(3)).toBe(0.4);
    });

    test('getSum returns a value between 0 and 1', () => {
        const proportions = new ProportionsConfig([-0.2, 22]);
        expect(proportions.getSum(0)).toBe(0);
        expect(proportions.getSum(1)).toBe(0);
        expect(proportions.getSum(2)).toBe(1);
        expect(proportions.getSum(3)).toBe(1);
    });

    test('remainder returns the value its proportions are short of 1', () => {
        let proportions = new ProportionsConfig([0.3, 0.3]);
        expect(proportions.remainder).toBe(0.4);
        proportions = new ProportionsConfig([0.6, 0.6]);
        expect(proportions.remainder).toBe(0);
    });
});