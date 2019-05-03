import { Scene } from "./Scene";
import { Panel } from "./Panel";
import { SceneOrBackgroundLayout } from "../layout/Layout";
import { DistantImage, Images } from "../images/Images";
import { Img } from "../../common/dom/Img";
import { ImageQuery } from "../images/ImageQuery";
import { Rectangle } from "../../common/trigo/Rectangle";

export class Background {

    static defaultId = "default";

    id: string;

    scene: Scene;
    panels: Panel[] = [];
    layout: SceneOrBackgroundLayout;
    image: Img;
    distantImages: DistantImage[];

    constructor(id: string) {
        this.id = id;
    }

    static getDistantImageShape(distantImage: DistantImage, panel: Panel, backgroundImageShape: Rectangle) {
        const characterSize = panel.characters[0].defaultPosition.size;
        return Rectangle.fitAroundBounds(distantImage.image.bitmapShape.clone(), backgroundImageShape)
            .translateInvert(
                (1 - 1 / distantImage.distance) * panel.pan[0] * characterSize,
                (1 - 1 / distantImage.distance) * panel.pan[1] * characterSize
            );
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.background = this;
    }

    setupImage(images: Images) {
        this.image = this.chooseImage(images);
        this.distantImages = images.getDistantBackgroundImages(this.image);
        this.panels.forEach(panel => panel.backgroundImageShape = this.getPanelBackgroundImageShape(panel));
    }

    chooseImage(images: Images): Img {
        return images ? images.chooseBackgroundImage(new ImageQuery([this.id])) : null;
    }

    getPanelBackgroundImageShape(panel: Panel): Rectangle {
        const charactersBBox = panel.getCharactersBackgroundBBox();
        const backgroundImageShape = this.getBackgroundImageShape(panel.background.image, charactersBBox);

        // TODO
        // if (this.distantImages && this.distantImages.length) {
        //     return Rectangle.getBoundingBox([
        //         backgroundImageShape,
        //         ...this.distantImages.map((distantImage: DistantImage) =>
        //             Background.getDistantImageShape(distantImage, panel, backgroundImageShape))
        //     ]);
        // } else {
        return backgroundImageShape;
        // }
    }

    getPanelBackgroundImageShapeStart(panel: Panel): Rectangle {
        const charactersBBox = panel.getCharactersBackgroundBBoxStart();
        return this.getBackgroundImageShape(panel.background.image, charactersBBox);
    }

    getPanelBackgroundImageShapeEnd(panel: Panel): Rectangle {
        const charactersBBox = panel.getCharactersBackgroundBBoxEnd();
        return this.getBackgroundImageShape(panel.background.image, charactersBBox);
    }

    getBackgroundImageShape(image: Img, charactersBBox: Rectangle) {
        const backgroundShape = this.getBackgroundShape(charactersBBox);
        if (image && image.bitmapShape) {
            return Rectangle.fitAroundBounds(image.bitmapShape.clone(), backgroundShape);
        } else {
            return backgroundShape.clone();
        }
    }

    /**
     * Returns the size of the background image
     * for the specified size of the characters' bounding box.
     *
     * @param charactersBBox
     */
    getBackgroundShape(charactersBBox: Rectangle): Rectangle {
        const panelsBBoxes = [
            this.scalePanelsBboxToCharactersBBox(charactersBBox, this.getPanelBBoxStart()),
            this.scalePanelsBboxToCharactersBBox(charactersBBox, this.getPanelBBoxEnd())
        ];
        return Rectangle.getBoundingBox(panelsBBoxes);
    }

    scalePanelsBboxToCharactersBBox(charactersBBox: Rectangle, panelsBBox: Rectangle) {
        return new Rectangle(
            charactersBBox.x + panelsBBox.x * charactersBBox.width,
            charactersBBox.y + panelsBBox.y * charactersBBox.width,
            panelsBBox.width * charactersBBox.width,
            panelsBBox.height * charactersBBox.width
        );
    }

    /**
     * Returns the bounding box of all panels, relative to the characters' bounding box.
     *
     * The shape of all panel frames is transformed into a coordinate system with
     *     origin = charactersBBox.(x,y) and
     *     unit = charactersBBox.width
     *
     * This makes sense since the character's position and size must be equal
     * in all panels to calculate the minimal shape of the background image.
     *
     */
    getPanelsBBox(isStart: boolean, isEnd: boolean): Rectangle {
        return Rectangle.getBoundingBox(
            this.panels.map(panel => {

                // move all panels such that their character bounding boxes are at the coordinate system's origin (0,0)
                // the bounding box of these panels is now the required size of the background image
                // since the background image is required to
                //  - cover all panels completely
                //  - stay at the same position relative to the characters

                let charactersBBox: Rectangle;
                if (isStart && isEnd) {
                    charactersBBox = panel.getCharactersBackgroundBBoxStartToEnd();
                } else if (isStart) {
                    charactersBBox = panel.getCharactersBackgroundBBoxStart();
                } else if (isEnd) {
                    charactersBBox = panel.getCharactersBackgroundBBoxEnd();
                } else {
                    charactersBBox = panel.getCharactersBackgroundBBox();
                }

                // The shape of the frame is transformed into a coordinate system with
                //     origin = charactersBBox.(x,y) and
                //     unit = charactersBBox.width
                // This makes sense since the character's position and size must be equal
                // in all panels to calculate the minimal shape of the background image.

                return new Rectangle(
                    (panel.shape.x - charactersBBox.x) / charactersBBox.width,
                    (panel.shape.y - charactersBBox.y) / charactersBBox.width,
                    panel.shape.width / charactersBBox.width,
                    panel.shape.height / charactersBBox.width
                );
            })
        );
    }

    getPanelBBoxStartToEnd(): Rectangle {
        return this.getPanelsBBox(true, true);
    }

    getPanelBBoxStart(): Rectangle {
        return this.getPanelsBBox(true, false);
    }

    getPanelBBoxEnd(): Rectangle {
        return this.getPanelsBBox(false, true);
    }
}