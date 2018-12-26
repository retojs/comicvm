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

export class PaintConfig {

    strokeStyle: string;
    fillStyle: string;
    lineWidth: number;
    enabled: boolean;

    constructor(strokeStyle?: string, fillStyle?: string, lineWidth?: number, enabled?: boolean) {
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.lineWidth = lineWidth;
        this.enabled = enabled === undefined ? true : enabled;
    }

    static stroke(color: string, lineWidth?: number, enabled?: boolean) {
        return new PaintConfig(color, null, lineWidth, enabled);
    }

    static fill(color: string, enabled?: boolean) {
        return new PaintConfig(null, color, null, enabled);
    }
}

export class FeaturePaintConfig {

    page = {
        background: PaintConfig.fill("rgba(250, 200, 0, 0.05)", true),
        separator: PaintConfig.stroke("rgba(0, 0, 0, 0.2)", 0.2, true)
    };

    strip = {
        border: PaintConfig.stroke("rgba(100, 200, 180, 0.4)", 0.5)
    };

    panel = {
        border: PaintConfig.stroke("#000", 0.75, true),
        grid: PaintConfig.stroke("#880", 0.1, true)
    };

    character = {
        box: PaintConfig.stroke("#66f", 0.6, true),
        bbox: PaintConfig.fill("rgba(00, 00, 250, 0.1)", true),
        actor: {
            box: PaintConfig.stroke("#f00", 0.6, true),
            bbox: PaintConfig.fill("rgba(250, 0,0, 0.1)", true)
        }
    }
}

export class CanvasConfig {

    id: string;
    width: number;
    height: number;

    constructor(id: string,
                width: number,
                height: number) {
        this.id = id;
        this.width = width;
        this.height = height;
    }
}

export enum CharacterPositionLayoutLevel {
    DEFAULT = 0,
    SCENE = 1,
    BACKGROUND = 2,
    PANEL = 3
}

export class LayoutConfig {

    static canvas = new CanvasConfig("comic-vm-canvas", 700, 2800);

    static page: PageConfig = new PageConfig();

    static characterPositionLayoutLevel = CharacterPositionLayoutLevel.DEFAULT;

    static feature: FeaturePaintConfig = new FeaturePaintConfig();

    static applyZoom = true;
    static applyPanning = true;
}
