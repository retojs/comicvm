import { ComicVM } from "../ComicVM";

export function create() {

    ComicVM.loadStory("Mariel")
        .then(comicVM => {
            console.log("comicVM created:", comicVM);
            comicVM.paintScene(0);
        });
}