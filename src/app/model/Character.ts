import { Square } from "../../common/trigo/Square";
import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/Layout.config";
import { Img } from "../../common/dom/Img";
import { Images } from "../images/Images";
import { ImageQuery } from "../images/ImageQuery";
import { Rectangle } from "../../common/trigo/Rectangle";

export class Character {

    name: string;
    how: string[] = [];

    defaultPosition?: Square;
    backgroundPosition?: Square;
    backgroundPositionStart?: Square;
    backgroundPositionEnd?: Square;
    panelPosition?: Square;

    image: Img;
    imageShape: Rectangle;

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

    getImageQuery(): ImageQuery {
        return new ImageQuery([this.name], this.how, []);
    }

    chooseImage(images: Images): Img {
        return images ? images.chooseCharacterImage(this.getImageQuery()) : null;
    }

    getImageShape(): Rectangle {
        const characterPosition: Square = this.getPosition();
        if (!this.image) {
            return new Rectangle(0, 0, 0, 0);
        }
        const size: Square = Images.getCharacterSizeFromString(this.image.src);
        if (size.width > 0) {
            const scale = characterPosition.size / size.size;
            return new Rectangle(
                characterPosition.x - size.x * scale,
                characterPosition.y - size.y * scale,
                this.image.bitmapShape.width * scale,
                this.image.bitmapShape.height * scale,
            );
        } else {
            return Rectangle.fitAroundBounds(this.image.bitmapShape.clone(), characterPosition);
        }
    }
}