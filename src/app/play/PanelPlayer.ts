import { PanelPainter } from "../paint/PanelPainter";
import { Panel } from "../model/Panel";
import { Scene } from "../model/Scene";
import { Images } from "../images/Images";
import { Player } from "./Player";
import { isPlayingPanel, setPanelAnimationTime, Timeline } from "./Timeline";
import { ComicVM } from "../ComicVM";
import { LayoutEngine } from "../layout/engine/LayoutEngine";
import { PaintStyleConfig } from "../../common/style/PaintStyle";

const MUTED_PANEL_STYLE = PaintStyleConfig.fill("rgba(250, 250, 250, 0.25)");

export class PanelPlayer extends Player {

    name = "PanelPlayer";

    private comicVM: ComicVM;
    private layoutEngine: LayoutEngine;
    private panelPainter: PanelPainter;
    private animationDuration: number;

    constructor(comicVM: ComicVM) {
        super();

        this.comicVM = comicVM;
        this.layoutEngine = new LayoutEngine(comicVM.currentScene);
        this.panelPainter = new PanelPainter(comicVM.canvas);

        this.setPanelTimelineProperties(this.panels);
        this.renderFrameFn = this.paintPanels.bind(this);
    }

    get scene(): Scene {
        return this.comicVM.currentScene;
    }

    get panels(): Panel[] {
        return this.scene.panels;
    }

    get images(): Images {
        return this.comicVM.images;
    }

    setPanelTimelineProperties(panels: Panel[]) {
        this.animationDuration = Timeline.applyPanelTimelineProperties(panels);
    }

    paintPanels(time: number) {
        if (time > this.animationDuration) {
            this.resetPlayer();

            console.log("PanelPlayer stopped at the end of the animation at " + (this.animationDuration / 1000).toFixed(2) + " s");
        }
        this.panels.forEach(panel => {
            this.layoutPanel(panel, time);
            this.panelPainter.paintPanel(panel);
            if (!isPlayingPanel(panel, time)) {
                this.comicVM.canvas.rect(panel.shape, MUTED_PANEL_STYLE);
            }
        })
    }

    layoutPanel(panel: Panel, time: number) {
        setPanelAnimationTime(panel, time);
        this.layoutEngine.layoutPanelContent(panel, this.panelPainter.canvas);
        this.scene.setupImages(this.images);
    }
}