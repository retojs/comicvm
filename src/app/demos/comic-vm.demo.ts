import { ComicVM } from "../ComicVM";
import * as layoutConfigButtons from "./layout-config-buttons";

export function create() {

    ComicVM.loadStory("Mickey")
        .then(comicVM => {
            console.log("comicVM created:", comicVM);

            comicVM.paintScene(comicVM.getScene(1));

            layoutConfigButtons.create(comicVM.repaintScene.bind(comicVM));
        });

}