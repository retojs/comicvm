import { DomElement } from "./DomElement";

export class Div extends DomElement<HTMLDivElement> {

    domElement: HTMLDivElement;

    innerHTML: string;
    width: string;
    height: string;

    constructor(container: HTMLElement | string, innerHTML?: string, width?: string, height?: string) {
        super(container);

        this.innerHTML = innerHTML || '';
        this.width = width;
        this.height = height;

        this.domElement = this.append(this.createDivElement());
    }

    createDivElement(): HTMLDivElement {
        this.domElement = document.createElement("div");
        this.domElement.innerHTML = this.innerHTML;
        this.domElement.style.width = this.width;
        this.domElement.style.minHeight = this.height;
        return this.domElement;
    }
}