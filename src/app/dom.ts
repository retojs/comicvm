export class Button {

    private button: HTMLElement;
    private container: HTMLElement;

    constructor(
        private label: string,
        container: HTMLElement | string,
        private eventListener: EventListener) {

        if (typeof container === "string") {
            this.container = document.getElementById(container);
        }

        this.createButton();
    }

    createButton() {
        this.button = document.createElement("button");
        this.button.innerText = this.label;
        this.button.addEventListener("click", this.eventListener);
        this.container.appendChild(this.button);
    }

    setLabel(label: string) {
        this.label = label;
        this.button.innerText = this.label;
    }
}