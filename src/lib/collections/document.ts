export class CollectionDocument<T> {

    public static create<T>(target: Collection.EntityConstructor<T>, data: Record<string, any>): Collection.Doc<T> {

        const doc = new target();

        const entity = target.__entity__!;

        Object.keys(entity.fields).forEach(field => {

            const { name, required } = entity.fields[field];

            const value = (data as never)[name];

            if (!value && required) {
                throw new Error(`${entity.name}.${field} is required`);
            }

            Object.defineProperty(doc, field, { value, writable: false });

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

}