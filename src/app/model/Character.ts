export class Character {

    name: string;
    how: string[] = [];
    pos?: Position;

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