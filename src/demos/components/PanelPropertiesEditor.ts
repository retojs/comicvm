import { Div } from "../../common/dom/Div";
import { Panel } from "../../app/model/Panel";
import { CameraAnimation, PanelLayout } from "../../app/layout/Layout";
import { ParameterInput, ParameterListener } from "./ParameterInput";
import { Heading } from "../../common/dom/Heading";
import { DomElementContainer } from "../../common/dom/DomElement";

export class PanelPropertiesEditor {

    root: Div;

    panel: Panel;
    changeListener: ParameterListener<any>;

    layoutConfig: Div;
    zoom: ParameterInput;
    panX: ParameterInput;
    panY: ParameterInput;

    animationConfig: Div;
    animationZoom: ParameterInput;
    animationPanX: ParameterInput;
    animationPanY: ParameterInput;

    animationTimeValues: Div;
    animationTime: ParameterInput;
    currentZoom: ParameterInput;
    currentPanX: ParameterInput;
    currentPanY: ParameterInput;

    constructor(container, onChange: ParameterListener<any>) {
        this.root = new Div(container, "panel-properties-editor");
        this.layoutConfig = new Div(this.root, "property-section");
        this.animationConfig = new Div(this.root, "property-section");
        this.animationTimeValues = new Div(this.root, "property-section");
        this.changeListener = onChange;
    }

    setPanel(panel: Panel) {
        this.panel = panel;
        this.createInputs();
    }

    createInputs() {
        this.createLayoutPropertyInputs();
        this.createAnimationPropertyInputs();
        this.createAnimationTimeInput();
        this.setupStyles();

        this.animationTime.focus();
    }

    setupStyles() {
        this.panY.class = this.animationPanY.class = "margin-right--double";
    }

    createLayoutPropertyInputs() {
        this.layoutConfig.clearContent();
        this.layoutConfig.addContent(new Heading(null, 4, "Layout Properties"));

        const layout: PanelLayout = this.panel.layout;

        this.zoom = this.createLayoutPropertyInput("zoom", layout.camera.zoom != null ? layout.camera.zoom : 1,
            value => layout.camera.zoom = value
        );

        layout.camera.pan = layout.camera.pan || {};

        this.panX = this.createLayoutPropertyInput("pan.x", layout.camera.pan.x || 0,
            value => layout.camera.pan.x = value
        );
        this.panY = this.createLayoutPropertyInput("pan.y", layout.camera.pan.y || 0,
            value => layout.camera.pan.y = value
        );
    }

    createAnimationPropertyInputs() {
        this.animationConfig.clearContent();
        this.animationConfig.addContent(new Heading(null, 4, "Animation Properties"));

        const animation: CameraAnimation = this.panel.layout.animation;

        this.animationZoom = this.createAnimationPropertyInput("zoom", animation.zoom || 0,
            value => animation.zoom = value
        );

        animation.pan = animation.pan || {};

        this.animationPanX = this.createAnimationPropertyInput("pan.x", animation.pan.x || 0,
            value => animation.pan.x = value
        );
        this.animationPanY = this.createAnimationPropertyInput("pan.y", animation.pan.y || 0,
            value => animation.pan.y = value
        );
    }

    createLayoutPropertyInput(name: string, value: number, onChange: ParameterListener<number>): ParameterInput {
        return this.createNumberInput(this.layoutConfig, name, value, onChange);
    }

    createAnimationPropertyInput(name: string, value: number, onChange: ParameterListener<number>): ParameterInput {
        return this.createNumberInput(this.animationConfig, name, value, onChange);
    }

    createAnimationTimeInput() {
        this.animationTimeValues.clearContent();
        this.animationTimeValues.addContent(new Heading(null, 4, "Animation Time Values"));

        this.animationTime = this.createAnimationTimeValueInput("time", this.panel.animationTime,
            value => {
                const constrainedValue = Math.min(1, Math.max(0, value));
                this.panel.animationTime = constrainedValue;
                this.animationTime.value = constrainedValue.toFixed(2);
                this.currentZoom.value = this.panel.zoom.toFixed(2);
                this.currentPanX.value = this.panel.pan[0].toFixed(2);
                this.currentPanY.value = this.panel.pan[1].toFixed(2);
            }
        );
        this.animationTime.class = "margin-right";

        this.currentZoom = this.createAnimationTimeValueReadOnlyInput("zoom", this.panel.zoom);
        this.currentPanX = this.createAnimationTimeValueReadOnlyInput("pan.x", this.panel.pan[0]);
        this.currentPanY = this.createAnimationTimeValueReadOnlyInput("pan.y", this.panel.pan[1]);
    }


    createAnimationTimeValueInput(name: string, value: number, onChange: ParameterListener<number>): ParameterInput {
        return this.createNumberInput(this.animationTimeValues, name, value, onChange);
    }

    createAnimationTimeValueReadOnlyInput(name: string, value: number): ParameterInput {
        const input = this.createNumberInput(this.animationTimeValues, name, value, () => {});
        input.input.domElement.disabled = true;
        return input;
    }

    /**
     * Creates an input field to edit a number property.
     *
     * @param container: the container dom element or its id
     * @param name: the name of the property displayed as the input field's label
     * @param value: the source property of the input field's value
     * @param onChange: the change listener to update the source property whenever the input field's value is changed
     */
    createNumberInput(container: DomElementContainer, name: string, value: number, onChange: ParameterListener<number>): ParameterInput {
        return ParameterInput.createNumberInput(container, name, value, value => {
            onChange(value);
            this.changeListener(value);
        });
    }
}