import { Scene } from "./Scene";
import { Panel } from "./Panel";
import { BackgroundLayoutProperties } from "../layout/LayoutProperties";
import { Images } from "../images/Images";
import { Img } from "../dom/Img";
import { ImageQuery } from "../images/ImageQuery";
import { Rectangle } from "../trigo/Rectangle";

export class Background {

    static defaultId = "default";

    id: string;

    scene: Scene;
    panels: Panel[] = [];
    layoutProperties: BackgroundLayoutProperties;
    image: Img;

    constructor(id: string) {
        this.id = id;
    }

    addPanel(panel: Panel) {
        this.panels.push(panel);
        panel.background = this;
    }

    chooseImage(images: Images): Img {
        this.image = images.chooseBackgroundImage(new ImageQuery([this.id]));
        return this.image;
    }

    getImageDimensions(panel: Panel): Rectangle {
        const panelsBBox = this.getPanelsBBox();
        const charactersBBox = this.getCharactersBackgroundBBox(panel);
        const backgroundDimensions = new Rectangle(
            charactersBBox.x + panelsBBox.x * charactersBBox.width,
            charactersBBox.y + panelsBBox.y * charactersBBox.width,
            panelsBBox.width * charactersBBox.width,
            panelsBBox.height * charactersBBox.width
        );
        if (panel.background.image && panel.background.image.bitmapShape) {
            return Rectangle.fitAroundBounds(panel.background.image.bitmapShape, backgroundDimensions);
        } else {
            return backgroundDimensions;
        }
    }

    getCharactersBackgroundBBox(panel: Panel) {
        return Rectangle.getBoundingBox(panel.characters.map(c => c.backgroundPosition));
    }

    getPanelsBBox(): Rectangle {
        return Rectangle.getBoundingBox(
            this.panels.map(panel => {

                // move all panels such that their character bounding boxes are at the coordinate system's origin (0,0)
                // the bounding box of these panels is now the required size of the background image
                // since the background image is required to
                //  - cover all panels completely
                //  - stay at the same position relative to the characters

                const charactersBBox = this.getCharactersBackgroundBBox(panel);
                // const charactersBBox = this.getCharactersPanelBBox(panel);

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
}