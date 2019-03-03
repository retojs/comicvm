import { DomElementContainer } from "../dom/DomElement";
import { Div } from "../dom/Div";
import { Img } from "../dom/Img";
import { ResizableDiv } from "./ResizableDiv";
import { Rectangle } from "../trigo/Rectangle";

export class ImageEditor {
    // displays a character image in a panel with a character
    // you can drag'n drop the image and store the position relative to the character.

    // resize library: http://interactjs.io/docs/#

    root: Div;
    img: Img;
    characterPlaceholder: Div;
    characterSize: number;

    constructor(container: DomElementContainer, imageUrl?: string) {
        this.root = new Div(container, "image-editor-component");
        this.characterPlaceholder = new ResizableDiv(this.root, "character-placeholder");
        this.img = new Img(this.root, imageUrl);

        this.img.class = "character-image";
        this.img.onLoad = () => {
            this.characterSize = Math.min(this.img.shape.width, this.img.shape.height);
            const rootShape = this.root.shape;
            this.characterPlaceholder.shape = new Rectangle(
                (rootShape.width - this.characterSize) / 2,
                (rootShape.height - this.characterSize) / 2,
                this.characterSize,
                this.characterSize
            )
        };
        this.img.disableDrag();
    }
}