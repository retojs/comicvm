import { DomElement } from "./DomElement";

export class TextArea extends DomElement<HTMLTextAreaElement> {

    domElement: HTMLTextAreaElement;

    cols: number;
    rows: number;

    constructor(container: HTMLElement | string, cols?: number, rows?: number) {
        super(container);

        this.cols = cols;
        this.rows = rows;

        this.domElement = this.append(this.createTextAreaElement());
    }

    createTextAreaElement(): HTMLTextAreaElement {
        this.domElement = document.createElement("textarea");
        this.domElement.cols = this.cols;
        this.domElement.rows = this.rows;
        return this.domElement;
    }

    setText(text: string) {
        this.domElement.innerHTML = text;
    }
}