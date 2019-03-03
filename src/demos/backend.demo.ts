import { Endpoints } from "../app/backend/Endpoints";
import { Img } from "../app/dom/Img";
import { TextArea } from "../app/dom/TextArea";
import { Div } from "../app/dom/Div";
import { ImageUpload } from "../app/components/ImageUpload";
import { BackendConfig } from "../app/backend/Backend.config";
import { Demo } from "./Demo";
import { DomElementContainer } from "../app/dom/DomElement";
import { ImageType } from "../app/images/ImageType";
import { ImageEditor } from "../app/components/ImageEditor";

export class BackendDemo implements Demo {

    name = "Backend Demo";
    desc = "Loads Images from the backend";

    create(container: DomElementContainer) {

        const story = "Mariel";

        const backend = new Endpoints();

        const imageEditor = new ImageEditor(container, 'http://localhost:3000/mariel/images/background/dream.beach.png');

        const imageContainer = new Div(container, "backend-demo__images");
        const textContainer = new Div(container, "backend-demo__text");

        new ImageUpload(imageContainer, story, ImageType.Background);
        new ImageUpload(imageContainer, story, ImageType.Character);

        backend.getScenes(story)
            .then(scenes => {
                console.log("scenes: ", scenes);

                scenes.forEach(scene => {
                    const sceneContainer = new Div(textContainer, "backend-demo").domElement;
                    new Div(sceneContainer, "backend-demo__title", `Scene: <b><i>${scene}</i></b>`);

                    backend.getPlot(story, scene)
                        .then((plot) => {
                            const textarea = new TextArea(sceneContainer, 100, 20);
                            textarea.setText(plot);
                        });

                    backend.getLayout(story, scene)
                        .then((plot) => {
                            const textarea = new TextArea(sceneContainer, 100, 20);
                            textarea.setText(plot);
                        });
                });
            })
            .catch(showError);

        backend.getImages(story)
            .then(images => {
                console.log("images: ", images);

                images.forEach(path => {
                    if (path.indexOf('/background/') > -1) {
                        new Img(imageContainer, BackendConfig.baseURL + path, 500, 300);
                    } else {
                        new Img(imageContainer, BackendConfig.baseURL + path, 100, 120);
                    }
                })
            })
            .catch(showError);

        function showError(error) {
            new Div(container, "error", error);
            throw(error);
        }
    }
}