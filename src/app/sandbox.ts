import { Plot } from "./plot/Plot";
import { Canvas } from "./paint/Canvas";
import { PanelPainter } from "./paint/PanelPainter";
import { LayoutEngine } from "./layout/LayoutEngine";
import { LayoutParser } from "./layout/LayoutParser";
import { PaintConfig } from "./layout/LayoutConfig";

const plot = new Plot(`
Title: Kick Off

Characters: Mariel, Basil, Silas

Place: main-beach
_____
Plot:

Mariel neben Silas:
(Silas:waiting)
    Bequem so?

Basil:
    Yup, sitzt perfekt.

(waiting)
    Also dann...
    Achtung!
    Fertig?
Basil und Silas:
(jump, Silas:jump)
    Los!

Mariel, Basil und Silas:
(Basil:swim, Silas:swim)
    Quiek!

Basil und Silas springen mit Mariel ins Wasser
  
`);

plot.plotItems.forEach(item => {
    console.log(item.toString());
});

const sampleLayout = `
---
panelProperties:
  - plotItemCount
  - backgroundId
  - characterQualifier
  - characterPositions
  - zoom
  - pan
pages:
  # page 1
  - stripHeights: [0.4, 0.6]
    strips:
      # upper strip
      - panelWidths: [0.3, 0.4, 0.3]
        panels:
          - - 2
            - bgr-1
            - Mariel=surprised; Dad=smiling
          - - 1
            - bgr-2
            - all=happy
            - Mariel: {x: 0.5, size: 1.2}
          - - 0
            - bgr-3
            -
            -
            - 1.5
            - [1, 1]
      # lower strip
      - panels:
          - - 3
            - bgr-3
            -
            - Silas: {y: -0.2, size: 1.2}
  # page 2
  - strips:
      # upper strip
      - panels:
          - - 1
          - - 2
            - sunset-beach
backgrounds:
  default:
    zoom: 1
    pan: [0.5, 1.5]
    Mariel:
      how:
        - sad
        - happy
      pos: {x: 0.5, y: -0.5, size: 2}
    All:
      how:
        - fluffy
      pos: {x: 2.5}
  sunset-beach:
    zoom: 1
    pan: [1, 1]
    Basil:
      how:
        - screaming
      pos: {x: -0,2, y: 0.2, size: 1.2}
scene:
  zoom: 1
  pan: [1, 1]
  Mariel:
    how:
      - wet
    pos: {x: -1.2, size: 0.5}
  Silas:
    pos: {y: -0.5, size: 1.33}
  Basil:
    pos: {x: -0.25, y: 0.5, size: 1.7}
`;

const layoutParser = new LayoutParser(sampleLayout);
const layoutEngine = new LayoutEngine(layoutParser, plot);
const canvas = new Canvas('comic-vm-canvas', 600, 2000);
const panelPainter = new PanelPainter(canvas);

export function paint() {
    layoutParser.scene.pages.forEach(page => {
        canvas.rect(page.shape, PaintConfig.fill("rgba(0, 0, 0, 0.1)"));
        canvas.line(
            {
                x: page.shape.x,
                y: page.shape.y + page.shape.height
            },
            {
                x: page.shape.x + page.shape.width,
                y: page.shape.y + page.shape.height
            },
            PaintConfig.stroke("rgba(0, 0, 0, 0.2)", 0.5)
        );

        page.strips.forEach(strip => {
            canvas.rect(strip.shape, PaintConfig.stroke("rgba(100, 200, 180, 0.4)", 0.5));
        });

        page.panels.forEach(panel => panelPainter.paintPanel(panel));
    });

    // const button = new Button(getZoomButtonLabel(), "buttons", function () {
    //     LayoutConfig.applyZoom = !LayoutConfig.applyZoom;
    //     button.setLabel(getZoomButtonLabel());
    // });
    //
    // function getZoomButtonLabel() {
    //     return "apply zoom (" + (LayoutConfig.applyZoom ? "ON" : "OFF") + ")";
    // }

}