import { DomElementContainer } from "../app/dom/DomElement";

export const DEMO_DEFAULT_WIDTH = 720;
export const DEMO_DEFAULT_HEIGHT = 720 / Math.sqrt(2);

export interface Demo {
    name: string;
    desc: string;
    create: (container: DomElementContainer) => void;
}