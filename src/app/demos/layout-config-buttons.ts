import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/LayoutConfig";
import { ScenePainter } from "../paint/ScenePainter";
import { Button } from "../dom/Button";

export function create(scenePainter: ScenePainter) {

    function repaint() {
        scenePainter.repaintScene();
    }

    (function createToggleZoomButton() {
        const toggleZoomButton = new Button("buttons", getToggleZoomButtonLabel(), toggleZoom);

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
        const togglePanningButton = new Button("buttons", getTogglePanningButtonLabel(), togglePanning);

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

        const layoutLevelButton = new Button("buttons", getLayoutLevelButtonLabel(), setLayoutLevel);

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
}