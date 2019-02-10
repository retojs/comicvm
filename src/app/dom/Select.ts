import { DomElement, DomElementContainer } from "./DomElement";

export class Select extends DomElement<HTMLSelectElement> {

    domElement: HTMLSelectElement;

    constructor(container: DomElementContainer, options?: string[]) {
        super(container);
        this.add(this.createSelect(options));
    }

    createSelect(options?: string[]): HTMLSelectElement {
        this.domElement = document.createElement("select");
        this.options = options;
        return this.domElement;
    }

    set options(options: string[]) {
        this.domElement.innerHTML = (options || [])
            .map(option => `<option value="${option}">${option}</option>`)
            .join('');
    }

    get selectedOption(): string {
        return this.domElement.options[this.domElement.selectedIndex].value;
    }

    set selectedOption(option: string) {
        this.domElement.value = option;
    }
}
