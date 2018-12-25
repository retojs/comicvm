export class MarginConfig {

    top: number;
    right: number;
    bottom: number;
    left: number;

    constructor(top: number, right: number, bottom: number, left: number) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    get horizontal() {
        return this.right + this.left;
    }

    get vertical() {
        return this.top + this.bottom;
    }
}

export class PageConfig {

    width = 210;
    height = 297;

    padding = new MarginConfig(5, 4, 5, 4);

    get innerWidth() {
        return this.width - this.padding.horizontal;
    }

    get innerHeight() {
        return this.height - this.padding.vertical;
    }
}

abstract class ProportionsConfig {

    proportions: number[] = [];

    protected constructor(proportions: number[]) {
        this.proportions = proportions;
    }

    /**
     * Returns the cumulated proportion values from index 0 to the specified index.
     *
     * @param index
     */
    getSum(index: number) {
        let sum = 0;
        for (let i = 0; i < index; i++) {
            sum += this.proportions[i];
        }
        return sum;
    }

    get hasProportions() {
        return this.proportions && this.proportions.length > 0;
    }
}

export class StripConfig extends ProportionsConfig {

    constructor(heights: number[]) {
        super(heights);
    }

    static createDefault(stripCount: number) {
        return new StripConfig(new Array(stripCount).fill(1 / stripCount));
    }
}

export class PanelConfig extends ProportionsConfig {

    margin = new MarginConfig(3, 3, 3, 3,);

    constructor(panelWidths: number[]) {
        super(panelWidths);
    }

    static createDefault(panelCount) {
        return new PanelConfig(new Array(panelCount).fill(1 / panelCount));
    }
}

export class LayoutConfig {

    static page: PageConfig = new PageConfig();

}
