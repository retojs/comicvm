export type RenderFrameFn = (currentTime: number) => void;
export type OnSpacePressedFn = (event: KeyboardEvent) => void;

export class Player {

    isPlaying = false;
    startTime: number;
    pauseTime: number;

    renderFrameFn: RenderFrameFn;
    onSpacePressedFn: OnSpacePressedFn;

    constructor(renderFrameFn?: RenderFrameFn, onSpacePressedFn?: OnSpacePressedFn) {
        this.renderFrameFn = renderFrameFn;
        this.onSpacePressedFn = onSpacePressedFn;
        this.setupKeyListeners();
    }

    get currentTime() {
        return Date.now() - this.startTime;
    }

    reset() {
        this.isPlaying = false;
        this.startTime = null;
        this.pauseTime = 0;
    }

    play(): void {
        this.startTime = Date.now() - (this.pauseTime || 0);
        this.isPlaying = true;
        this.nextFrame();
    }

    pause(): void {
        this.pauseTime = this.currentTime;
        this.isPlaying = false;
    }

    nextFrame() {
        if (this.isPlaying) {
            window.requestAnimationFrame(this.renderAnimationFrame.bind(this));
        }
    }

    renderAnimationFrame() {
        if (this.isPlaying) {
            this.renderFrameFn(this.currentTime);
            this.nextFrame();
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