import { CharacterPositionLayoutLevel, LayoutConfig } from "../layout/LayoutConfig";
import { Button } from "../dom/Button";

export function create(repaintFn: () => void) {

    (function createToggleZoomButton() {
        const toggleZoomButton = new Button("buttons", getToggleZoomButtonLabel());
        toggleZoomButton.onClick = toggleZoom;

        function toggleZoom() {
            LayoutConfig.applyZoom = !LayoutConfig.applyZoom;
            repaintFn();
            toggleZoomButton.setLabel(getToggleZoomButtonLabel());
        }

        function getToggleZoomButtonLabel() {
            return "Apply Zoom (" + (LayoutConfig.applyZoom ? "On" : "Off") + ")";
        }
    })();

    (function createTogglePanningButton() {
        const togglePanningButton = new Button("buttons", getTogglePanningButtonLabel());
        togglePanningButton.onClick = togglePanning;

        function togglePanning() {
            LayoutConfig.applyPanning = !LayoutConfig.applyPanning;
            repaintFn();
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

        const layoutLevelButton = new Button("buttons", getLayoutLevelButtonLabel());
        layoutLevelButton.onClick = setLayoutLevel;

        function setLayoutLevel() {
            LayoutConfig.characterPositionLayoutLevel = level;
            repaintFn();
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