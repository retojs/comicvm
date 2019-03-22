import { DomElement, DomElementContainer } from "./DomElement";

export class Button extends DomElement<HTMLButtonElement> {

    domElement: HTMLButtonElement;

    constructor(container: DomElementContainer, label: string, onClick?: EventListener) {
        super(container);

        this.add(this.createButton(label));

        this.onClick = onClick;
    }

    createButton(label: string): HTMLButtonElement {
        this.domElement = document.createElement("button");
        this.domElement.innerText = label;
        return this.domElement;
    }

    set label(label: string) {
        this.domElement.innerText = label;
    }
}
