import { DomElement } from "./DomElement";

export class Button extends DomElement<HTMLButtonElement> {

    domElement: HTMLButtonElement;

    label: string;
    eventListener: EventListener;

    constructor(container: HTMLElement | string, label: string, eventListener: EventListener) {
        super(container);

        this.label = label;
        this.eventListener = eventListener;

        this.append(this.createButton());
    }

    createButton(): HTMLButtonElement {
        this.domElement = document.createElement("button");
        this.domElement.innerText = this.label;
        this.domElement.addEventListener("click", this.eventListener);
        return this.domElement;
    }

    setLabel(label: string) {
        this.label = label;
        this.domElement.innerText = this.label;
    }
}
