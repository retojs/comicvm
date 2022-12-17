import { LayoutLevel, LayoutConfig } from "../../app/layout/Layout.config";
import { Button } from "../../common/dom/Button";
import { DomElementContainer } from "../../common/dom/DomElement";
import { Div } from "../../common/dom/Div";

export function create(container: DomElementContainer, repaintFn: () => void, layoutConfig: LayoutConfig = new LayoutConfig()) {

    const buttonContainer = new Div(container, "buttons");

    (function createToggleZoomButton() {
        const toggleZoomButton = new Button(buttonContainer, getToggleZoomButtonLabel());
        toggleZoomButton.onClick = toggleZoom;

        function toggleZoom() {
            layoutConfig.applyZoom = !layoutConfig.applyZoom;
            repaintFn();
            toggleZoomButton.label = getToggleZoomButtonLabel();
        }

        function getToggleZoomButtonLabel() {
            return "Apply Zoom (" + (layoutConfig.applyZoom ? "On" : "Off") + ")";
        }
    })();

    (function createTogglePanningButton() {
        const togglePanningButton = new Button(buttonContainer, getTogglePanningButtonLabel());
        togglePanningButton.onClick = togglePanning;

        function togglePanning() {
            layoutConfig.applyPanning = !layoutConfig.applyPanning;
            repaintFn();
            togglePanningButton.label = getTogglePanningButtonLabel();
        }

        function getTogglePanningButtonLabel() {
            return "Apply Panning (" + (layoutConfig.applyPanning ? "On" : "Off") + ")";
        }
    })();

    function createLayoutLevelButton(level: LayoutLevel) {

        const levelLabels = {};
        levelLabels[LayoutLevel.PANEL] = "Panel";
        levelLabels[LayoutLevel.BACKGROUND] = "Background";
        levelLabels[LayoutLevel.SCENE] = "Scene";
        levelLabels[LayoutLevel.DEFAULT] = "Default";

        const layoutLevelButton = new Button(buttonContainer, getLayoutLevelButtonLabel());
        layoutLevelButton.onClick = setLayoutLevel;

        function setLayoutLevel() {
            layoutConfig.layoutLevel = level;
            repaintFn();
            layoutLevelButton.label = getLayoutLevelButtonLabel();
        }

        function getLayoutLevelButtonLabel() {
            return "Layout Level " + levelLabels[level];
        }
    }

    createLayoutLevelButton(LayoutLevel.PANEL);
    createLayoutLevelButton(LayoutLevel.BACKGROUND);
    createLayoutLevelButton(LayoutLevel.SCENE);
    createLayoutLevelButton(LayoutLevel.DEFAULT);
}