import { Margin } from "../../common/style/Margin";


export enum LayoutLevel {
    DEFAULT = 0,
    SCENE = 1,
    BACKGROUND = 2,
    PANEL = 3
}

export class ProportionsConfig {

    proportions: number[] = [];

    constructor(proportions: number[]) {
        this.proportions = proportions;
    }

    /**
     * Returns the cumulated proportion values from index 0 to the specified index.
     *
     * @param index
     */
    getSum(index: number): number {
        let sum = 0;
        for (let i = 0; i < index; i++) {
            sum += this.proportions[i] || 0;
        }
        return Math.max(0, Math.min(1, sum));
    }

    get remainder(): number {
        return 1 - this.getSum(this.proportions.length);
    }

    get hasProportions(): boolean {
        return this.proportions && this.proportions.length > 0;
    }
}

export class PageConfig {

    width = 2100;
    height = Math.round(this.width * PageConfig.proportion);

    padding = new Margin(50, 40);

    get innerWidth() {
        return this.width - this.padding.horizontal;
    }

    get innerHeight() {
        return this.height - this.padding.vertical;
    }

    static get proportion() {
        return Math.sqrt(1.618);
    }
}

export class StripHeightsConfig extends ProportionsConfig {

    constructor(heights: number[]) {
        super(heights);
    }

    static createDefault(stripCount: number) {
        return new StripHeightsConfig(new Array(stripCount).fill(1 / stripCount));
    }
}

export class PanelWidthsConfig extends ProportionsConfig {

    constructor(panelWidths?: number[]) {
        super(panelWidths);
    }

    static createDefault(panelCount) {
        return new PanelWidthsConfig(new Array(panelCount).fill(1 / panelCount));
    }
}

export class PanelConfig {
    margin = new Margin(30);
    padding = new Margin(30);
}

export class PointerConfig {
    bubbleEndsDistance = 24;
    characterEndDistance = 0.5;
    controlPoint = {
        width: 16,
        horizontalOffset: 0.1,
        verticalOffset: 0.25
    };
}

export class BubbleConfig {
    margin = new Margin(15);
    padding = new Margin(25, 35);
    radius = new Margin(45);
    maxWithPerHeight = 12;
    verticalAlign = 0.808;
    pointer = new PointerConfig();
    offScreen = {
        padding: new Margin(25, 20)
    };
}

export class LayoutConfig {

    static page = new PageConfig();
    static panel = new PanelConfig();
    static bubble = new BubbleConfig();

    static layoutLevel = LayoutLevel.PANEL;

    static applyZoom = true;
    static applyPanning = true;
}
