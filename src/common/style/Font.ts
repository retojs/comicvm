export class Font {

    constructor(
        public size,
        public family,
    ) {}

    toString(): string {
        return this.size + "px " + this.family;
    }
}