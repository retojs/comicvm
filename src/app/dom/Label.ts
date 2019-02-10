import { DomElement, DomElementContainer } from "./DomElement";

export class Label extends DomElement<HTMLLabelElement> {

    domElement: HTMLLabelElement;

    constructor(container: DomElementContainer, label: string, htmlFor?: string) {
        super(container);
        this.domElement = this.add(this.createLabelElement(label, htmlFor));
    }

    createLabelElement(label: string, htmlFor?: string): HTMLLabelElement {
        this.domElement = document.createElement("label");
        this.domElement.innerHTML = label;
        if (htmlFor) {
            this.domElement.htmlFor = htmlFor;
        }
        return this.domElement;
    }
}