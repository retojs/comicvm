import { Demo, } from "./Demo";
import { Div } from "../common/dom/Div";
import { DomElementContainer } from "../common/dom/DomElement";
import { PanelPlayer } from "../app/play/PanelPlayer";
import { ComicVM } from "../app/ComicVM";
import { Button } from "../common/dom/Button";
import { PaintConfigMode, setPaintConfig } from "../app/paint/Paint.config";
import { DemoContext } from "./DemoContext";

export class AnimationDemo implements Demo {

    name = "Animation Demo";
    desc = "Animates a panel";

    story = "Mickey";

    private playButton: Button;
    private panelPlayer: PanelPlayer;

    create(container: DomElementContainer) {

        new Div(container, "story-title", `<h1>Story :  ${this.story}</h1>`);

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created for animation demo:", comicVM);

                this.playButton = new Button(
                    new Div(container, "play-button-container"),
                    "Play",
                    () => this.panelPlayer.play(),
                    "button--posh"
                );

                comicVM.setupScene("animation-demo", container);

                DemoContext.setupCanvasPositionListeners(comicVM.canvas);

                setPaintConfig(PaintConfigMode.Final);

                this.panelPlayer = new PanelPlayer(comicVM);
                this.panelPlayer.play();
            });
    }

}