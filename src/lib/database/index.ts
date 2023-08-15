import { Api } from '../api';
import { Collection } from '../collections';

export class Database implements Database.IInstance {

    private api: Api.IInstance;

    constructor(config: Database.IConfig) {
        this.api = new Api(config);    
    }

    public getCollection<T = never>(target: Collection.EntityConstructor<T>) {
        return new Collection<T>(target, this.api);
    }

}