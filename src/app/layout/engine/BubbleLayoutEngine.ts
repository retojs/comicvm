import { Canvas } from "../../../common/dom/Canvas";
import { Panel } from "../../model/Panel";
import { LayoutConfig } from "../Layout.config";
import { Rectangle } from "../../../common/trigo/Rectangle";
import { Bubble } from "../../model/Bubble";
import { TextBox } from "../../model/TextBox";

export class BubbleLayoutEngine {

    private canvas: Canvas;

    layout(panels: Panel[], canvas: Canvas) {
        panels
            .filter(panel => !!panel.shape && panel.shape.width > 0 && panel.shape.height > 0)
            .filter(panel => !!panel.bubbles && panel.bubbles.length > 0)
            .forEach(panel => this.layoutPanel(panel, canvas));
    }

    layoutPanel(panel: Panel, canvas: Canvas) {
        this.canvas = canvas;
        this.createBubbleShapes(panel);
        this.layoutOffscreenBubble(panel);
        this.layoutBubblesIntoLines(panel);
    }

    private createBubbleShapes(panel: Panel): void {
        panel.bubbles.forEach(bubble => {
            const availableLineWidth = panel.shape.width - LayoutConfig.panel.padding.horizontal - LayoutConfig.bubble.padding.horizontal;
            bubble.textBox = this.layoutTextBox(
                bubble.says,
                availableLineWidth,
                (bubble.isOffScreen ? 2 : 1) * LayoutConfig.bubble.maxWithPerHeight
            );
            bubble.shape = new Rectangle(
                0,
                0,
                bubble.textBox.width + LayoutConfig.bubble.padding.horizontal,
                bubble.textBox.height + LayoutConfig.bubble.padding.vertical);
        });
    }

    private layoutOffscreenBubble(panel: Panel): void {
        if (panel.offScreenBubble) {
            panel.offScreenBubble.shape.x = panel.shape.x + LayoutConfig.panel.padding.left;
            panel.offScreenBubble.shape.y = panel.shape.y + LayoutConfig.panel.padding.top;
        }
    }

    layoutBubblesIntoLines(panel: Panel): Bubble[][] {

        let availableWidth = panel.shape.width - LayoutConfig.panel.padding.horizontal;
        let nextLine: Bubble[] = [];
        let bubbleLines: Bubble[][] = [nextLine];

        panel.bubbles
            .filter(bubble => !bubble.isOffScreen)
            .forEach(bubble => {
                if (availableWidth >= bubble.shape.width) {
                    nextLine.push(bubble);
                    availableWidth -= bubble.shape.width + LayoutConfig.bubble.margin.right;
                } else {
                    nextLine = [bubble];
                    bubbleLines.push(nextLine);
                }
            });

        return this.alignBubbles(bubbleLines, panel);
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

        const panelBounds = panel.shape.clone().cutMargin(LayoutConfig.panel.padding);
        let y = getInitialVerticalOffset();
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

        function getInitialVerticalOffset() {
            let y = -LayoutConfig.bubble.margin.top; // no bubble margin between panel border and bubble
            if (panel.offScreenBubble) {
                y += panel.offScreenBubble.shape.height + LayoutConfig.panel.padding.top;
            }
            return y;
        }
    }

    private allignBubblesLeft(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x - LayoutConfig.bubble.margin.left,
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    private allignBubblesRight(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x + LayoutConfig.bubble.margin.left + (container.width - this.getBubbleLineWidth(bubbleLine)),
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
            bubble.shape.x = x + LayoutConfig.bubble.margin.left;
            bubble.shape.y = y + LayoutConfig.bubble.margin.top;
            x += bubble.shape.width + LayoutConfig.bubble.margin.right + Math.max(0, gapWidth);
        });
    }

    private setBubbleLinePosition(bubbleLine: Bubble[], x: number, y: number) {
        bubbleLine.forEach(bubble => {
            bubble.shape.x = x + LayoutConfig.bubble.margin.left;
            bubble.shape.y = y + LayoutConfig.bubble.margin.top;
            x += bubble.shape.width + LayoutConfig.bubble.margin.right;
        });
    }

    private getBubbleLineWidth(bubbles: Bubble[]): number {
        return bubbles.reduce((width, bubble) => {
            return width + bubble.shape.width + LayoutConfig.bubble.margin.right;
        }, LayoutConfig.bubble.margin.left);
    }

    private getBubbleLineHeight(bubbles: Bubble[]): number {
        return bubbles.reduce((height, bubble) => {
            const h = bubble.shape.height + LayoutConfig.bubble.margin.bottom;
            return height > h ? height : h;
        }, LayoutConfig.bubble.margin.top);
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