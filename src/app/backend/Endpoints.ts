import { BackendConfig } from "./BackendConfig";

export class Endpoints {

    baseUrl: string;

    private urls = {
        scenes: "/:story/scenes",
        images: "/:story/images",

        plot: "/:story/plot/:scene.plot.txt",
        layout: "/:story/layout/:scene.layout.yml",

        image: {
            background: "/:story/images/background/:name",
            character: "/:story/images/character/:name"
        },
        uploadImage: {
            background: "/:story/upload-image/background",
            character: "/:story/upload-image/character"
        },
        moveTempImage: "/:story/images/move/tmp/:name"
    };

    private options = {
        text: {
            headers: {
                "Content-Type": "text/plain"
            }
        },
        json: {
            headers: {
                "Content-Type": "application/json"
            }
        }
    };

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || BackendConfig.baseURL;
    }

    getScenes(story: string): Promise<string[]> {
        return this.getJson(this.getSceneUrl(this.urls.scenes, story));
    }

    getImages(story: string): Promise<string[]> {
        return this.getJson(this.getSceneUrl(this.urls.images, story));
    }

    getPlot(story: string, scene: string): Promise<string> {
        return this.getText(this.getSceneUrl(this.urls.plot, story, scene));
    }

    getLayout(story: string, scene: string): Promise<string> {
        return this.getText(this.getSceneUrl(this.urls.layout, story, scene));
    }

    uploadBackgroundImage(image: Blob, story: string): Promise<Response> {
        return this.uploadImage(image, this.getImageUrl(this.urls.uploadImage.background, story));
    }

    uploadCharacterImage(image: Blob, story: string): Promise<Response> {
        return this.uploadImage(image, this.getImageUrl(this.urls.uploadImage.character, story));
    }

    getBackgroundImageUrl(story: string, name: string) {
        return this.getImageUrl(this.urls.image.background, story, name);
    }

    getCharacterImageUrl(story: string, name: string) {
        return this.getImageUrl(this.urls.image.character, story, name);
    }

    private getImageUrl(url: string, story: string, name?: string) {
        return this.baseUrl + url
            .replace(":story", story)
            .replace(":name", name);
    }

    private getSceneUrl(url: string, story: string, scene?: string): string {
        return this.baseUrl + url
            .replace(":story", toLowerCase(story))
            .replace(":scene", toLowerCase(scene));

        function toLowerCase(str: string): string {
            return str ? str.trim().toLowerCase() : '';
        }
    }

    private uploadImage(image: Blob, url: string): Promise<Response> {
        const formData = new FormData();
        formData.append("image", image);

        return fetch(url, {
            method: "POST",
            body: formData
        });
    }

    private getText(url: string): Promise<string> {
        return fetch(url, this.options.text)
            .then(response => response.text());
    }

    private getJson(url: string): Promise<any> {
        return fetch(url, this.options.json)
            .then(response => response.json());
    }
}