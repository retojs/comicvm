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

    getImageDimensions(panel: Panel) {
        const panelsBBox = this.getPanelsBBox();
        const charactersBBox = this.getCharactersBBox(panel);
        // TODO fix that
        //.scale(1 / panel.layoutProperties.zoom, panel.shape.center)
        //.translate(-panel.layoutProperties.pan[0], -panel.layoutProperties.pan[1]);
        panelsBBox.translate(charactersBBox.x, charactersBBox.y);
        return panelsBBox;
    }

    getCharactersBBox(panel: Panel) {
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

                const charactersBBox = Rectangle.getBoundingBox(panel.characters.map(c => c.backgroundPosition));
                return new Rectangle(
                    (panel.shape.x - charactersBBox.x) / panel.getZoom(), // normalize to default zoom
                    (panel.shape.y - charactersBBox.y) / panel.getZoom(),
                    panel.shape.width / panel.getZoom(),
                    panel.shape.height / panel.getZoom()
                );
            })
        );
    }
}