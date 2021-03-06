import { ImageStore } from "./ImageStore";
import { Img } from "../../common/dom/Img";
import { ImageQuery } from "./ImageQuery";
import { Rectangle } from "../../common/trigo/Rectangle";
import { Square } from "../../common/trigo/Square";

export const SIZE_STRING_REG_EXP = /_x=-?\d*y=-?\d*size=\d*/;
export const BACKGROUND_DISTANCE_REG_EXP = /_distance=(\d*(.\d*)?)/;

export interface DistantImage {
    image: Img;
    distance: number;
}

export class Images {

    story: string;

    images: Img[];
    imageNames: string[];
    imagesByName: { [key: string]: Img } = {};
    imagePaths: string[];

    private characterImageStore = new ImageStore([]);
    private backgroundImageStore = new ImageStore([]);

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

    static getDistance(name: string): number {
        const matches = name.match(BACKGROUND_DISTANCE_REG_EXP);
        if (matches && matches[1]) {
            return parseFloat(matches[1]);
        }
        return 1;
    }

    constructor(story: string) {
        this.story = story;
    }

    init(imageUrls: string[], baseUrl: string): Promise<Images> {
        this.imagePaths = imageUrls;
        this.imageNames = imageUrls.map(url => Images.getName(url));

        this.backgroundImageStore = new ImageStore(imageUrls
            .filter(path => path.indexOf("/background/") > -1)
            .map(path => Images.getName(path)));

        this.characterImageStore = new ImageStore(imageUrls
            .filter(path => path.indexOf("/character/") > -1)
            .map(path => Images.getName(path)));

        return Promise.all(imageUrls.map(url => this.createImage(url, baseUrl)))
            .then((images: Img[]) => this.setImages(images))
            .then(() => this);
    }

    createImage(imageName: string, baseUrl: string): Promise<Img> {
        return new Promise((resolve) => {
            const img = new Img(null, baseUrl + imageName);
            img.onLoad = () => {
                resolve(img);
            };
        })
    }

    setImages(images: Img[]) {
        this.images = images;
        this.imagesByName = {};
        this.imageNames.forEach(name =>
            this.imagesByName[name] = this.images.find(img =>
                Images.getName(img.src).indexOf(name) === 0)
        );
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

    getDistantBackgroundImages(image: Img): DistantImage[] {
        let backgroundImageName = Images.getName(image.src);
        backgroundImageName = backgroundImageName.substring(0, backgroundImageName.lastIndexOf("."));

        return this.imageNames
            .filter(name => BACKGROUND_DISTANCE_REG_EXP.test(name) || name.indexOf(backgroundImageName) >= 0)
            .filter(name => name.indexOf(backgroundImageName) >= 0)
            .map(name => ({
                image: this.getImage(name),
                distance: Images.getDistance(name)
            }));
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