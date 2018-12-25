import '../style/app.scss';
import { Plot } from "./plot/Plot";
import { Canvas } from "./paint/Canvas";
import { PanelPainter } from "./paint/PanelPainter";
import { LayoutEngine } from "./layout/LayoutEngine";
import { LayoutParser } from "./layout/LayoutParser";

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
            - Mariel: {x: 1.4, size: 1.5}
          - - 0
            - bgr-3
            -
            -
            - 1.9
            - [1.3, 1]
      # lower strip
      - panels:
          - - 3
            - bgr-beach
  # page 2
  - strips:
      # upper strip
      - panels:
          - - 1
backgrounds:
  '':
    zoom: 1
    pan: [0.5, 1.5]
    Mariel:
      how:
        - sad
        - happy
      pos: {x: 2.3, y: 1.2, size: 1.5}
    All:
      how:
        - fluffy
      pos: {x: 2.5}
  sunset-beach:
    zoom: 1
    pan: [1, 1]
    Papa:
      how:
        - old
      pos: {x: 5, y: 4, size: 2}
scene:
  zoom: 1
  pan: [1, 1]
  Mariel:
    how:
      - wet
    pos: {x: -1.2, size: 0.95}
`;

const layoutParser = new LayoutParser(sampleLayout);
const layoutEngine = new LayoutEngine(layoutParser, plot);
const canvas = new Canvas('comic-vm-canvas', 400, 1800);
const panelPainter = new PanelPainter(canvas);

layoutParser.scene.pages.forEach(page => {
    canvas.rect(page.shape, null, "rgba(0, 0, 0, 0.1)");
    canvas.line(
        {
            x: page.shape.x,
            y: page.shape.y + page.shape.height
        },
        {
            x: page.shape.x + page.shape.width,
            y: page.shape.y + page.shape.height
        },
        "rgba(0, 0, 0, 0.2"
    );

    page.strips.forEach(strip => {
        //   canvas.rect(strip.shape, "#f88");
    });

    page.panels.forEach(panel => {
        panelPainter.paintPanel(panel);
    });
});