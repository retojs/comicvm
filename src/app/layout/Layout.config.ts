export enum TextAlign {
    Left, Center, Right
}

export enum CharacterPositionLayoutLevel {
    DEFAULT = 0,
    SCENE = 1,
    BACKGROUND = 2,
    PANEL = 3
}

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class MarginConfig implements Margin {

    top: number;
    right: number;
    bottom: number;
    left: number;

    initial: Margin;

    constructor(top: number, right?: number, bottom?: number, left?: number) {
        this.top = this.bottom = top;
        this.right = this.left = right == null ? this.top : right;
        this.bottom = bottom == null ? this.bottom : bottom;
        this.left = left == null ? this.left : left;

        this.initial = {top, right, bottom, left};
    }

    get horizontal() {
        return this.right + this.left;
    }

    get vertical() {
        return this.top + this.bottom;
    }

    get asString() {
        return [this.initial.top, this.initial.right, this.initial.bottom, this.initial.left]
            .filter(n => !!n)
            .join(" ");
    }
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
    height = 2970;

    padding = new MarginConfig(50, 40);

    get innerWidth() {
        return this.width - this.padding.horizontal;
    }

    get innerHeight() {
        return this.height - this.padding.vertical;
    }

    get proportion() {
        return this.height / this.width;
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
    margin = new MarginConfig(30);
    padding = new MarginConfig(30);
}

export class PointerConfig {
    widthNearBubble = 25;
    controlPointWidth = 15;
    controlPointVerticalPosition = 0.6;
    verticalDistanceFromCharacter = 0.5;
    horizontalDistanceFromBubbleCenter = 0.2;
}

export class BubbleConfig {
    margin = new MarginConfig(15);
    padding = new MarginConfig(25, 35);
    radius = new MarginConfig(45);
    maxWithPerHeight = 12;
    verticalAlign = 0.808;
    pointer = new PointerConfig()
}

export class LayoutConfig {

    static page = new PageConfig();
    static panel = new PanelConfig();
    static bubble = new BubbleConfig();

    static characterPositionLayoutLevel = CharacterPositionLayoutLevel.PANEL;

    static applyZoom = true;
    static applyPanning = true;
}
