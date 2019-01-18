import { Canvas } from "../dom/Canvas";
import { Point } from "../trigo/Point";
import { Line } from "../trigo/Line";
import { PaintStyleConfig } from "../paint/PaintConfig";

export function create() {
    const myCanvas = new Canvas("images", 900, 1200);

    let origin = new Point(800, 800);
    let crossingLine = new Line().setFrom(0, 100).setTo(2000, 800);

    document.addEventListener('mousemove', (event: MouseEvent) => {
        window.requestAnimationFrame(() => {
            drawIntersection(event.clientX, event.clientY);
        });
    });

    document.addEventListener('click', (event: MouseEvent) => {
        origin = myCanvas.getMousePosition(event.clientX, event.clientY);
        crossingLine.from.y = Math.random() * 800;
        crossingLine.to.y = Math.random() * 800;
        window.requestAnimationFrame(() => {
            myCanvas.clear();
            drawIntersection(event.clientX, event.clientY);
        });
    });

    function drawIntersection(clientX, clientY) {
        const mousePos = myCanvas.getMousePosition(clientX, clientY);
        const mouseLine = new Line(origin, mousePos);
        const intersection = mouseLine.intersection(crossingLine);

        myCanvas.begin();
        myCanvas.line(crossingLine, PaintStyleConfig.stroke("#2196f3"));
        myCanvas.lineFromTo(origin, mousePos, PaintStyleConfig.stroke("#4caf50"));
        myCanvas.circle(intersection, 20, PaintStyleConfig.fillAndStroke("rgba(30, 150, 240, 0.5)", "#4caf50", 3));
        myCanvas.end();
    }
}