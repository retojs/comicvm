import { Demo } from "./Demo";
import { Div } from "../common/dom/Div";
import { DomElementContainer } from "../common/dom/DomElement";
import { PanelPlayer } from "../app/play/PanelPlayer";
import { ComicVM } from "../app/ComicVM";
import { Button } from "../common/dom/Button";
import { setPaintConfigFinal } from "../app/paint/Paint.config";
import { CoordinatesDisplay } from "./components/CoordinatesDisplay";

export class AnimationDemo implements Demo {

    name = "Animation Demo";
    desc = "Animates a panel";

    story = "Mickey";

    private playButton: Button;
    private panelPlayer: PanelPlayer;
    private coordinateDisplay: CoordinatesDisplay;

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
                this.coordinateDisplay = new CoordinatesDisplay(container);

                comicVM.setupScene("animation-demo", container);

                this.setupMouseListeners(comicVM);

                setPaintConfigFinal();

                this.panelPlayer = new PanelPlayer(comicVM);
                this.panelPlayer.play();
            });
    }

    setupMouseListeners(comicVM: ComicVM) {
        comicVM.canvas.onMouseMove = (event: MouseEvent) => {
            const canvasPosition = comicVM.canvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);
            const x = canvasPosition.x.toFixed(0);
            const y = canvasPosition.y.toFixed(0);
            this.coordinateDisplay.setContent(`<div class="coordinates-display_section">
                         <div>canvas coordinates: <span class="mouse-pos">[ ${x}, ${y} ]</span></div>
                       </div>`);
            this.coordinateDisplay.updateContent();
        };

        comicVM.canvas.onMouseLeave = () => this.coordinateDisplay.setContent("");
    }
}