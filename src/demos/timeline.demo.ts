import { Demo } from "./Demo";
import { DomElementContainer } from "../common/dom/DomElement";
import { TimelineEditor } from "./components/TimelineEditor";
import { ComicVM } from "../app/ComicVM";
import { Scene } from "../app/model/Scene";
import { Div } from "../common/dom/Div";
import { Heading } from "../common/dom/Heading";
import { PaintConfig, setPaintConfigFinal } from "../app/paint/Paint.config";

export class TimelineDemo implements Demo {

    name = "Timeline Demo";
    desc = "This demo shows how to work with a timeline.";

    scene: Scene;
    timelineEditor: TimelineEditor;

    create(container: DomElementContainer) {
        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created:", comicVM);

                setPaintConfigFinal();

                const root = new Div(container, "timeline-demo",
                    new Heading(null, 2, "Timeline Editor")
                );

                this.scene = comicVM.getScene("animation-demo");

                this.timelineEditor = new TimelineEditor(root, this.scene)
                    .setup(1000, PaintConfig.canvas.font, comicVM.images)
                    .paint();
            })
    }
}