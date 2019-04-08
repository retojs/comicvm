import { Demo } from "./Demo";
import { Div } from "../common/dom/Div";
import { DomElementContainer } from "../common/dom/DomElement";
import { PanelPlayer } from "../app/play/PanelPlayer";
import { ComicVM } from "../app/ComicVM";
import { Canvas } from "../common/dom/Canvas";
import { Button } from "../common/dom/Button";
import { ComicVmCanvas } from "../app/paint/ComicVmCanvas";

export class AnimationDemo implements Demo {

    name = "Animation Demo";
    desc = "Animates a panel";

    story = "Mickey";

    private canvas: Canvas;
    private playBtn: Button;
    private panelPlayer: PanelPlayer;

    create(container: DomElementContainer) {

        new Div(container, "story-title", `<h1>Story :  ${this.story}</h1>`);

        this.playBtn = new Button(container, "Play");

        this.canvas = new ComicVmCanvas(container);

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created for animation demo:", comicVM);

                comicVM.setupScene("animation-demo", this.canvas);

                this.panelPlayer = new PanelPlayer(comicVM);

                this.playBtn.onClick = () => {
                    this.panelPlayer.play();
                };

                this.panelPlayer.play();
            });
    }
}