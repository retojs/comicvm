import "../style/app.scss";

import * as characterPositonDemo from "./character-position.demo";
import * as bubblesDemo from "./bubble.demo";
import { HTMLImage } from "./images/HTMLImage";

characterPositonDemo.create();
bubblesDemo.create();

const marielImage = new HTMLImage("sample-images/characters/main-beach.mariel.backpack.png", "images");