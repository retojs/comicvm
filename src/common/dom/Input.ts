import { DomElement, DomElementContainer } from "./DomElement";

export class Input extends DomElement<HTMLInputElement> {

    domElement: HTMLInputElement;

    constructor(container: DomElementContainer, type: string, name?: string, value?: string) {
        super(container);

        this.add(this.createInput(type, name, value));
    }

    createInput(type: string, name: string, value: string): HTMLInputElement {
        this.domElement = document.createElement("input");
        this.domElement.type = type;
        this.domElement.name = name;
        this.domElement.value = value;
        return this.domElement;
    }
}
