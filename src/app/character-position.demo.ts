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
`;

let scenePainter: ScenePainter;

export function paint() {
    scenePainter = new ScenePainter(layout, plot);
}

export function repaint() {
    scenePainter.repaintScene();
}

(function createToggleZoomButton() {
    const toggleZoomButton = new Button(getToggleZoomButtonLabel(), "buttons", toggleZoom);

    function toggleZoom() {
        LayoutConfig.applyZoom = !LayoutConfig.applyZoom;
        repaint();
        toggleZoomButton.setLabel(getToggleZoomButtonLabel());
    }

    function getToggleZoomButtonLabel() {
        return "Apply Zoom (" + (LayoutConfig.applyZoom ? "On" : "Off") + ")";
    }
})();

(function createTogglePanningButton() {
    const togglePanningButton = new Button(getTogglePanningButtonLabel(), "buttons", togglePanning);

    function togglePanning() {
        LayoutConfig.applyPanning = !LayoutConfig.applyPanning;
        repaint();
        togglePanningButton.setLabel(getTogglePanningButtonLabel());
    }

    function getTogglePanningButtonLabel() {
        return "Apply Panning (" + (LayoutConfig.applyPanning ? "On" : "Off") + ")";
    }
})();

function createLayoutLevelButton(level: CharacterPositionLayoutLevel) {

    const levelLabels = {};
    levelLabels[CharacterPositionLayoutLevel.PANEL] = "Panel";
    levelLabels[CharacterPositionLayoutLevel.BACKGROUND] = "Background";
    levelLabels[CharacterPositionLayoutLevel.SCENE] = "Scene";
    levelLabels[CharacterPositionLayoutLevel.DEFAULT] = "Default";

    const layoutLevelButton = new Button(getLayoutLevelButtonLabel(), "buttons", setLayoutLevel);

    function setLayoutLevel() {
        LayoutConfig.characterPositionLayoutLevel = level;
        repaint();
        layoutLevelButton.setLabel(getLayoutLevelButtonLabel());
    }

    function getLayoutLevelButtonLabel() {
        return "Layout Level " + levelLabels[level];
    }
}

createLayoutLevelButton(CharacterPositionLayoutLevel.PANEL);
createLayoutLevelButton(CharacterPositionLayoutLevel.BACKGROUND);
createLayoutLevelButton(CharacterPositionLayoutLevel.SCENE);
createLayoutLevelButton(CharacterPositionLayoutLevel.DEFAULT);
