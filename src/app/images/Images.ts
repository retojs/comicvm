import { ImageStore } from "./ImageStore";
import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";
import { BackendConfig } from "../backend/BackendConfig";

export class Images {

    story: string;

    imageStore: ImageStore;
    images: Img[];

    private _backend: Endpoints;

    constructor(story: string) {
        this.story = story;
        this._backend = new Endpoints();
    }

    load(): Promise<Img[]> {
        return this._backend.getImages(this.story)
            .then(imageNames => {
                this.imageStore = new ImageStore(imageNames);
                return imageNames;
            })
            .then(imageNames => Promise.all(
                imageNames.map(imageName => this.createImage(imageName))
            )).then(result => {
                this.images = result;
                return result;
            });
    }

    createImage(imageName: string): Promise<Img> {
        return new Promise((resolve) => {
            const img = new Img(null, BackendConfig.baseURL + imageName);
            img.domElement.onload = () => {
                resolve(img);
            };
        })
    }
}