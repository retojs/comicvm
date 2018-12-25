import { Qualifier } from "../model/Qualifier";

export const STORY_TELLER = "STORYTELLER";

export enum PlotItemType {
    SAYS = "says",
    DOES = "does",
    TOLD = "told",
    DESC = "desc"
}

export interface PlotItemSpec {

    who?: string[];

    does?: string;
    says?: string;

    how?: Qualifier[];
    whoWith?: string[];
    description?: string;
    told?: string;
}

export class PlotItem {

    _index: number;
    _type: PlotItemType;

    _actors: string[] = [];
    _action: string;

    _qualifiers: Qualifier[] = [];
    _characters: string[] = [];
    _description: string;
    _told: string;

    constructor(spec: PlotItemSpec) {
        if (!!spec.does) {
            this._action = spec.does.trim();
            this._type = PlotItemType.DOES;
        } else if (!!spec.says) {
            this._action = spec.says.trim();
            this._type = PlotItemType.SAYS;
        }

        this._actors = spec.who || [];
        this._characters = spec.whoWith || [];
        this._qualifiers = spec.how || [];
        this._description = spec.description ? spec.description.trim() : undefined;
        this._told = spec.told ? spec.told.trim() : undefined;

        this.normalize();
    }

    get who(): string[] {
        return this._actors;
    }

    set who(who: string[]) {
        this._actors = who || [];
        this.normalize();
    }

    get whoWith(): string[] {
        return this._characters.filter(name => this._actors.indexOf(name) < 0);
    }

    set whoWith(whoWith: string[]) {
        this._characters = whoWith || [];
        this.normalize();
    }

    get does(): string {
        return this._type === PlotItemType.DOES ? this._action : undefined;
    }

    set does(does: string) {
        this._action = does;
        this._type = PlotItemType.DOES;
        this.normalize();
    }

    get says(): string {
        return this._type === PlotItemType.SAYS ? this._action : undefined;
    }

    set says(says: string) {
        this._action = says;
        this._type = PlotItemType.SAYS;
        this.normalize();
    }

    get how(): Qualifier[] {
        return this._qualifiers;
    }

    set how(how: Qualifier[]) {
        this._qualifiers = how || [];
        this.normalize();
    }

    get isDescription(): boolean {
        return this._type === PlotItemType.DESC;
    }

    get isTold(): boolean {
        return this._type === PlotItemType.TOLD;
    }

    get isDoes(): boolean {
        return this._type === PlotItemType.DOES;
    }

    get isSays(): boolean {
        return this._type === PlotItemType.SAYS;
    }

    normalize() {

        // assign what the storyteller says to the _told property
        if (this.who && this.who.length > 0 && this.who[0].trim() === STORY_TELLER) {
            this._told = this._action;
        }

        // remove duplicates
        this._actors = this._actors.filter((name, index) => this._actors.indexOf(name) === index);
        this._characters = this._characters.filter((name, index) => this._characters.indexOf(name) === index && !(this._actors.indexOf(name) > -1));

        if (this._description) {
            this._type = PlotItemType.DESC;
        }
        if (this._told) {
            this._type = PlotItemType.TOLD
        }
    }

    clone(): PlotItem {
        return new PlotItem({
            who: this.who,
            does: this.does,
            says: this.says,
            how: this.how,
            whoWith: this.whoWith,
            description: this._description,
            told: this._told
        });
    }

    toString(): string {
        return `PlotItem: ${this._index}:
        who: ${this.who},
        does: ${this.does || ''},
        says: ${this.says || ''},
        how: ${JSON.stringify(this.how)},
        whoWith: ${this.whoWith},
        description: ${this._description || ''},
        told: ${this._told || ''}
        `;
    }
}


