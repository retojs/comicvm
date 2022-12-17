import { Canvas } from "../../../common/dom/Canvas";
import { Panel } from "../../model/Panel";
import { LayoutConfig } from "../Layout.config";
import { Rectangle } from "../../../common/trigo/Rectangle";
import { Bubble } from "../../model/Bubble";
import { TextBox } from "../../model/TextBox";
import { BubblePointer } from "../../model/BubblePointer";
import { validatePanelShape } from "./validation";

export class BubbleLayoutEngine {

    private canvas: Canvas;

    constructor(
        private layoutConfig: LayoutConfig = new LayoutConfig()
    ) {
    }

    layout(panels: Panel[], canvas: Canvas) {
        panels
            .filter(panel => !!panel.bubbles && panel.bubbles.length > 0)
            .forEach(panel => this.layoutPanel(panel, canvas));
    }

    layoutPanel(panel: Panel, canvas: Canvas) {
        validatePanelShape(panel);

        this.canvas = canvas;
        this.canvas.setFont(this.canvas.font);

        this.createBubbleShapes(panel);
        this.layoutOffscreenBubble(panel);
        this.layoutBubblesIntoLines(panel);
        this.createBubblePointers(panel);
    }

    private createBubbleShapes(panel: Panel): void {
        panel.bubbles.forEach(bubble => {
            const availableLineWidth = panel.shape.width - this.layoutConfig.panel.padding.horizontal - this.layoutConfig.bubble.padding.horizontal;
            bubble.textBox = this.layoutTextBox(
                bubble.says,
                availableLineWidth,
                (bubble.isOffScreen ? 2 : 1) * this.layoutConfig.bubble.maxWithPerHeight
            );
            bubble.shape = new Rectangle(
                0,
                0,
                bubble.textBox.width + this.layoutConfig.bubble.padding.horizontal,
                bubble.textBox.height + this.layoutConfig.bubble.padding.vertical);
        });
    }

    private layoutOffscreenBubble(panel: Panel): void {
        if (panel.offScreenBubble) {
            panel.offScreenBubble.shape.x = panel.shape.x + this.layoutConfig.panel.padding.left;
            panel.offScreenBubble.shape.y = panel.shape.y + this.layoutConfig.panel.padding.top;
        }
    }

    layoutBubblesIntoLines(panel: Panel): Bubble[][] {

        let availableWidth = panel.shape.width - this.layoutConfig.panel.padding.horizontal;
        let nextLine: Bubble[] = [];
        let bubbleLines: Bubble[][] = [nextLine];

        panel.bubbles
            .filter(bubble => !bubble.isOffScreen)
            .forEach(bubble => {
                if (availableWidth >= bubble.shape.width) {
                    nextLine.push(bubble);
                    availableWidth -= bubble.shape.width + this.layoutConfig.bubble.margin.right;
                } else {
                    nextLine = [bubble];
                    bubbleLines.push(nextLine);
                }
            });

        return this.alignBubbles(bubbleLines, panel);
    }

    createBubblePointers(panel: Panel): void {
        panel.bubbles
            .filter(bubble => !!bubble.shape)
            .filter(bubble => !bubble.isOffScreen)
            .forEach(bubble => {
                bubble.pointers = [];
                bubble.who.forEach(name => {
                    if (panel.characterNames.indexOf(name) > -1) {
                        bubble.pointers.push(new BubblePointer(bubble, panel.getCharacter(name)));
                    }
                });
            });
    }

    private alignBubbles(bubbleLines: Bubble[][], panel: Panel): Bubble[][] {

        // Simple approach:
        //  If there is more than one line of bubbles
        //   and the first bubble in the second line is said by a different character than the first bubble in the first line,
        //  then align the bubble lines alternating (left-right-left.right)
        //  otherwise align the bubble lines centered

        let alignLeftRight = false;
        if (bubbleLines.length > 1 && !bubbleLines[0][0].whoEquals(bubbleLines[1][0].who)) {
            alignLeftRight = true;
        }

        const panelBounds = panel.shape.clone().cutMargin(this.layoutConfig.panel.padding);
        let y = getInitialVerticalOffset(
            this.layoutConfig.bubble.margin.top,
            this.layoutConfig.panel.padding.top
        );
        bubbleLines.forEach((bubbleLine, index) => {
            if (alignLeftRight) {
                if (index % 2) {
                    this.allignBubblesRight(bubbleLine, panelBounds, y);
                } else {
                    this.allignBubblesLeft(bubbleLine, panelBounds, y);
                }
            } else {
                this.alignBubblesDistributed(bubbleLine, panelBounds, y);
                // this.alignBubblesCentered(bubbleLine, panelBounds, y);
            }
            y += this.getBubbleLineHeight(bubbleLine);
        });

        return bubbleLines;

        function getInitialVerticalOffset(marginTop, paddingTop) {
            let y = -marginTop; // no bubble margin between panel border and bubble
            if (panel.offScreenBubble) {
                y += panel.offScreenBubble.shape.height + paddingTop;
            }
            return y;
        }
    }

    private allignBubblesLeft(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x - this.layoutConfig.bubble.margin.left,
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    private allignBubblesRight(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x + this.layoutConfig.bubble.margin.left + (container.width - this.getBubbleLineWidth(bubbleLine)),
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    private alignBubblesCentered(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x + (container.width - this.getBubbleLineWidth(bubbleLine)) / 2,
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    private alignBubblesDistributed(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        const gapWidth = (container.width - this.getBubbleLineWidth(bubbleLine)) / (bubbleLine.length + 1);
        let x = container.x + gapWidth;
        let y = container.y + verticalOffset;
        bubbleLine.forEach(bubble => {
            bubble.shape.x = x + this.layoutConfig.bubble.margin.left;
            bubble.shape.y = y + this.layoutConfig.bubble.margin.top;
            x += bubble.shape.width + this.layoutConfig.bubble.margin.right + Math.max(0, gapWidth);
        });
    }

    private setBubbleLinePosition(bubbleLine: Bubble[], x: number, y: number) {
        bubbleLine.forEach(bubble => {
            bubble.shape.x = x + this.layoutConfig.bubble.margin.left;
            bubble.shape.y = y + this.layoutConfig.bubble.margin.top;
            x += bubble.shape.width + this.layoutConfig.bubble.margin.right;
        });
    }

    private getBubbleLineWidth(bubbles: Bubble[]): number {
        return bubbles.reduce((width, bubble) => {
            return width + bubble.shape.width + this.layoutConfig.bubble.margin.right;
        }, this.layoutConfig.bubble.margin.left);
    }

    private getBubbleLineHeight(bubbles: Bubble[]): number {
        return bubbles.reduce((height, bubble) => {
            const h = bubble.shape.height + this.layoutConfig.bubble.margin.bottom;
            return height > h ? height : h;
        }, this.layoutConfig.bubble.margin.top);
    }

    /**
     * Splits the specified text into lines fitting into a box with the specified criteria.
     *
     * @param text: The text to split into lines
     * @param maxWidth: lines must not be longer than this
     * @param maxProportion: height and width should not differ more than these proportions
     */
    layoutTextBox(text: string, maxWidth: number, maxProportion: number): TextBox {

        let lineCount = 1;
        let textBox = this.splitIntoLines(text, lineCount);
        for (let i = 0; i < 5; i++) {
            if (textBox.width > maxWidth || textBox.width / textBox.height > maxProportion) {
                lineCount++;
                textBox = this.splitIntoLines(text, lineCount);
            } else {
                break;
            }
        }
        return textBox;
    }

    /**
     * Splits the specified text by word into exactly n lines of almost the same length.
     *
     * @param text: the text to split into lines
     * @param lineCount: the number of lines the text should be split into.
     * @param minLineWidth: the minimum line width
     */
    splitIntoLines(text: string, lineCount: number, minLineWidth?: number): TextBox {

        const totalWidth = this.canvas.getTextWidth(text);
        let lineWidth = totalWidth / lineCount;
        if (minLineWidth) {
            lineWidth = minLineWidth;
        }

        let lines: string[];

        for (let i = 0; i < 5; i++) {
            if (!lines || lines.length > lineCount) {
                lines = this.splitIntoLinesOfLength(text, lineWidth);
                if (lines.length > lineCount) {
                    const remainingWidth = this.canvas.getTextWidth(lines[lines.length - 1]);
                    lineWidth += remainingWidth / lineCount;
                }
            } else {
                break;
            }
        }

        const actualMaxLineWidth = lines.reduce((max, line) => {
            const lineWidth = this.canvas.getTextWidth(line);
            return lineWidth > max ? lineWidth : max;
        }, 0);

        return new TextBox(lines, this.canvas.getLineHeight(), lineWidth, actualMaxLineWidth);
    }

    /**
     * Splits the specified text by word into lines not longer than the specified line width.
     *
     * @param text: the text to split into lines
     * @param lineWidth: no line will be longer than this width
     */
    splitIntoLinesOfLength(text: string, lineWidth: number): string[] {

        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        words.forEach(word => {
            if (this.canvas.getTextWidth(currentLine + " " + word) > lineWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine += " " + word;
            }
        });
        lines.push(currentLine);

        return lines;
    }
}