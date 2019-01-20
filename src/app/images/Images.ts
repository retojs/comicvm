import { ImageStore } from "./ImageStore";
import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";
import { BackendConfig } from "../backend/BackendConfig";
import { ImageQuery } from "./ImageQuery";

export class Images {

    story: string;

    images: Img[];
    imageNames: string[];
    imagesByName: { [key: string]: Img };

    private characterImageStore: ImageStore;
    private backgroundImageStore: ImageStore;

    private _backend: Endpoints;

    constructor(story: string) {
        this.story = story;
        this._backend = new Endpoints();
    }

    load(): Promise<Img[]> {
        return this._backend.getImages(this.story)
            .then(imageUrls => {
                this.imageNames = imageUrls.map(url => this.getName(url));

                this.backgroundImageStore = new ImageStore(imageUrls
                    .filter(path => path.indexOf("/background/") > -1)
                    .map(path => this.getName(path)));

                this.characterImageStore = new ImageStore(imageUrls
                    .filter(path => path.indexOf("/character/") > -1)
                    .map(path => this.getName(path)));

                return imageUrls;
            })
            .then(imageNames => Promise.all(
                imageNames.map(imageName => this.createImage(imageName))
            )).then(result => {
                this.images = result;
                this.imagesByName = {};
                this.imageNames.forEach(name =>
                    this.imagesByName[name] = this.images.find(img =>
                        this.getName(img.src).indexOf(name) > -1
                    )
                );
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

    chooseBackgroundImage(query: ImageQuery): Img {
        const imageName = this.backgroundImageStore.getBestMatchImageName(query);
        return this.getImage(imageName);
    }

    chooseCharacterImage(query: ImageQuery): Img {
        const imageName = this.characterImageStore.getBestMatchImageName(query);
        return this.getImage(imageName);
    }

    getImage(name: string): Img {
        return this.imagesByName[name];
    }

    /**
     * chops the filename from a path and returns it.
     *
     * @param path
     */
    getName(path: string): string {
        return path.substr(path.lastIndexOf('/') + 1);
    }
}