import { CoordinatesDisplay } from "./components/CoordinatesDisplay";
import { Canvas } from "../common/dom/Canvas";

export class DemoContext {

    private static _coordinateDisplay: CoordinatesDisplay;

    static get coordinateDisplay(): CoordinatesDisplay {
        if (!DemoContext._coordinateDisplay) {
            DemoContext._coordinateDisplay = new CoordinatesDisplay(window.document.body);
        }
        return DemoContext._coordinateDisplay;
    }

    static setupCanvasPositionListeners(canvas: Canvas): void {
        canvas.onMouseMove = (event: MouseEvent) => {
            DemoContext.coordinateDisplay.canvasCoordinates = canvas.getCanvasPositionFromMousePosition(event.clientX, event.clientY);
        };

        canvas.onMouseLeave = () => DemoContext.coordinateDisplay.canvasCoordinates = undefined;
    }
}