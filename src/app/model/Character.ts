import { Square } from "../trigo/Square";

export class Character {

    name: string;
    how: string[] = [];

    defaultPosition?: Square;
    backgroundPosition?: Square;
    panelPosition?: Square;

    constructor(name: string, how?: string[]) {
        this.name = name;
        if (how && how.length > 0) {
            how.forEach(q => this.addQualifier(q));
        }
    }

    addQualifier(how: string) {
        if (!this.hasQualifier(how)) {
            this.how.push(how);
        }
    }

    hasQualifier(qualifier: string): boolean {
        return this.how.indexOf(qualifier) > -1;
    }
}