export enum TextAlign {
    Left, Center, Right
}

export enum CharacterPositionLayoutLevel {
    DEFAULT = 0,
    SCENE = 1,
    BACKGROUND = 2,
    PANEL = 3
}

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

export class PageConfig {

    width = 2100;
    height = 2970;

    padding = new MarginConfig(50, 40, 50, 40);

    get innerWidth() {
        return this.width - this.padding.horizontal;
    }

    get innerHeight() {
        return this.height - this.padding.vertical;
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

    margin = new MarginConfig(30, 30, 30, 30,);

    constructor(panelWidths: number[]) {
        super(panelWidths);
    }

    static createDefault(panelCount) {
        return new PanelConfig(new Array(panelCount).fill(1 / panelCount));
    }
}

export class BubbleConfig {
    margin = new MarginConfig(15, 16, 15, 16);
    padding = new MarginConfig(20, 30, 20, 30);
    radius = new MarginConfig(25, 25, 25, 25);
    maxWithPerHeight =12;
    verticalAlign = 0.8;
    pointerVerticalDistanceFromCharacter = 0.5;
    pointerHorizontalDistanceFromBubbleCenter = 0.5;
}

export class LayoutConfig {

    static page: PageConfig = new PageConfig();

    static characterPositionLayoutLevel = CharacterPositionLayoutLevel.PANEL;

    static applyZoom = true;
    static applyPanning = true;

    static bubbles = new BubbleConfig();
}
