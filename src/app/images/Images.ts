import { ImageStore } from "./ImageStore";
import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";
import { BackendConfig } from "../backend/Backend.config";
import { ImageQuery } from "./ImageQuery";
import { Rectangle } from "../trigo/Rectangle";
import { Square } from "../trigo/Square";

export const SIZE_STRING_REG_EXP = /_x=-?\d*y=-?\d*size=\d*/;

export class Images {

    story: string;

    images: Img[];
    imageNames: string[];
    imagesByName: { [key: string]: Img } = {};
    imagePaths: string[];

    private characterImageStore = new ImageStore([]);
    private backgroundImageStore = new ImageStore([]);

    private _backend: Endpoints;

    /**
     * Generates strings like '_x=70y=30size=155' for an image and a rectangle.
     *
     * @param size
     * @param img
     */
    static getCharacterSizeString(size: Rectangle, img: Img): string {
        const scale = img.domElement.naturalWidth / img.domElement.width;
        const xPx = Math.round(size.x * scale);
        const yPx = Math.round(size.y * scale);
        const sizePx = Math.round(size.width * scale);
        return `_x=${xPx}y=${yPx}size=${sizePx}`;
    }

    /**
     * Returns the character size relative to the specified image
     *
     * @param img
     */
    static getCharacterSize(img: Img): Square {
        const scale = img.domElement.width / img.domElement.naturalWidth;
        const size = Square.fromRectangle(Images.getCharacterSizeFromString(img.src));
        return new Square(
            size.x * scale,
            size.y * scale,
            size.size * scale
        );
    }

    /**
     * Parses strings like '_x=70y=30size=155' into a square.
     *
     * @param imageName: The image this size belongs to
     */
    static getCharacterSizeFromString(imageName: string): Square {
        const match = (imageName || '').match(SIZE_STRING_REG_EXP);
        if (match && match[0]) {
            const s = match[0];
            const x = parseInt(s.substring(s.indexOf("x=") + 2, s.indexOf("y=")));
            const y = parseInt(s.substring(s.indexOf("y=") + 2, s.indexOf("size=")));
            const size = parseInt(s.substring(s.indexOf("size=") + 5));
            return new Square(x, y, size);
        } else {
            return new Square(0, 0, -1);
        }
    }

    constructor(story: string) {
        this.story = story;
        this._backend = new Endpoints();
    }

    load(): Promise<Img[]> {
        return this._backend.getImages(this.story)
            .then(imageUrls => {
                this.imagePaths = imageUrls;
                this.imageNames = imageUrls.map(url => Images.getName(url));

                this.backgroundImageStore = new ImageStore(imageUrls
                    .filter(path => path.indexOf("/background/") > -1)
                    .map(path => Images.getName(path)));

                this.characterImageStore = new ImageStore(imageUrls
                    .filter(path => path.indexOf("/character/") > -1)
                    .map(path => Images.getName(path)));

                return imageUrls;
            })
            .then(imageNames => Promise.all(
                imageNames.map(imageName => this.createImage(imageName))
            )).then(result => {
                this.images = result;
                this.imagesByName = {};
                this.imageNames.forEach(name =>
                    this.imagesByName[name] = this.images.find(img =>
                        Images.getName(img.src).indexOf(name) === 0)
                );
                return result;
            });
    }

    createImage(imageName: string): Promise<Img> {
        return new Promise((resolve) => {
            const img = new Img(null, BackendConfig.baseURL + imageName);
            img.onLoad = () => {
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
    static getName(path: string): string {
        return path.substr(path.lastIndexOf('/') + 1);
    }
}