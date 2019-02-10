import { Div } from "../dom/Div";
import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";
import { DomElementContainer } from "../dom/DomElement";

export class ImageUpload {

    rootDiv: Div;
    text: Div;

    story: string;
    isForBackgroundImages: boolean;

    private _backend: Endpoints;

    constructor(container: DomElementContainer, story: string, isForBackgroundImages: boolean) {
        this.rootDiv = new Div(container);
        this.story = story;
        this.isForBackgroundImages = isForBackgroundImages;
        this._backend = new Endpoints();

        this.domElement.style.display = "inline-block";
        this.domElement.style.width = "35%";
        this.domElement.style.border = "2px solid PaleTurquoise";
        this.domElement.style.borderRadius = "3px";
        this.domElement.style.backgroundColor = "PaleTurquoise";
        this.domElement.style.textAlign = "center";
        this.domElement.style.padding = "30px 60px";
        this.domElement.style.margin = "5px";
        this.domElement.style.cursor = "pointer";

        this.rootDiv.onMouseEnter = () => this.domElement.style.border = "2px solid Teal";
        this.rootDiv.onMouseLeave = () => this.domElement.style.border = "2px solid PaleTurquoise";

        this.rootDiv.onDrop = ((event: DragEvent) => {
            return this.uploadDroppedImages(event, this.isForBackgroundImages)
                .then(files => this.insertImages(files, this.isForBackgroundImages));
        });

        this.text = new Div(this.domElement, "",`<h2>Drop more ${this.isForBackgroundImages ? 'background' : 'character'} images here</h2>`);
    }

    get domElement(): HTMLDivElement {
        return this.rootDiv.domElement;
    }

    uploadDroppedImages(event: DragEvent, isBackground: boolean): Promise<File[]> {
        if (!event || !event.dataTransfer || !event.dataTransfer.files) { return Promise.reject("no files"); }

        const images = [];
        const uploadPromises = [];

        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            images[i] = event.dataTransfer.files.item(i);
            if (isBackground) {
                uploadPromises.push(this._backend.uploadBackgroundImage(images[i], this.story));
            } else {
                uploadPromises.push(this._backend.uploadCharacterImage(images[i], this.story));
            }
        }

        return Promise.all(uploadPromises).then(function () {
            return images;
        });
    }

    insertImages(images: File[], isBackground: boolean): void {
        images.forEach(image => {
            if (isBackground) {
                new Img(this.rootDiv.container, this._backend.getBackgroundImageUrl(this.story, image.name), 500, 300);
            } else {
                new Img(this.rootDiv.container, this._backend.getCharacterImageUrl(this.story, image.name), 100, 120);
            }
        });
    }
}