import { Select } from "../common/dom/Select";
import { Label } from "../common/dom/Label";
import { Div } from "../common/dom/Div";
import { ImagesDemo } from "./images.demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { BezierBubblePointerDemo } from "./bezier-bubble-pointer.demo";
import { Demo } from "./Demo";
import { BubbleDemo } from "./bubble.demo";
import { CharacterPositionDemo } from "./character-position.demo";
import { ComicVmDemo } from "./comic-vm.demo";
import { IntersectionDemo } from "./intersection.demo";
import { AnimationDemo } from "./animation.demo";
import { BackgroundImageSizeDemo } from "./background-image-size.demo";
import { TimelineDemo } from "./timeline.demo";
import { ComicVmGuideDemo } from "./comic-vm-guide-demo";
import { DemoContext } from "./DemoContext";

const LOCAL_STORAGE_KEY = 'comic-vm--selected-demo';

const demos = [
    {name: ""},
    new AnimationDemo(),
    new TimelineDemo(),
    new ImagesDemo(),
    new BackgroundImageSizeDemo(),
    new BezierBubblePointerDemo(),
    new BubbleDemo(),
    new CharacterPositionDemo(),
    new ComicVmDemo(),
    new ComicVmGuideDemo(),
    new IntersectionDemo(),
];

const demoNames = demos.map(demo => demo.name);

const demosByName = demos.reduce((map, demo) => {
    map[demo.name] = demo;
    return map;
}, {});

export function create(container: DomElementContainer) {

    const label = new Label(new Div(container), "Choose an example");
    const selection = new Select(label, demoNames);
    const demoContainer = new Div(container, "demo-container");

    selection.onChange = () => {
        storeSelectedIntoStorage(selection.selectedOption);
        showDemo(getSelectedDemo());
        setTimeout(() => {
            DemoContext.coordinateDisplay.referencePoint = undefined;
            DemoContext.coordinateDisplay.resetContent();
        }, 10);
    };

    selection.selectedOption = loadSelectedFromStorage();
    showDemo(getSelectedDemo());

    DemoContext.coordinateDisplay; // lazy create the coordinates display

    function getSelectedDemo() {
        return demosByName[selection.selectedOption];
    }

    function showDemo(demo: Demo) {
        demoContainer.clearContent();
        if (demo && demo.create) {
            createHeader(demoContainer, demo);
            demo.create(createBody(demoContainer));
        }
    }

    function createBody(demoContainer: DomElementContainer): Div {
        return new Div(demoContainer, "demo-body");
    }

    function createHeader(demoContainer: DomElementContainer, demo: Demo): Div {
        const header = new Div(demoContainer, "demo-header");
        new Div(header, "demo-title", demo.name);
        new Div(header, "demo-description", demo.desc);
        return header;
    }

    function loadSelectedFromStorage(): string {
        return localStorage.getItem(LOCAL_STORAGE_KEY);
    }

    function storeSelectedIntoStorage(selectedOption: string) {
        localStorage.setItem(LOCAL_STORAGE_KEY, selectedOption);
    }
}