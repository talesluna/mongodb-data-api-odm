export class CollectionDocument<T> {

    private entity: Collection.Entity;

    constructor(private target: Collection.EntityConstructor<T>) {
        this.entity = target.__entity__!;
    }

    /**
     * 
     * @param data
     * @returns
     */
    public parse<L>(data: L): L {
        if (Array.isArray(data)) {
            return data.map(data => this.parse(data)) as L;
        }

        const doc = new this.target();
        Object.keys(this.entity.fields).forEach(field => {

            const value = (data as never)[field];
            const config = this.entity.fields[field];

            if (!value && config.required) {
                throw new Error(`${this.entity.name}.${field} is required`);
            }

            Object.defineProperty(doc, field, { value, writable: false });

        });

        return doc as never as L;
    }
}