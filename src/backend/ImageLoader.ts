import { Endpoints } from "./Endpoints";
import { Story } from "../app/Story";
import { Images } from "../app/images/Images";
import { BackendConfig } from "./Backend.config";


export class ImageLoader {

    private _backend: Endpoints;

    constructor() {
        this._backend = new Endpoints();
    }

    static load(story: Story): Promise<Images> {
        return new ImageLoader().load(story);
    }

    load(story: Story): Promise<Images> {
        const images = new Images(story.name);

        return this._backend.getImages(story.name)
            .then(imageUrls => images.init(imageUrls, BackendConfig.baseURL))
    }
}