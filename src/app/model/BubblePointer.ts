import { Point } from "../../common/trigo/Point";
import { Bubble } from "./Bubble";
import { Character } from "./Character";
import { Line } from "../../common/trigo/Line";
import { LayoutConfig } from "../layout/Layout.config";

export class BubblePointer {

    characterEnd?: Point;
    bubbleEnd?: Point;

    bubbleEndLeft?: Point;
    bubbleEndRight?: Point;

    cpLeft?: Point;
    cpRight?: Point;

    fromCharacterToBubbleCenter: Line;
    distance: Point;
    configuredDistance: Point;

    constructor(
        public bubble: Bubble,
        public character: Character,
        public layoutConfig: LayoutConfig = new LayoutConfig()
    ) {
        this.calculate();
    }

    calculate() {
        this.calculateEnds();
        this.calculateControlPoints();
    }

    calculateEnds() {
        const characterPos = this.character.getPosition();

        // The pointer is attached to the bubble at that point
        // where the line from the character's top center
        // to the center of the bubble
        // intersects the bubble's lower border.

        this.characterEnd = new Point(characterPos.x + characterPos.size / 2, characterPos.y);
        this.fromCharacterToBubbleCenter = new Line(this.characterEnd, this.bubble.shape.center);
        this.bubbleEnd = this.fromCharacterToBubbleCenter.intersection(new Line(this.bubble.shape.bottomLeft, this.bubble.shape.bottomRight));

        if (this.bubbleEnd == null) {
            return;
        }

        // The pointer also has to stay connected to the bubble
        // so if that line does not intersect the bubble's lower border
        //  then the pointer's bubble end is moved closer to the bubble

        this.bubbleEnd.constrainX(this.bubble.shape.clone()
            .cutMargin(this.layoutConfig.bubble.padding)
            .cutMarginOf(this.layoutConfig.bubble.pointer.bubbleEndsDistance / 2)
        );

        // the actual end of the pointer near the character is a configured proportion of that line from the character to the bubble

        this.distance = this.bubbleEnd.distanceTo(this.characterEnd);

        if (this.distance.y < 0) {
            console.log("not painting pointer because ", this.distance.y, this.distance);
            return null; // don't paint a pointer if bubble overlaps character
        }

        this.configuredDistance = this.distance.clone().scale(this.layoutConfig.bubble.pointer.characterEndDistance);
        this.characterEnd.translateBy(this.configuredDistance.clone().invert());

        // move the bubble ends to have the configured distance

        this.bubbleEndLeft = this.bubbleEnd.clone().translate(-this.layoutConfig.bubble.pointer.bubbleEndsDistance / 2);
        this.bubbleEndRight = this.bubbleEnd.clone().translate(this.layoutConfig.bubble.pointer.bubbleEndsDistance / 2);
    }

    calculateControlPoints() {
        if (this.bubbleEndLeft == null || this.bubbleEndRight == null) {
            return;
        }

        const horizontalOffset = this.distance.x * this.layoutConfig.bubble.pointer.controlPoint.horizontalOffset;
        const verticalOffset = this.distance.y * this.layoutConfig.bubble.pointer.controlPoint.verticalOffset;
        const deltaWidth = this.layoutConfig.bubble.pointer.bubbleEndsDistance - this.layoutConfig.bubble.pointer.controlPoint.width;

        this.cpLeft = this.bubbleEndLeft.clone().translate(horizontalOffset + deltaWidth / 2, verticalOffset);
        this.cpRight = this.bubbleEndRight.clone().translate(horizontalOffset - deltaWidth / 2, verticalOffset);
    }
}
