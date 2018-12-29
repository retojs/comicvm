import { ScenePainter } from "./paint/ScenePainter";
import * as layoutConfigButtons from "./layout-config-buttons";

const plot = `
Title: Character Position Test

Characters: Mickey, Minnie, Goofy

Place: Duckburgh
_____
Plot:

Mickey to Goofy:
(happy)
    Hey Goofy
    How are you?

Goofy to Mickey:
    Hey Mickey!
    Long time no see.
    And hello Minnie
    Always a pleasure to see you.

`;


const layout = `
---
panelProperties:
  - plotItemCount
  - characterPositions
  - zoom
  - pan
pages:
  # page 1
    - strips:
      # upper strip
      - panels:
          - - 1
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1}
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
      # middle strip
      - panels:
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
            - 0.75
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
            - 1.25
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
            - 1.25
            - [0, 1]
      # lower strip
      - panels:
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
            - 1.0
            - [1, 1]
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
            - 0.75
            - [1, 1]
          - - 1
            - Mickey: {x: 1.0, y: -1.0, size: 1.5}
              Goofy: {y: 1.0, size: 0.5}
            - 0.75
            - [1, 0]
backgrounds: 
  default:
     zoom: 1
     pan: [0.5, 0.5]
     all:
       pos: {y: 0.5}
     Minnie:
       pos: {size: 0.8}
scene:
  pan: [0, 1]
`;

let scenePainter: ScenePainter;

export function create() {
    scenePainter = new ScenePainter(plot, layout);
    layoutConfigButtons.create(scenePainter);
}
