export type RenderFrameFn = (currentTime: number) => void;
export type OnSpacePressedFn = (event: KeyboardEvent) => void;

const LOG_EVERY_NTH_FRAME = 500;

export class Player {

    name = "Anonymous player";

    isPlaying = false;
    startTime: number;
    pauseTime: number;

    renderFrameFn: RenderFrameFn;
    onSpacePressedFn: OnSpacePressedFn;

    frameCount = 0;

    constructor(renderFrameFn?: RenderFrameFn, onSpacePressedFn?: OnSpacePressedFn, name?: string) {
        this.renderFrameFn = renderFrameFn;
        this.onSpacePressedFn = onSpacePressedFn;
        this.name = name || this.name;
        this.setupKeyListeners();
    }

    get currentTime() {
        return Date.now() - this.startTime;
    }

    resetPlayer() {
        this.isPlaying = false;
        this.startTime = null;
        this.pauseTime = 0;
        console.log(this.name + " was reset");
    }

    play(): void {
        this.frameCount = 0;
        this.startTime = Date.now() - (this.pauseTime || 0);
        this.isPlaying = true;
        this.nextFrame();
        console.log(this.name + " started");
    }

    pause(): void {
        this.pauseTime = this.currentTime;
        this.isPlaying = false;
        console.log(this.name + " paused");
    }

    nextFrame() {
        if (this.isPlaying) {
            window.requestAnimationFrame(this.renderAnimationFrame.bind(this));
        }
    }

    renderAnimationFrame() {
        if (this.isPlaying) {
            this.renderFrameFn(this.currentTime);
            this.logFrame();
            this.nextFrame();
        }
    }

    logFrame() {
        if (this.frameCount++ >= LOG_EVERY_NTH_FRAME) {
            console.log(this.name + " is running...");
            this.frameCount = 0;
        }
    }

    setupKeyListeners() {
        window.document.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === ' ') {
                // console.log("space pressed, player is " + (this.isPlaying ? 'playing' : 'not playing'), this);
                if (this.onSpacePressedFn) {
                    this.onSpacePressedFn(event);
                }
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            }
        })
    }

}