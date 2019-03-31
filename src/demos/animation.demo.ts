import { Demo } from "./Demo";
import { Div } from "../app/dom/Div";
import { Endpoints } from "../app/backend/Endpoints";
import { DomElementContainer } from "../app/dom/DomElement";
import { PanelPlayer } from "../app/play/PanelPlayer";
import { ComicVM } from "../app/ComicVM";
import { PanelPainter } from "../app/paint/PanelPainter";
import { Canvas } from "../app/dom/Canvas";
import { Button } from "../app/dom/Button";
import { ComicVmCanvas } from "../app/paint/ComicVmCanvas";

export class AnimationDemo implements Demo {

    name = "Animation Demo";
    desc = "Animates a panel";

    story = "Mickey";

    private canvas: Canvas;
    private playBtn: Button;
    private panelPlayer: PanelPlayer;
    private backend: Endpoints;

    create(container: DomElementContainer) {
        this.backend = new Endpoints();

        new Div(container, "story-title", `<h1>Story :  ${this.story}</h1>`);

        this.playBtn = new Button(container, "Play");

        this.canvas = new ComicVmCanvas(container);

        ComicVM.loadStory("Mickey")
            .then(comicVM => {
                console.log("comicVM created for animation demo:", comicVM);

                const scene = comicVM.getScene("animation-demo").setup(this.canvas, comicVM.story.images);
                const panel = scene.panels[0];

                this.panelPlayer = new PanelPlayer(
                    scene,
                    comicVM.story.images,
                    new PanelPainter(this.canvas)
                );

                this.playBtn.onClick = () => {
                    this.panelPlayer.play(panel, 2000);
                };

                this.panelPlayer.play(panel, 2000);
            });
    }
}