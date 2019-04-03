import { DomElement, DomElementContainer } from "./DomElement";

export  type DivContentItem = (DomElement<HTMLElement> | string);
export  type DivContent = DivContentItem | DivContentItem[];

export class Div extends DomElement<HTMLDivElement> {

    domElement: HTMLDivElement;

    constructor(container: DomElementContainer,
                styleClass?: string,
                content?: DivContent
    ) {
        super(container);
        this.domElement = this.add(this.createDivElement(styleClass, content));
    }

    createDivElement(styleClass: string, content?: DivContent): HTMLDivElement {
        this.domElement = document.createElement("div");
        this.class = styleClass;
        if (content) {
            if (Array.isArray(content)) {
                content.forEach(item => this.addContent(item))
            } else {
                this.addContent(content);
            }
        }
        return this.domElement;
    }

    appendDiv(styleClass?: string, innerHTML?: string): Div {
        this.domElement.appendChild(new Div(this, styleClass, innerHTML).domElement);
        return this;
    }
}