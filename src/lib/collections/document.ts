type CollectionData = Record<string, any>;

export class CollectionDocument<T> {

    public static create<T>(target: Collection.EntityConstructor<T>, data: CollectionData): Collection.Doc<T> {

        const fields = this.parseFields<T>(target, data);

        const doc = new target();

        Object.keys(fields).forEach(field => {
            Object.defineProperty(doc, field, { value: fields[field], writable: false });
        })

        // const entity = target.__entity__!;

        // Object.keys(entity.fields).forEach(field => {

        //     const { name, required } = entity.fields[field];

        //     const value = (data as never)[name];

        //     if (!value && required) {
        //         throw new Error(`${entity.name}.${field} is required`);
        //     }

        //     Object.defineProperty(doc, field, { value, writable: false });

        // });

        Object.defineProperties(doc, {
            toObject: {
                writable: false,
                enumerable: true,
                value({ getters }: { getters?: boolean } = {}) {
                    const data: Record<string, any> = {};

                    Object.keys(doc as never).forEach(key => {
                        if (typeof (doc as never)[key] !== 'function') {
                            data[key] = (doc as never)[key];
                        }
                    });

                    if (getters) {
                        const proto = Object.getPrototypeOf(doc);
                        Object.getOwnPropertyNames(proto).forEach(key => {
                            const desc = Object.getOwnPropertyDescriptor(proto, key);
                            if (typeof desc?.get === 'function') {
                                data[key] = desc.get.apply(doc);
                            }
                        });
                    }

                    return data;
                }
            },
            toOriginal: {
                writable: false,
                enumerable: true,
                value() {
                    return data;
                }
            },
        });

        return doc as never;

    }

    public static parseFields<T>(target: Collection.EntityConstructor<T>, data: CollectionData, insertion = false): CollectionData {

        const doc = {};

        const { __entity__: entity } = target;

        return !entity?.fields ? doc : Object.keys(entity.fields).reduce((doc, field) => {

            const { name, required } = entity.fields[field];

            const valueKey = insertion ? field : name;
            const fieldKey = insertion ? name : field;

            const value = (data as never)[valueKey];

            if (!value && required) {
                throw new Error(`${entity.name}.${field} is required`);
            }

            if (fieldKey === '_id' && insertion && !value) {
                return doc;
            }

            return {
                ...doc,
                [fieldKey]: value,
            };

        }, doc);

    }

}