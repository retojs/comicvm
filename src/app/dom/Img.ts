import { Rectangle } from "../trigo/Rectangle";
import { DomElement, DomElementContainer } from "./DomElement";

export class Img extends DomElement<HTMLImageElement> {

    domElement: HTMLImageElement;

    src: string;

    bounds: Rectangle;
    bitmapShape: Rectangle;

    constructor(container: DomElementContainer, src: string, width?: number, height?: number) {
        super(container);

        this.src = src;

        if (width && height) {
            this.bounds = new Rectangle(0, 0, width, height);
        }

        this.domElement = this.add(this.createImageElement());

        this.disableDrag();
    }

    createImageElement(): HTMLImageElement {
        this.domElement = document.createElement("img");
        this.domElement.src = this.src;

        this.onLoad = () => {
            if (!this.domElement.width) {
                console.log("Image has no size! ", this.src);
            }
            this.bitmapShape = new Rectangle(0, 0, this.domElement.width, this.domElement.height);
            let shape = this.bitmapShape;
            if (this.bounds) {
                shape = Rectangle.fitIntoBounds(this.bitmapShape.clone(), this.bounds);
            }
            this.domElement.width = shape.width;
            this.domElement.height = shape.height;
        };

        return this.domElement;
    }

    set onLoad(onLoad: EventListener) {
        this.domElement.addEventListener("load", onLoad);
    }
}