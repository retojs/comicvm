import { DomElement, DomElementContainer } from "../../common/dom/DomElement";
import { Div } from "../../common/dom/Div";
import { Input } from "../../common/dom/Input";
import { Label } from "../../common/dom/Label";
import { Margin } from "../../common/style/Margin";

export type ParameterListener<T> = (value: T) => void;

const LARGEST_SMALL_VALUE = 5;
const INCREMENT_SMALL_VALUES = 0.01;
const INCREMENT_SMALL_VALUES_CTRL_KEY = 0.05;
const INCREMENT_LARGE_VALUES = 1;
const INCREMENT_LARGE_VALUES_CTRL_KEY = 5;
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
    private isRepeatingKeyDown = false;

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

    /**
     * Feature:
     *
     *   * Keeping any of the arrow keys pressed should increase or decrease the parameter value in a regular speed.
     *   * The increment should match the incremented value to get a smooth increase
     *      i.e. the increment should be reasonably small relative to the current value
     *   * Pressing the CTRL key should produce a faster increase.
     *
     * Concept of Implementation:
     *
     *   - the flag isRepeatingKeyDown indicates if a regular increment is in progress
     *   - on keydown
     *      - this flag is set to true
     *      - the method startRepeatKeyDown starts a loop calling repeatKeyDown in each iteration
     *   - on keyup
     *      - this flag is set to false
     *      - the method stopRepeatingKeyDown stops the loop
     *
     *   - In each step of the repeatKeyDown loop
     *      - the incremented value is calculated in the method getIncrementedValue.
     *      - the increment size depends on
     *          - the arrow key (up/right = increase, down/left = decrease)
     *          - the Ctrl key (larger increment if Ctrl is pressed)
     *          - the current value (smaller increment if value is smaller than LARGEST_SMALL_VALUE)
     *      - the incremented value is passed to the change listener
     *      - the next iteration is initiated if looping has not been stopped through the flag mentioned above.
     *
     * @param onChange: the change listener to be notified of a new value
     */

    setupKeyboardListeners(onChange: ParameterListener<string>) {
        this.input.onKeyDown = (event: KeyboardEvent) => {
            if (isArrowKeyPressed(event) && !this.isRepeatingKeyDown) {
                this.startRepeatingKeyDown(event, onChange);
            }
        };
        this.input.onKeyUp = (event: KeyboardEvent) => {
            if (this.isRepeatingKeyDown) {
                this.stopRepeatingKeyDown();
                this.value = this.getIncrementedValue(event);
                onChange(this.value);
            } else {
                this.getDebounced(onChange)(event);
            }
        }
    }

    startRepeatingKeyDown(event: KeyboardEvent, onChange: ParameterListener<string>) {
        this.isRepeatingKeyDown = true;
        this.arrowKeyTimeoutId = setTimeout(
            () => this.repeatKeyDown(event, onChange),
            KEY_DOWN_DEBOUNCE_INTERVAL);
    }

    stopRepeatingKeyDown() {
        this.isRepeatingKeyDown = false;
        this.stopArrowKeyTimeout();
    }

    stopArrowKeyTimeout() {
        clearTimeout(this.arrowKeyTimeoutId);
        this.arrowKeyTimeoutId = null;
    }

    repeatKeyDown(event: KeyboardEvent, onChange: ParameterListener<string>) {
        this.value = this.getIncrementedValue(event);
        onChange(this.value);

        this.stopArrowKeyTimeout();
        if (this.isRepeatingKeyDown) {
            this.arrowKeyTimeoutId = setTimeout(
                () => this.repeatKeyDown(event, onChange),
                KEY_DOWN_REPEAT_INTERVAL
            );
        }
    }

    getIncrementedValue(event: KeyboardEvent): string {
        if (!this.value || !isArrowKeyPressed(event)) {
            return;
        }
        const value = parseFloat(this.value);

        let increment = INCREMENT_LARGE_VALUES;
        let incrementCtrlKey = INCREMENT_LARGE_VALUES_CTRL_KEY;
        if (this.isSmallValue(value)) {
            increment = INCREMENT_SMALL_VALUES;
            incrementCtrlKey = INCREMENT_SMALL_VALUES_CTRL_KEY;
        }

        if (typeof value === "number") {
            switch (event.code) {
                case "ArrowUp":
                case "ArrowRight":
                    return "" + (value + (event.ctrlKey ? incrementCtrlKey : increment)).toFixed(FRACTION_DIGITS);
                case "ArrowDown":
                case "ArrowLeft":
                    return "" + (value - (event.ctrlKey ? incrementCtrlKey : increment)).toFixed(FRACTION_DIGITS);
            }
        }
    }

    isSmallValue(value: number) {
        return value < LARGEST_SMALL_VALUE;
    }

    /**
     * Returns a debounced version of the specified change listener.
     * The debounced version only calls the change listener after the user has stopped typing for a certain amount of time.
     * @param onChange
     */
    getDebounced(onChange: ParameterListener<string>) {
        return (event: KeyboardEvent) => {
            if (!isArrowKeyPressed(event)) {
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

function isArrowKeyPressed(event: KeyboardEvent) {
    return event.code === "ArrowUp" || event.code === "ArrowDown"
        || event.code === "ArrowLeft" || event.code === "ArrowRight"
}