import { DomElement } from "./DomElement";

export class TextArea extends DomElement<HTMLTextAreaElement> {

    static style: any = {
        padding: "12px 24px",
        font: "16px Roboto"
    };

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

        this.domElement.style.padding = TextArea.style.padding;
        this.domElement.style.font = TextArea.style.font;

        return this.domElement;
    }

    setText(text: string) {
        this.domElement.innerHTML = text;
    }
}