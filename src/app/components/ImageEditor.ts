import { DomElementContainer } from "../dom/DomElement";
import { Div } from "../dom/Div";
import { Img } from "../dom/Img";
import { ResizableDiv } from "./ResizableDiv";
import { Rectangle } from "../trigo/Rectangle";
import { Images } from "../images/Images";
import { Square } from "../trigo/Square";
import { Button } from "../dom/Button";


/**
 * A tool to define where and how large a character's image should be drawn relative to the character.
 * The onSizeChange event returns a string encoding that information which can be stored as part of the image name.
 */
export class ImageEditor extends Div {

    image: Img;
    imageContainer: Div;
    characterPlaceholder: ResizableDiv;
    characterSize: Rectangle;
    resetSizeButton: Button;

    private source: HTMLImageElement;

    private onSizeChangeHandler: (sizeString: string) => void = () => {};
    private onResetSizeHandler: () => void = () => {};

    constructor(container: DomElementContainer, imageUrl?: string) {
        super(container, "image-editor-component");

        this.imageContainer = new Div(this);
        this.createImageElement(imageUrl);
        this.disableDrag();

        this.characterPlaceholder = new ResizableDiv(this, "character-placeholder");
        this.characterPlaceholder.onSizeChange = (size: Rectangle) => {
            size.translateInvert(...this.image.parentOffset);
            this.onSizeChangeHandler(Images.getCharacterSizeString(size, this.image));
        };

        this.resetSizeButton = new Button(this, "Reset size", () => {
            this.resetSize();
            this.onResetSizeHandler();
        });
    }

    get sourceImage(): HTMLImageElement {
        return this.source;
    }

    set sourceImage(source: HTMLImageElement) {
        this.source = source;
        this.createImageElement(source.src);
    }

    createImageElement(imageUrl: string) {
        if (this.image) {
            this.image.domElement.remove();
        }
        this.image = new Img(this.imageContainer, imageUrl);
        this.image.class = "character-image";
        this.image.onLoad = () => {
            this.characterSize = Images.getCharacterSize(this.image).translate(...this.image.parentOffset);

            if (this.characterSize.width > 0) {
                this.characterPlaceholder.shape = this.characterSize;
            } else {
                this.resetSize();
            }
        };
        this.image.disableDrag();
    }

    set onSizeChange(onSizeChange: (sizeString: string) => void) {
        this.onSizeChangeHandler = onSizeChange;
    }

    set onResetSize(onResetSize: () => void) {
        this.onResetSizeHandler = onResetSize;
    }

    resetSize() {
        const borderWidth = parseInt(this.image.borderWidth);
        console.log("image border width ", borderWidth);

        this.characterSize = Rectangle.fitIntoBounds(
            new Square(0, 0, 1),
            this.image.bitmapShape
        ).translate(...this.image.parentOffset)
            .translate(borderWidth, borderWidth);

        this.characterPlaceholder.shape = this.characterSize;
    }
}