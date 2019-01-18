export abstract class DomElement<T extends HTMLElement> {

    abstract domElement: T;

    container: HTMLElement;

    constructor(container: HTMLElement | string) {
        if (container) {
            if (typeof container === "string") {
                container = document.getElementById(container);
            }
            this.container = container;
        }
    }

    append<T extends HTMLElement>(element: T): T {
        if (this.container) {
            this.container.appendChild(element);
        }

        return element;
    }

    onClick(onClick: EventListener): void {
        this.domElement.addEventListener("click", onClick);
    }

    onHover(onMouseEnter: EventListener, onMouseLeave: EventListener): void {
        this.domElement.addEventListener("mouseenter", onMouseEnter);
        this.domElement.addEventListener("mouseleave", onMouseLeave);
    }

    onDrop(onDrop: EventListener): void {

        this.domElement.ondragover = (event: DragEvent) => {
            if (isFileDragged(event)) {
                event.preventDefault(); // prerequisite for the drop event to be called
            }
        };

        this.domElement.ondragenter = (event: DragEvent) => {
            if (isFileDragged(event)) {
                event.preventDefault(); // prerequisite for the drop event to be called
            }
        };

        this.domElement.ondrop = (event: DragEvent) => {
            if (event.stopPropagation) {
                event.stopPropagation(); // stops the browser from redirecting.
            }
            onDrop(event);
            return false; // stops the browser from redirecting.
        };

        function isFileDragged(event: DragEvent) {
            return event && event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.indexOf("Files") > -1;
        }
    }

    disableDrag() {
        this.domElement.ondragstart = (event: DragEvent) => {
            event.preventDefault();
        }
    }
}