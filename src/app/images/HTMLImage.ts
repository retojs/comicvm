export class HTMLImage {

    src: string;

    img: HTMLImageElement;

    container: HTMLElement;

    constructor(src: string, container: HTMLElement | string) {
        this.src = src;

        this.img = this.createImageElement();

        if (container) {
            if (typeof container === "string") {
                container = document.getElementById(container);
            }
            this.container = container;
            container.appendChild(this.img);
        }
    }

    createImageElement(): HTMLImageElement {
        const img = document.createElement("img");
        img.src = this.src;
        return img;
    }
}