import { Endpoints } from "../backend/Endpoints";
import { Img } from "../dom/Img";
import { TextArea } from "../dom/TextArea";
import { Div } from "../dom/Div";
import { ImageUpload } from "./ImageUpload";


const baseUrl = "http://localhost:3000";

export function create() {

    const backend = new Endpoints(baseUrl);

    const story = "Mariel";

    const imageContainer = new Div("images").domElement;
    const textContainer = new Div("images").domElement;

    const backgroundImageUpload = new ImageUpload(imageContainer, story, backend, true).domElement;
    const characterImageUpload = new ImageUpload(imageContainer, story, backend, false).domElement;

    backend.getScenes(story)
        .then(scenes => {
            console.log("scenes: ", scenes);

            scenes.forEach(scene => {
                const sceneContainer = new Div(textContainer).domElement;
                const title = new Div(sceneContainer, `Scene: <b><i>${scene}</i></b>`);
                title.domElement.style.padding = "16px 0 10px";

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
        });

    backend.getImages(story)
        .then(images => {
            console.log("images: ", images);

            images.forEach(path => {
                let img: Img;
                if (path.indexOf('/background/') > -1) {
                    img = new Img(imageContainer, baseUrl + path, 500, 300);
                } else {
                    img = new Img(imageContainer, baseUrl + path, 100, 120);
                }
                img.domElement.style.margin = "4px";
                img.domElement.style.border = "1px solid lightgrey";
            })
        });
}