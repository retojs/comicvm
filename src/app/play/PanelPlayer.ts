import { PanelPainter } from "../paint/PanelPainter";
import { Panel } from "../model/Panel";
import { Scene } from "../model/Scene";
import { Images } from "../images/Images";
import { Player } from "./Player";
import { getPanelDuration, getPlayingPanels, setPanelAnimationTime } from "./Timeline";
import { ComicVM } from "../ComicVM";
import { PanelTimelineProperties } from "./PanelTimelineProperties";
import { LayoutEngine } from "../layout/engine/LayoutEngine";

const LETTER_DURATION = 50;

export class PanelPlayer extends Player {

    private comicVM: ComicVM;
    private layoutEngine: LayoutEngine;
    private panelPainter: PanelPainter;

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
        panels.forEach(panel => panel.timelineProperties = new PanelTimelineProperties(0, getPanelDuration(panel, LETTER_DURATION)));
    }

    paintPanels(time: number) {
        const panels = getPlayingPanels(this.panels, time);
        if (time > 0 && panels.length === 0) {
            this.isPlaying = false;
            console.log("stopped because no playing panels")
        } else {
            panels.forEach(panel => {
                    this.layoutPanel(panel, time);
                    this.panelPainter.paintPanel(panel);
                }
            )
        }
    }

    layoutPanel(panel: Panel, time: number) {
        setPanelAnimationTime(panel, time);
        this.layoutEngine.layoutPanelContent(panel, this.panelPainter.canvas);
        this.scene.setupImages(this.images);
    }
}