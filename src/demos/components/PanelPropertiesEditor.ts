import { Div } from "../../common/dom/Div";
import { Panel } from "../../app/model/Panel";
import { PanelAnimationProperties, PanelLayoutProperties } from "../../app/layout/LayoutProperties";
import { ParameterInput, ParameterListener } from "./ParameterInput";
import { Heading } from "../../common/dom/Heading";
import { DomElementContainer } from "../../common/dom/DomElement";

export class PanelPropertiesEditor {

    root: Div;

    panel: Panel;
    changeListener: ParameterListener<any>;

    layoutProps: Div;
    zoom: ParameterInput;
    panX: ParameterInput;
    panY: ParameterInput;

    animationProps: Div;
    animationZoom: ParameterInput;
    animationPanX: ParameterInput;
    animationPanY: ParameterInput;

    animationTimeContainer: Div;
    animationTime: ParameterInput;

    constructor(container, onChange: ParameterListener<any>) {
        this.root = new Div(container, "panel-properties-editor");
        this.layoutProps = new Div(this.root, "property-section");
        this.animationProps = new Div(this.root, "property-section");
        this.animationTimeContainer = new Div(this.root, "property-section");
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
        this.layoutProps.clearContent();
        this.layoutProps.addContent(new Heading(null, 4, "Layout Properties"));

        const layoutProps: PanelLayoutProperties = this.panel.layoutProperties;

        this.zoom = this.createLayoutPropertyInput("zoom", layoutProps.zoom != null ? layoutProps.zoom : 1,
            value => layoutProps.zoom = value
        );

        layoutProps.pan = layoutProps.pan || [];

        this.panX = this.createLayoutPropertyInput("pan.x", layoutProps.pan[0] || 0,
            value => layoutProps.pan[0] = value
        );
        this.panY = this.createLayoutPropertyInput("pan.y", layoutProps.pan[1] || 0,
            value => layoutProps.pan[1] = value
        );
    }

    createAnimationPropertyInputs() {
        this.animationProps.clearContent();
        this.animationProps.addContent(new Heading(null, 4, "Animation Properties"));

        const animationProps: PanelAnimationProperties = this.panel.layoutProperties.animation;

        this.animationZoom = this.createAnimationPropertyInput("zoom", animationProps.zoom || 0,
            value => animationProps.zoom = value
        );

        animationProps.pan = animationProps.pan || [];

        this.animationPanX = this.createAnimationPropertyInput("pan.x", animationProps.pan[0] || 0,
            value => animationProps.pan[0] = value
        );
        this.animationPanY = this.createAnimationPropertyInput("pan.y", animationProps.pan[1] || 0,
            value => animationProps.pan[1] = value
        );
    }

    createLayoutPropertyInput(name: string, value: number, onChange: ParameterListener<number>): ParameterInput {
        return this.createNumberInput(this.layoutProps, name, value, onChange);
    }

    createAnimationPropertyInput(name: string, value: number, onChange: ParameterListener<number>): ParameterInput {
        return this.createNumberInput(this.animationProps, name, value, onChange);
    }

    createAnimationTimeInput() {
        this.animationTimeContainer.clearContent();
        this.animationTimeContainer.addContent(new Heading(null, 4, "Animation Time"));

        this.animationTime = this.createNumberInput(this.animationTimeContainer, "time", this.panel.animationTime,
            value => {
                const constrainedValue = Math.min(1, Math.max(0, value));
                this.panel.animationTime = constrainedValue;
                this.animationTime.value = constrainedValue.toFixed(2);
            }
        );
    }

    /**
     * Creates an input field to edit a number property.
     *
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