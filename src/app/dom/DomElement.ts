export type DomElementContainer = HTMLElement | DomElement<HTMLElement> | string;

export abstract class DomElement<T extends HTMLElement> {

    abstract domElement: T;

    container: HTMLElement;

    constructor(container: DomElementContainer) {
        if (container) {
            if (typeof container === "string") {
                container = document.getElementById(container);
            } else if (container instanceof DomElement) {
                container = container.domElement;
            }
            this.container = container;
        }
    }

    add<T extends HTMLElement>(element: T): T {
        if (this.container) {
            this.container.appendChild(element);
        }

        return element;
    }

    set content(innerHTML: string) {
        if (innerHTML) {
            this.domElement.innerHTML = innerHTML;
        }
    }

    clearContent() {
        this.domElement.innerHTML = '';
    }

    set class(styleClass: string) {
        if (styleClass) {
            this.domElement.classList.add(styleClass);
        }
    }

    removeClass(styleClass: string) {
        this.domElement.classList.remove(styleClass);
    }

    set onClick(onClick: EventListener) {
        this.domElement.addEventListener("click", onClick);
    }

    set onDblClick(onDblClick: EventListener) {
        this.domElement.addEventListener("dblclick", onDblClick);
    }

    set onMouseDown(onMouseDown: EventListener) {
        this.domElement.addEventListener("mousedown", onMouseDown);
    }

    set onMouseUp(onMouseUp: EventListener) {
        this.domElement.addEventListener("mouseup", onMouseUp);
    }

    set onMouseMove(onMouseMove: EventListener) {
        this.domElement.addEventListener("mousemove", onMouseMove);
    }

    set onMouseEnter(onMouseEnter: EventListener) {
        this.domElement.addEventListener("mouseenter", onMouseEnter);
    }

    set onMouseLeave(onMouseLeave: EventListener) {
        this.domElement.addEventListener("mouseleave", onMouseLeave);
    }

    set onChange(onChange: EventListener) {
        this.domElement.addEventListener("change", onChange);
    }

    set onKeyUp(onKeyUp: EventListener) {
        this.domElement.addEventListener("keyup", onKeyUp);
    }

    set onDrop(onDrop: EventListener) {

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