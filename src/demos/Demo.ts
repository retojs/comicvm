import { DomElementContainer } from "../app/dom/DomElement";
import { PaintConfig } from "../app/paint/Paint.config";

export const DEFAULT_CANVAS_WIDTH = PaintConfig.canvas.width;
export const DEFAULT_CANVAS_HEIGHT = PaintConfig.canvas.height;

export interface Demo {
    name: string;
    desc: string;
    create: (container: DomElementContainer) => void;
}