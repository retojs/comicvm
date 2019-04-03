import { DomElement, DomElementContainer } from "./DomElement";

export class Heading extends DomElement<HTMLHeadingElement> {

    domElement: HTMLHeadingElement;

    constructor(container: DomElementContainer, level: number, text: string) {
        super(container);
        this.domElement = this.add(this.createLabelElement(level, text));
    }

    createLabelElement(level: number, text: string): HTMLHeadingElement {
        this.domElement = document.createElement("h" + level) as HTMLHeadingElement;
        this.domElement.innerHTML = text;
        return this.domElement;
    }

    set text(text: string) {
        this.domElement.innerHTML = text;
    }
}