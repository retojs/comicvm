import { Square } from "../trigo/Square";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/Layout.config";
import { Img } from "../dom/Img";
import { Images } from "../images/Images";
import { ImageQuery } from "../images/ImageQuery";
import { Rectangle } from "../trigo/Rectangle";

export class Character {

    name: string;
    how: string[] = [];

    defaultPosition?: Square;
    backgroundPosition?: Square;
    panelPosition?: Square;

    image: Img;

    constructor(name: string, how?: string[]) {
        this.name = name;
        if (how && how.length > 0) {
            how.forEach(q => this.addQualifier(q));
        }
    }

    addQualifier(how: string) {
        if (!this.hasQualifier(how)) {
            this.how.push(how);
        }
    }

    hasQualifier(qualifier: string): boolean {
        return this.how.indexOf(qualifier) > -1;
    }

    getPosition(): Square {
        let position: Square;
        if (CharacterPositionLayoutLevel.DEFAULT === LayoutConfig.characterPositionLayoutLevel
            && this.defaultPosition) {
            position = this.defaultPosition;
        }
        if (CharacterPositionLayoutLevel.DEFAULT < LayoutConfig.characterPositionLayoutLevel
            && this.backgroundPosition) {
            position = this.backgroundPosition;
        }
        if (CharacterPositionLayoutLevel.PANEL === LayoutConfig.characterPositionLayoutLevel
            && this.panelPosition) {
            position = this.panelPosition;
        }
        return position;
    }

    chooseImage(images: Images): Img {
        this.image = images.chooseCharacterImage(new ImageQuery([this.name], this.how, []));
        return this.image;
    }

    getImageDimensions(characterPosition: Square): Rectangle {
        if (!this.image) {
            return new Rectangle(0, 0, 0, 0);
        }
        return Rectangle.fitAroundBounds(this.image.bitmapShape, characterPosition);
    }
}