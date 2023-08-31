type CollectionData = Record<string, any>;

export class CollectionDocument<T> {

    public static create<T>(target: Collection.EntityConstructor<T>, data: CollectionData): Collection.Doc<T> {

        const fields = this.parseFields<T>(target, data);

        const doc = new target();

        Object.keys(fields).forEach(field => {
            Object.defineProperty(doc, field, { value: fields[field], writable: false });
        });

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

    public static parseFields<T>({ __entity__: entity }: Collection.EntityConstructor<T>, data: CollectionData, set?: 'update' | 'insert'): CollectionData {

        if (!entity || !entity.name || !entity.fields) {
            return {};
        }
        
        const { fields, name: collectionName, timestamps  } = entity;

        if (set === 'insert' && timestamps && !data.createdAt) {
            data.createdAt = new Date();
        }

        if (set === 'update' && timestamps) {
            data.updatedAt = new Date();
        }

        return Object.keys(fields).reduce<CollectionData>((doc, field) => {

            const { name, required } = fields[field];

            const valueKey = set ? field : name;
            const fieldKey = set ? name : field;

            const value = (data as never)[valueKey];

            if (!value && required) {
                throw new Error(`${collectionName}.${field} is required`);
            }

            if (fieldKey === '_id' && set && !value) {
                return doc;
            }

            return {
                ...doc,
                [fieldKey]: value,
            };

        }, {});

    }

}