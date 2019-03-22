import { Endpoints } from "../app/backend/Endpoints";
import { Img } from "../app/dom/Img";
import { TextArea } from "../app/dom/TextArea";
import { Div } from "../app/dom/Div";
import { ImageUpload } from "../app/components/ImageUpload";
import { Demo } from "./Demo";
import { DomElementContainer } from "../app/dom/DomElement";
import { ImageType } from "../app/images/ImageType";
import { ImageEditor } from "../app/components/ImageEditor";
import { Button } from "../app/dom/Button";
import { Images, SIZE_STRING_REG_EXP } from "../app/images/Images";
import { Story } from "../app/model/Story";

const UNSAVED_CHANGE_STYLE_CLASS = "unsaved-change";

export class ImagesDemo implements Demo {

    name = "Images Demo";
    desc = "Loads Images from the backend";

    story = "Mickey";
    initialImage = "goofy"; //"mickey.minnie";

    imageEditor: ImageEditor;
    imageName: string;
    imageNameDisplay: Div;

    private backend: Endpoints;

    create(container: DomElementContainer) {
        this.backend = new Endpoints();

        new Div(container, "story-title", `<h1>Story :  ${this.story}</h1>`)

        const imageEditorContainer = new Div(container, "image-editor", "<h2>Image Editor</h2>");
        const storyContentContainer = new Div(container, "story-content margin-top--double");
        const imageContainer = new Div(storyContentContainer, "images-demo__images");

        const characterImageContainer = new Div(imageContainer, "", "<h2>Character Images</h2>");
        const characterUpload = new ImageUpload(imageContainer, this.story, ImageType.Character);
        characterUpload.imageContainer = characterImageContainer;

        const backgroundImageContainer = new Div(imageContainer, "", "<h2>Background Images</h2>");
        const backgroundUpload = new ImageUpload(imageContainer, this.story, ImageType.Background);
        backgroundUpload.imageContainer = backgroundImageContainer;

        const textContainer = new Div(storyContentContainer, "images-demo__text", "<h2>Plot and Layout</h2>");

        Story.load(this.story)
            .then(story => {
                story.scenes.forEach(scene => {

                    const sceneContainer = new Div(textContainer, "images-demo").domElement;
                    new Div(sceneContainer, "images-demo__title", `Scene: <b><i>${scene.name}</i></b>`);

                    const plotTextArea = new TextArea(sceneContainer, 100, 20);
                    plotTextArea.setText(scene.plot.input);

                    const layoutTextArea = new TextArea(sceneContainer, 100, 20);
                    layoutTextArea.setText(scene.layout);
                });

                story.images.images.forEach(img => {
                    if (img.src.indexOf('/background/') > -1) {
                        new Img(backgroundImageContainer, img.src, 500, 300);
                    } else {
                        const characterImage = new Img(characterImageContainer, img.src, 100, 120);
                        if (img.src.indexOf(this.initialImage) > -1) {
                            this.createImageEditor(imageEditorContainer, characterImage);
                        }
                        characterImage.onClick = (event: MouseEvent) => this.changeImage(event.target as HTMLImageElement);
                    }
                });
            });

        const buttonContainer = new Div(container, "buttons");

        const getShapeSetShape = new Button(buttonContainer, "image.shape = image.shape", (event: MouseEvent) => {
            this.imageEditor.characterPlaceholder.shape = this.imageEditor.characterPlaceholder.shape;
        });
    }

    changeImage(target: HTMLImageElement) {
        if (!this.imageEditor) {
            console.error("no image editor :(");
            return;
        }
        this.imageEditor.sourceImage = target;
        this.imageName = Images.getName(target.src);
        this.imageNameDisplay.content = this.imageName;
    }

    createImageEditor(container: DomElementContainer, sourceImage: Img) {

        let newImageName = this.imageName = Images.getName(sourceImage.src);

        this.imageEditor = new ImageEditor(container);
        this.imageEditor.sourceImage = sourceImage.domElement;
        this.imageEditor.onSizeChange = (sizeString: string) => {
            const fileEnding = this.imageName.substr(this.imageName.lastIndexOf("."));
            const plainName = this.imageName.substr(0, this.imageName.lastIndexOf("."));

            newImageName = plainName + sizeString + fileEnding;
            if (SIZE_STRING_REG_EXP.test(this.imageName)) {
                newImageName = plainName.replace(SIZE_STRING_REG_EXP, sizeString) + fileEnding;
            }
            this.imageNameDisplay.content = newImageName;
            this.imageNameDisplay.class = UNSAVED_CHANGE_STYLE_CLASS;
        };

        this.imageEditor.onResetSize = () => {
            newImageName = this.imageName.replace(SIZE_STRING_REG_EXP, '');
            this.imageNameDisplay.content = newImageName;
            if (newImageName !== this.imageName) {
                this.imageNameDisplay.class = UNSAVED_CHANGE_STYLE_CLASS;
            }
        };

        const saveBtn = new Button(this.imageEditor, "Save Character Size");

        saveBtn.onClick = () => {
            if (!newImageName) {
                throw new Error("image name is not defined");
            }
            this.backend.renameCharacterImage(this.imageName, newImageName, this.story)
                .then(newImageUrl => {
                    console.log("image renamed to", newImageUrl);
                    setTimeout(() => {
                        if (this.imageEditor.sourceImage) {
                            this.imageEditor.sourceImage.src = newImageUrl;
                        }
                    }, 500);
                });
            this.imageName = newImageName;
            this.imageNameDisplay.content = newImageName;
            this.imageNameDisplay.removeClass(UNSAVED_CHANGE_STYLE_CLASS);

        };

        this.imageNameDisplay = new Div(this.imageEditor, "image-name", this.imageName);
    }
}