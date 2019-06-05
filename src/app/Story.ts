import { Images } from "./images/Images";
import { Scene } from "./model/Scene";

// TODO: allow offline stories without backend

export class Story {

    name: string;

    scenes: Scene[] = [];
    images: Images;

    constructor(name: string) {
        this.name = name;
        this.images = new Images(name);
    }
}