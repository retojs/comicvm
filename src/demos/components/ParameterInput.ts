import { DomElement, DomElementContainer } from "../../common/dom/DomElement";
import { Div } from "../../common/dom/Div";
import { Input } from "../../common/dom/Input";
import { Label } from "../../common/dom/Label";
import { Margin } from "../../common/style/Margin";

export type ParameterListener<T> = (value: T) => void;

const INCREMENT = 0.01;
const INCREMENT_CTRL_KEY = 0.05;
const FRACTION_DIGITS = 2;
const KEY_DOWN_REPEAT_INTERVAL = 10;
const KEY_DOWN_DEBOUNCE_INTERVAL = 200;

export class ParameterInput extends DomElement<HTMLDivElement> {

    domElement: HTMLDivElement;

    input: Input;

    get value(): string {
        return this.input.domElement.value;
    }

    set value(value: string) {
        this.input.domElement.value = value;
    }

    private debounceInterval = 500;
    private lastKeyUp: number;
    private arrowKeyTimeoutId: any;

    static createMarginConfigInput(container: DomElementContainer, name: string, value: Margin, onKeyUp: ParameterListener<Margin>): ParameterInput {
        return new ParameterInput(
            container,
            name, value.asString,

            (value: string) => {
                const values: number[] = value.split(" ").map(str => parseInt(str));
                if (values.every(value => typeof value === 'number')) {
                    onKeyUp(new Margin(values[0], values[1], values[2], values[3]));
                }
            })
    }

    static createNumberInput(container: DomElementContainer, name: string, value: number, onKeyUp: ParameterListener<number>): ParameterInput {
        return new ParameterInput(
            container,
            name, "" + value.toFixed(FRACTION_DIGITS),

            (valueStr: string) => {
                const value: number = parseFloat(valueStr);
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
        this.setupKeyboardListeners(onKeyUp);
        return main.domElement;
    }

    setupKeyboardListeners(onChange: ParameterListener<string>) {
        this.input.onKeyDown = (event: KeyboardEvent) => {
            if (!this.arrowKeyTimeoutId) {
                this.arrowKeyTimeoutId = setTimeout(
                    () => this.repeatKeyDown(event, onChange),
                    event.ctrlKey ? KEY_DOWN_REPEAT_INTERVAL : KEY_DOWN_DEBOUNCE_INTERVAL);
            }
        };
        this.input.onKeyUp = (event: KeyboardEvent) => {
            if (this.arrowKeyTimeoutId) {
                this.clearArrowKeyTimeout();
                this.handleArrowKeys(event);
                onChange(this.value);
            } else {
                this.getDebounced(onChange)(event);
            }
        }
    }

    clearArrowKeyTimeout() {
        clearTimeout(this.arrowKeyTimeoutId);
        this.arrowKeyTimeoutId = null;
    }

    repeatKeyDown(event: KeyboardEvent, onKeyUp: ParameterListener<string>) {
        this.clearArrowKeyTimeout();
        this.handleArrowKeys(event);
        onKeyUp(this.value);
        this.arrowKeyTimeoutId = setTimeout(
            () => this.repeatKeyDown(event, onKeyUp),
            KEY_DOWN_REPEAT_INTERVAL
        );
    }

    handleArrowKeys(event: KeyboardEvent): void {
        if (!this.value) {
            return;
        }
        const value = parseFloat(this.value);
        if (typeof value === "number") {
            switch (event.code) {
                case "ArrowUp":
                case "ArrowRight":
                    this.value = "" + (value + (event.ctrlKey ? INCREMENT_CTRL_KEY : INCREMENT)).toFixed(FRACTION_DIGITS);
                    break;
                case "ArrowDown":
                case "ArrowLeft":
                    this.value = "" + (value - (event.ctrlKey ? INCREMENT_CTRL_KEY : INCREMENT)).toFixed(FRACTION_DIGITS);
                    break;
            }
        }
    }

    getDebounced(onChange: ParameterListener<string>) {
        return (event: KeyboardEvent) => {
            if (event.code !== "ArrowUp" && event.code !== "ArrowDown"
            && event.code !== "ArrowLeft" && event.code !== "ArrowRight") {
                this.lastKeyUp = Date.now();
                setTimeout(() => {
                    if (Date.now() >= this.lastKeyUp + this.debounceInterval) {
                        onChange(this.value);
                    }
                }, this.debounceInterval);
            }
        };
    }

    focus() {
        this.input.domElement.focus();
    }
}