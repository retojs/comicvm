import { Canvas } from "../../dom/Canvas";
import { Panel } from "../../model/Panel";
import { LayoutConfig } from "../Layout.config";
import { Rectangle } from "../../trigo/Rectangle";
import { Bubble } from "../../model/Bubble";
import { TextBox } from "../../model/TextBox";

export class TextLayoutEngine {

    private canvas: Canvas;

    layout(panels: Panel[], canvas: Canvas) {
        this.canvas = canvas;

        panels.filter(panel => !!panel.bubbles && panel.bubbles.length > 0)
            .forEach(panel => this.layoutPanelBubbles(panel));
    }

    layoutPanelBubbles(panel: Panel): Bubble[][] {

        panel.bubbles.forEach(bubble => {
            const availableLineWidth = panel.shape.width - LayoutConfig.panel.padding.horizontal - LayoutConfig.bubble.padding.horizontal;
            bubble.textBox = this.layoutTextBox(bubble.says, availableLineWidth, LayoutConfig.bubble.maxWithPerHeight);
            bubble.shape = new Rectangle(
                0,
                0,
                bubble.textBox.width + LayoutConfig.bubble.padding.horizontal,
                bubble.textBox.height + LayoutConfig.bubble.padding.vertical);
        });

        return this.layoutBubblesIntoLines(panel);
    }

    layoutBubblesIntoLines(panel: Panel): Bubble[][] {

        let availableWidth = panel.shape.width - LayoutConfig.panel.padding.horizontal;
        let nextLine: Bubble[] = [];
        let bubbleLines: Bubble[][] = [nextLine];

        panel.bubbles.forEach(bubble => {
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

    alignBubbles(bubbleLines: Bubble[][], panel: Panel): Bubble[][] {

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
        let y = -LayoutConfig.bubble.margin.top;
        bubbleLines.forEach((bubbleLine, index) => {
            if (alignLeftRight) {
                if (index % 2) {
                    this.allignBubblesRight(bubbleLine, panelBounds, y);
                } else {
                    this.allignBubblesLeft(bubbleLine, panelBounds, y);
                }
            } else {
                this.allignBubblesCentered(bubbleLine, panelBounds, y);
            }
            y += this.getBubbleLineHeight(bubbleLine);
        });

        return bubbleLines;
    }

    allignBubblesLeft(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x - LayoutConfig.bubble.margin.left,
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    allignBubblesRight(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x + LayoutConfig.bubble.margin.left + (container.width - this.getBubbleLineWidth(bubbleLine)),
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    allignBubblesCentered(bubbleLine: Bubble[], container: Rectangle, verticalOffset: number) {
        let x = container.x + (container.width - this.getBubbleLineWidth(bubbleLine)) / 2,
            y = container.y + verticalOffset;
        this.setBubbleLinePosition(bubbleLine, x, y);
    }

    setBubbleLinePosition(bubbleLine: Bubble[], x: number, y: number) {
        bubbleLine.forEach(bubble => {
            bubble.shape.x = x + LayoutConfig.bubble.margin.left;
            bubble.shape.y = y + LayoutConfig.bubble.margin.top;
            x += bubble.shape.width + LayoutConfig.bubble.margin.right
        });
    }

    getBubbleLineWidth(bubbles: Bubble[]): number {
        return bubbles.reduce((width, bubble) => {
            return width + bubble.shape.width + LayoutConfig.bubble.margin.right;
        }, LayoutConfig.bubble.margin.left);
    }

    getBubbleLineHeight(bubbles: Bubble[]): number {
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
        while (textBox.width > maxWidth || textBox.width / textBox.height > maxProportion) {
            lineCount++;
            textBox = this.splitIntoLines(text, lineCount); //,textBox.width > maxWidth ? maxWidth : undefined);
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

        while (!lines || lines.length > lineCount) {
            lines = this.splitIntoLinesOfLength(text, lineWidth);
            if (lines.length > lineCount) {
                const remainingWidth = this.canvas.getTextWidth(lines[lines.length - 1]);
                lineWidth += remainingWidth / lineCount;
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