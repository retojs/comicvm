import { Page } from "../../model/Page";
import { Panel } from "../../model/Panel";
import { Rectangle } from "../../../common/trigo/Rectangle";
import { Strip } from "../../model/Strip";

export function validatePageShape(page: Page) {
    const error = validateShape(page.shape);
    if (error) {
        throw new Error("Page " + page.index + " " + error);
    }
}

export function validateStripShape(strip: Strip) {
    const error = validateShape(strip.shape);
    if (error) {
        throw new Error("Strip " + strip.index + " on page " + strip.page.index + " " + error);
    }
}

export function validatePanelShape(panel: Panel) {
    const error = validateShape(panel.shape);
    if (error) {
        throw new Error("Panel " + panel.sceneIndex + " " + error);
    }
}

export function validateShape(shape: Rectangle): string {
    if (!shape) {
        return "has no shape.";
    }
    if (shape.width < 0 || shape.height < 0) {
        return "shape is invalid (width=" + shape.width + ", height=" + shape.height + ")";
    }
    return null;
}