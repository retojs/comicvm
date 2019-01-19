import { Images } from "../images/Images";
import { Endpoints } from "../backend/Endpoints";
import { Scene } from "./Scene";

export class Story {

    name: string;

    scenes: Scene[];
    images: Images;

    private _backend: Endpoints;

    constructor(name: string) {
        this.name = name;
        this.images = new Images(name);
        this._backend = new Endpoints();
    }

    static load(name: string): Promise<Story> {
        return new Story(name).load();
    }

    load(): Promise<Story> {
        return Promise.all([
                this.images.load(),
                this.loadScenes()
            ]
        ).then(() => this);
    }

    loadScenes(): Promise<Scene[]> {
        return this._backend.getScenes(this.name)
            .then(sceneNames => Promise.all(
                sceneNames.map(sceneName => this.loadScene(sceneName))
            ))
            .then(scenes => {
                return this.scenes = scenes;
            });
    }

    loadScene(sceneName: string) {
        return Promise.all([
                this._backend.getLayout(this.name, sceneName),
                this._backend.getPlot(this.name, sceneName)
            ]
        ).then(result => new Scene(sceneName, result[0], result[1]))
    }

}