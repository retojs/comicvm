import { CharacterPositionLayoutLevel, LayoutConfig } from "../app/layout/Layout.config";
import { Button } from "../app/dom/Button";
import { DomElementContainer } from "../app/dom/DomElement";
import { Div } from "../app/dom/Div";

export function create(container: DomElementContainer, repaintFn: () => void) {

    const buttonContainer = new Div(container, "buttons");

    (function createToggleZoomButton() {
        const toggleZoomButton = new Button(buttonContainer, getToggleZoomButtonLabel());
        toggleZoomButton.onClick = toggleZoom;

        function toggleZoom() {
            LayoutConfig.applyZoom = !LayoutConfig.applyZoom;
            repaintFn();
            toggleZoomButton.label = getToggleZoomButtonLabel();
        }

        function getToggleZoomButtonLabel() {
            return "Apply Zoom (" + (LayoutConfig.applyZoom ? "On" : "Off") + ")";
        }
    })();

    (function createTogglePanningButton() {
        const togglePanningButton = new Button(buttonContainer, getTogglePanningButtonLabel());
        togglePanningButton.onClick = togglePanning;

        function togglePanning() {
            LayoutConfig.applyPanning = !LayoutConfig.applyPanning;
            repaintFn();
            togglePanningButton.label = getTogglePanningButtonLabel();
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

        const layoutLevelButton = new Button(buttonContainer, getLayoutLevelButtonLabel());
        layoutLevelButton.onClick = setLayoutLevel;

        function setLayoutLevel() {
            LayoutConfig.characterPositionLayoutLevel = level;
            repaintFn();
            layoutLevelButton.label = getLayoutLevelButtonLabel();
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