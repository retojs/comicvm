import { Div } from "../../common/dom/Div";
import { Panel } from "../../app/model/Panel";
import { PanelLayoutProperties } from "../../app/layout/LayoutProperties";
import { ParameterInput, ParameterListener } from "./ParameterInput";


export class PanelPropertiesEditor {

    root: Div;

    panel: Panel;
    changeListener: ParameterListener<any>;

    zoom: ParameterInput;
    panx: ParameterInput;
    pany: ParameterInput;

    constructor(container, onChange: ParameterListener<any>) {
        this.root = new Div(container, "panel-properties-editor");
        this.changeListener = onChange;
    }

    setPanel(panel: Panel) {
        this.panel = panel;
        this.createInputs(panel.layoutProperties);
    }

    createInputs(layoutProperties: PanelLayoutProperties) {

        this.root.clearContent();

        this.zoom = this.createNumberInput("zoom", layoutProperties.zoom || 1, value => layoutProperties.zoom = value);
        this.panx = this.createNumberInput("pan.x", layoutProperties.pan[0] || 0, value => layoutProperties.pan[0] = value);
        this.pany = this.createNumberInput("pan.y", layoutProperties.pan[1] || 0, value => layoutProperties.pan[1] = value);

        this.zoom.focus();
    }

    createNumberInput(name: string, value: number, onChange: ParameterListener<number>) {
        return ParameterInput.createNumberInput(this.root, name, value, value => {
            onChange(value);
            this.changeListener(value);
        });
    }
}