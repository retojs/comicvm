import { Scene } from "./Scene";
import { Panel } from "./Panel";
import { BackgroundLayoutProperties } from "../layout/LayoutProperties";
import { Images } from "../images/Images";
import { Img } from "../dom/Img";
import { ImageQuery } from "../images/ImageQuery";

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
}