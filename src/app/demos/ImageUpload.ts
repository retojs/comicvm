import { Div } from "../dom/Div";
import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";

export class ImageUpload {

    rootDiv: Div;
    text: Div;

    story: string;
    backend: Endpoints;
    isForBackgroundImages: boolean;

    constructor(container: HTMLElement | string, story: string, backend: Endpoints, isForBackgroundImages: boolean) {
        this.rootDiv = new Div(container);
        this.backend = backend;
        this.story = story;
        this.isForBackgroundImages = isForBackgroundImages;

        this.domElement.style.display = "inline-block";
        this.domElement.style.width = "35%";
        this.domElement.style.border = "2px solid PaleTurquoise";
        this.domElement.style.borderRadius = "3px";
        this.domElement.style.backgroundColor = "PaleTurquoise";
        this.domElement.style.textAlign = "center";
        this.domElement.style.padding = "30px 60px";
        this.domElement.style.margin = "5px";
        this.domElement.style.cursor = "pointer";

        this.rootDiv.onHover(
            () => this.domElement.style.border = "2px solid Teal",
            () => this.domElement.style.border = "2px solid PaleTurquoise"
        );

        this.rootDiv.onDrop((event: DragEvent) => {
            return this.uploadDroppedImages(event, this.isForBackgroundImages)
                .then(files => this.insertImages(files, this.isForBackgroundImages));

        });

        this.text = new Div(this.domElement, `<h2>Drop more ${this.isForBackgroundImages ? 'background' : 'character'} images here</h2>`);
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
                uploadPromises.push(this.backend.uploadBackgroundImage(images[i], this.story));
            } else {
                uploadPromises.push(this.backend.uploadCharacterImage(images[i], this.story));
            }
        }

        return Promise.all(uploadPromises).then(function () {
            return images;
        });
    }

    insertImages(images: File[], isBackground: boolean): void {
        images.forEach(image => {
            if (isBackground) {
                new Img(this.rootDiv.container, this.backend.getBackgroundImageUrl(this.story, image.name), 500, 300);
            } else {
                new Img(this.rootDiv.container, this.backend.getCharacterImageUrl(this.story, image.name), 100, 120);
            }
        });
    }
}