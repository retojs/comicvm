import { Rectangle } from "../trigo/Rectangle";
import { DomElement, DomElementContainer } from "./DomElement";

export class Img extends DomElement<HTMLImageElement> {

    domElement: HTMLImageElement;

    bounds: Rectangle;
    bitmapShape: Rectangle;

    constructor(container: DomElementContainer, src: string, width?: number, height?: number) {
        super(container);

        if (width && height) {
            this.bounds = new Rectangle(0, 0, width, height);
        }

        this.domElement = this.add(this.createImageElement(src));

        this.disableDrag();
    }

    get src(): string {
        return this.domElement.src;
    }

    set src(src: string) {
        this.domElement.src = src;
    }

    createImageElement(src: string): HTMLImageElement {
        this.domElement = document.createElement("img");
        this.domElement.src = src;

        this.onLoad = () => {
            if (!this.domElement.width) {
                console.log("Image has no size!? ", this.src);
            }
            this.bitmapShape = new Rectangle(0, 0, this.domElement.width, this.domElement.height);
            if (this.bounds) {
                const shape = Rectangle.fitIntoBounds(this.bitmapShape.clone(), this.bounds);
                this.domElement.width = shape.width;
                this.domElement.height = shape.height;
            }
        };

        return this.domElement;
    }

    set onLoad(onLoad: EventListener) {
        this.domElement.addEventListener("load", onLoad);
    }
}