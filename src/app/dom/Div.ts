import { DomElement, DomElementContainer } from "./DomElement";

export class Div extends DomElement<HTMLDivElement> {

    domElement: HTMLDivElement;

    constructor(container: DomElementContainer, styleClass?: string, innerHTML?: string,) {
        super(container);
        this.domElement = this.add(this.createDivElement(styleClass, innerHTML));
    }

    createDivElement(styleClass: string, innerHTML: string): HTMLDivElement {
        this.domElement = document.createElement("div");
        this.class = styleClass;
        this.content = innerHTML;
        return this.domElement;
    }

    appendDiv(styleClass?: string, innerHTML?: string): Div {
        this.domElement.appendChild(new Div(this, styleClass, innerHTML).domElement);
        return this;
    }
}