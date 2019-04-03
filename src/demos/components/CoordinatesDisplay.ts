import { Div } from "../../common/dom/Div";
import { DomElementContainer } from "../../common/dom/DomElement";
import { Point } from "../../common/trigo/Point";

export class CoordinatesDisplay {

    rootDiv: Div;

    currentMousePos: Point;
    referencePoint: Point;

    // TODO extract base class "FixedDisplay" which can display any content
    content: string[];

    constructor(container: DomElementContainer) {
        this.rootDiv = new Div(container, "coordinates-display");

        document.addEventListener("mousemove", (event: MouseEvent) => {
            this.currentMousePos = new Point(event.clientX, event.clientY);
            this.updateContent();
        });

        document.addEventListener("click", (event: MouseEvent) => {
            if (event.ctrlKey) {
                this.referencePoint = null;
            } else {
                this.referencePoint = new Point(event.clientX, event.clientY);
            }
            this.updateContent();
        });
    }

    updateContent(): void {
        if (!this.currentMousePos) {
            return;
        }

        let content = `<div class="coordinates-display_section">
                         <div>mouse position: <span class="mouse-pos">(${this.currentMousePos.x}, ${this.currentMousePos.y})</span></div>
                       </div>`;
        if (this.referencePoint) {
            const distance: Point = this.referencePoint.distanceTo(this.currentMousePos);
            content += `<div class="coordinates-display_section">
                          <div class="coordinates-display_section_label">
                            distance from (${this.referencePoint.x}, ${this.referencePoint.y}):
                            <span class="distance">(${distance.x}, ${distance.y})</span>
                          </div>
                        </div>`;
        }
        if (this.content) {
            this.content.forEach(item => content += item);
        }

        this.rootDiv.setContent(content);
    }

    addContent(html: string) {
        (this.content = this.content || []).push(html);
    }

    setContent(html: string) {
        this.content = null;
        this.addContent(html);
    }
}