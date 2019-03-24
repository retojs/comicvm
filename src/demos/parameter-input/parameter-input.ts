import { DomElement, DomElementContainer } from "../../app/dom/DomElement";
import { Div } from "../../app/dom/Div";
import { Input } from "../../app/dom/Input";
import { Label } from "../../app/dom/Label";
import { MarginConfig } from "../../app/layout/Layout.config";

export type ParameterListener<T> = (value: T) => void;

export class ParameterInput extends DomElement<HTMLDivElement> {

    domElement: HTMLDivElement;

    input: Input;

    private debounceInterval = 500;
    private lastKeyUp: number;

    static createMarginConfigInput(container: DomElementContainer, name: string, value: MarginConfig, onKeyUp: ParameterListener<MarginConfig>): ParameterInput {
        return new ParameterInput(container, name, value.asString, (value: string) => {
            const values: number[] = value.split(" ").map(str => parseInt(str));
            if (values.every(value => typeof value === 'number')) {
                onKeyUp(new MarginConfig(values[0], values[1], values[2], values[3]));
            }
        })
    }

    static createNumberInput(container: DomElementContainer, name: string, value: number, onKeyUp: ParameterListener<number>): ParameterInput {
        return new ParameterInput(container, name, "" + value, (valueStr: string) => {
            const value: number = parseFloat(valueStr);
            console.log("parameter " + name + " changed to " + value);
            if (typeof value === 'number') {
                onKeyUp(value);
            }
        })
    }

    constructor(container: DomElementContainer, name: string, value: string, onKeyUp: ParameterListener<string>) {
        super(container);
        this.domElement = this.add(this.createParameterElement(name, value, onKeyUp));
    }

    createParameterElement(name: string, value: string, onKeyUp: ParameterListener<string>): HTMLDivElement {
        const main = new Div(this.container, "parameter-input");
        const label = new Label(main, name);
        this.input = new Input(label, "text", name, value);
        this.debounceKeyUp(onKeyUp);
        return main.domElement;
    }

    debounceKeyUp(onKeyUp: ParameterListener<string>) {
        this.input.onKeyUp = () => {
            this.lastKeyUp = Date.now();
            setTimeout(() => {
                if (Date.now() >= this.lastKeyUp + this.debounceInterval) {
                    onKeyUp(this.input.domElement.value);
                }
            }, this.debounceInterval);
        };
    }
}