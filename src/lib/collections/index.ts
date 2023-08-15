import { CollectionDocument } from './document';

export class Collection<T = unknown> implements Collection.IInstance<T> {

    private name: string;
    private document: CollectionDocument<T>;

    /**
     *
     * @param target
     * @param api
     */
    constructor(target: Collection.EntityConstructor<T>, private api: Api.IInstance) {
        this.name = target.__entity__?.name!;
        this.document = new CollectionDocument(target);
    }

    public async insert(document: Collection.DocIn<T>) {
        const response = await this.api.insert(this.getActionPayload({ document }));
        return this.document.parse({ ...document, _id: response.insertedId });
    }

    public async create(data: Collection.DocIn<T>) {
        return this.insert(data);
    }

    public async insertMany(documents: Collection.DocIn<T>[]) {
        const response = await this.api.insertMany(this.getActionPayload({ documents }));
        return response.insertedIds.map((_id, index) => this.document.parse({ _id, ...documents[index] }));
    }

    public async find(filter?: ApiActions.Filter, projection?: ApiActions.Projection, options?: { sort?: ApiActions.Sort; limit?: number; }) {
        const response = await this.api.find<T>(this.getActionPayload({ filter, projection, ...options }));
        return this.document.parse(response.documents);
    }

    public async findOne(filter: ApiActions.Filter, projection?: ApiActions.Projection) {
        const response = await this.api.findOne<T>(this.getActionPayload({ filter, projection }));
        return response.document ? this.document.parse(response.document) : null;
    }

    public async findById($oid: string, projection?: ApiActions.Projection) {
        return this.findOne({ _id: { $oid }}, projection);
    }

    public async updateOne(filter: ApiActions.Filter, data: Collection.DocIn<T>) {
        const response = await this.api.updateOne(this.getActionPayload({ filter, update: { $set: data } }));
        return response;
    }

    public updateById($oid: string, data: Collection.DocIn<T>) {
        return this.updateOne({ _id: { $oid }}, data);
    }

    public async updateMany(filter: ApiActions.Filter, data: Collection.DocIn<T>) {
        const response = await this.api.updateMany(this.getActionPayload({ filter, update: { $set: data } }));
        return response;
    }

    public async findByIdAndUpdate($oid: string, data: Collection.DocIn<T>) {
        const update = await this.updateById($oid, data);
        return update.modifiedCount ? this.findById($oid) : null;
    }

    public async findOneAndUpdate(filter: ApiActions.Filter, data: Collection.DocIn<T>) {
        const doc = await this.findOne(filter, { _id: true });
        return this.findByIdAndUpdate((doc as any)._id, data);
    }

    public async deleteOne(filter: ApiActions.Filter) {
        const response = await this.api.deleteOne(this.getActionPayload({ filter }));
        return response;
    }

    public deleteById($oid: string) {
        return this.deleteOne({ _id: { $oid } });
    }

    public async deleteMany(filter: ApiActions.Filter) {
        const response = await this.api.deleteMany(this.getActionPayload({ filter }));
        return response;
    }

    public async findByIdAndDelete($oid: string) {
        const data = await this.findById($oid);
        const deletion = data ? await this.deleteById($oid) : null;
        return deletion ? data : null;
    }

    public async findOneAndDelete(filter: ApiActions.Filter) {
        const data = await this.findOne(filter, { _id: true });
        const deletion = data ? await this.deleteById((data as any)._id) : null;
        return deletion ? data : null;
    }

    /**
     *
     * @param name
     * @param args 
     * @returns
     */
    private getActionPayload<L>(custom: L) {
        return { collection: this.name, ...custom, };
    }

}
