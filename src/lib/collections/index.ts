import { CollectionDocument } from './document';

export class Collection<T = unknown> implements Collection.IInstance<T> {

    /**
     *
     * @param target
     * @param api
     */
    constructor(private target: Collection.EntityConstructor<T>, private api: Api.IInstance) { }

    public async insert(data: Collection.DocIn<T>) {
        const document = this.getInsertionDoc(data, 'insert');
        const response = await this.api.insert(this.getActionPayload({ document }));
        return this.getDoc({ ...document, _id: response.insertedId });
    }

    public async create(data: Collection.DocIn<T>) {
        return this.insert(data);
    }

    public async insertMany(data: Collection.DocIn<T>[]) {
        const documents = data.map(doc => this.getInsertionDoc(doc, 'insert'));
        const response = await this.api.insertMany(this.getActionPayload({ documents }));
        return response.insertedIds.map((_id, index) => this.getDoc({ _id, ...documents[index] }));
    }

    public async find(filter?: ApiActions.Filter, projection?: ApiActions.Projection, options?: { sort?: ApiActions.Sort; limit?: number; }) {
        const response = await this.api.find<T>(this.getActionPayload({ filter, projection, ...options }));
        return response.documents.map(doc => this.getDoc(doc));
    }

    public async findOne(filter: ApiActions.Filter, projection?: ApiActions.Projection) {
        const response = await this.api.findOne<T>(this.getActionPayload({ filter, projection }));
        return response.document ? this.getDoc(response.document) : null;
    }

    public async findById($oid: string, projection?: ApiActions.Projection) {
        return this.findOne({ _id: { $oid } }, projection);
    }

    public async updateOne(filter: ApiActions.Filter, data: Collection.DocIn<T>) {
        const $set = this.getInsertionDoc(data, 'update');
        const response = await this.api.updateOne(this.getActionPayload({ filter, update: { $set } }));
        return response;
    }

    public updateById($oid: string, data: Collection.DocIn<T>) {
        return this.updateOne({ _id: { $oid } }, data);
    }

    public async updateMany(filter: ApiActions.Filter, data: Collection.DocIn<T>) {
        const $set = this.getInsertionDoc(data, 'update');
        const response = await this.api.updateMany(this.getActionPayload({ filter, update: { $set } }));
        return response;
    }

    public async findByIdAndUpdate($oid: string, data: Collection.DocIn<T>) {
        const update = await this.updateById($oid, data);
        return update.modifiedCount ? this.findById($oid) : null;
    }

    public async findOneAndUpdate(filter: ApiActions.Filter, data: Collection.DocIn<T>) {
        const doc = await this.findOne(filter, { _id: true });
        return doc ? this.findByIdAndUpdate(doc.toOriginal()._id, data) : null;
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
        const deletion = data ? await this.deleteById(data.toOriginal()._id) : null;
        return deletion ? data : null;
    }

    /**
     * Construct the document result instance
     *
     * @param docuemnt
     * @returns 
     */
    private getDoc<L>(docuemnt: L & { _id: string }) {
        return CollectionDocument.create<T>(this.target, docuemnt);
    }

    /**
    * Return document fields for insertion
    *
    * @param docuemnt
    * @returns 
    */
    private getInsertionDoc<L>(docuemnt: L & { _id?: undefined }, set: 'update' | 'insert') {
        return CollectionDocument.parseFields<T>(this.target, docuemnt, set);
    }

    /**
     * Build the a action payload object
     *
     * @param name
     * @param args 
     * @returns
     */
    private getActionPayload<L>(custom: L) {
        return { collection: this.target.__entity__!.name, ...custom, };
    }

}
