import { DomElementContainer } from "../common/dom/DomElement";

export const DEMO_DEFAULT_WIDTH = 720;

export interface Demo {
    name: string;
    desc: string;
    create: (container: DomElementContainer) => void;
}
