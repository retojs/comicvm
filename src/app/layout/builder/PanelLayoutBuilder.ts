import { CameraAnimation, PanelLayout } from "../Layout";
import { CommonLayoutBuilder } from "./CommonLayoutBuilder";

export class PanelLayoutBuilder extends CommonLayoutBuilder<PanelLayout, PanelLayoutBuilder> {

    protected readonly layout: PanelLayout;

    constructor() {
        super(new PanelLayout());
    }

    plotItemCount(plotItemCount: number): PanelLayoutBuilder {
        this.layout.plotItemCount = plotItemCount;
        return this;
    }

    animation(animation: CameraAnimation): PanelLayoutBuilder {
        this.layout.animation = animation;
        return this;
    }
}