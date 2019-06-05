import { Endpoints } from "./Endpoints";
import { Scene } from "../app/model/Scene";
import { Story } from "../app/Story";
import { ImageLoader } from "./ImageLoader";
import { Images } from "../app/images/Images";


export class StoryLoader {

    private _backend: Endpoints;

    constructor() {
        this._backend = new Endpoints();
    }

    static load(storyName: string): Promise<Story> {
        return new StoryLoader().load(storyName);
    }

    load(storyName: string): Promise<Story> {

        const story = new Story(storyName);

        return Promise.all([
                ImageLoader.load(story),
                this.loadStoryScenes(story)
            ]
//        ).then((content: [Images, Scene[]]) => {
        ).then((content: [Images, Scene[]]) => {
            story.images = content[0];
            story.scenes = content[1];
            return story;
        });
    }

    loadStoryScenes(story: Story): Promise<Scene[]> {
        return this._backend.getScenes(story.name)
            .then(sceneNames => Promise.all(
                sceneNames.map(sceneName => this.loadStoryScene(story, sceneName))
            ))
            .then(scenes => {
                return story.scenes = scenes;
            });
    }

    loadStoryScene(story: Story, sceneName: string) {
        return Promise.all([
                this._backend.getLayout(story.name, sceneName),
                this._backend.getPlot(story.name, sceneName)
            ]
        ).then(result => new Scene(sceneName, result[0], result[1]))
    }
}