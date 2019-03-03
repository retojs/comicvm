import { Div } from "../dom/Div";
import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";
import { DomElementContainer } from "../dom/DomElement";
import { ImageType } from "../images/ImageType";

export class ImageUpload {

    rootDiv: Div;
    text: Div;

    story: string;
    imageType: ImageType;

    private _backend: Endpoints;

    constructor(container: DomElementContainer, story: string, imageType: ImageType) {
        this.rootDiv = new Div(container, "image-upload-component");
        this.story = story;
        this.imageType = imageType;
        this._backend = new Endpoints();

        this.rootDiv.onDrop = ((event: DragEvent) => {
            return this.uploadDroppedImages(event, this.imageType)
                .then(files => this.insertImages(files, this.imageType));
        });

        this.text = new Div(this.domElement, "", `<h2>Drop more ${this.imageType} images here</h2>`);
    }

    get domElement(): HTMLDivElement {
        return this.rootDiv.domElement;
    }

    uploadDroppedImages(event: DragEvent, imageType: ImageType): Promise<File[]> {
        if (!event || !event.dataTransfer || !event.dataTransfer.files) { return Promise.reject("no files"); }

        const images = [];
        const uploadPromises = [];

        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            images[i] = event.dataTransfer.files.item(i);
            if (imageType === ImageType.Background) {
                uploadPromises.push(this._backend.uploadBackgroundImage(images[i], this.story));
            } else {
                uploadPromises.push(this._backend.uploadCharacterImage(images[i], this.story));
            }
        }

        return Promise.all(uploadPromises).then(function () {
            return images;
        });
    }

    insertImages(images: File[], imageType: ImageType): void {
        images.forEach(image => {
            if (imageType === ImageType.Background) {
                new Img(this.rootDiv.container, this._backend.getBackgroundImageUrl(this.story, image.name), 500, 300);
            } else {
                new Img(this.rootDiv.container, this._backend.getCharacterImageUrl(this.story, image.name), 100, 120);
            }
        });
    }
}