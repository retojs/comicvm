import { DomElement, DomElementContainer } from "./DomElement";

export class TextArea extends DomElement<HTMLTextAreaElement> {

    domElement: HTMLTextAreaElement;

    constructor(container: DomElementContainer, cols?: number, rows?: number) {
        super(container);
        this.domElement = this.add(this.createTextAreaElement(cols, rows));
    }

    createTextAreaElement(cols?: number, rows?: number): HTMLTextAreaElement {
        this.domElement = document.createElement("textarea");
        this.domElement.cols = cols;
        this.domElement.rows = rows;
        return this.domElement;
    }

    setText(text: string) {
        this.domElement.innerHTML = text;
    }
}