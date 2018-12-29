import { ScenePainter } from "./paint/ScenePainter";
import { Button } from "./dom";
import { CharacterPositionLayoutLevel, LayoutConfig } from "./layout/LayoutConfig";


const plot = `
Title: Character Position Test

Characters: Mickey, Minnie, Goofy

Place: Duckburgh
_____
Plot:

Mickey to Goofy:
    Hey Goofy
Goofy to Mickey:
    Hey Mickey
Mickey to Goofy:
    Are you alright, Goofy? 
Goofy to Mickey:
    Sure, Mickey, why are you asking?
Mickey to Goofy:
    It's just...
Minnie to Goofy: 
    You look like shit, Goofy 
Goofy to Minnie:
    I can't believe you just said that. 
Mickey to Goofy:
    She didn't mean to be rude.
    But you look aweful.
    When was the last time you slept?
Goofy to Mickey:
    Hmm... Tuesday?
Mickey to Goofy:
    What?!
    It's Friday now.
Minnie to Goofy:
    What the fuck happened? 
`;


const layout = `
---
panelProperties:
  - plotItemCount
pages:
  # page 1
  - strips:
    # upper strip
    - panels:
      - - 2
      - - 4
      - - 2
    # middle strip
    - panels:
      - - 4
      - - 1
      - - 1
    # lower strip
    - panels:
      - - 1
      - - 1
      - - 1
scene:
  pan: [0, 2]
`;

let scenePainter: ScenePainter;

export function create() {
    scenePainter = new ScenePainter(plot, layout);
}
