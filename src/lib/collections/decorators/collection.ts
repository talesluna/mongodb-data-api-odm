export const Collection = (config: string | Collection.Config) => <L>(target: Collection.EntityConstructor<L>) => {

    const name = typeof config === 'string' ? config : config.name;
    const timestamps = typeof config === 'string' ? false : !!config.timestamps;

    const currentDefs = (Object.getOwnPropertyDescriptors(target).prototype.value as typeof target).__entity__!;

    if (timestamps) {
        currentDefs.fields.createdAt = {
            name: 'createdAt',
            required: false,
        },
        currentDefs.fields.updatedAt = {
            name: 'updatedAt',
            required: false,
        }
    }

    target.__entity__ = {
        ...currentDefs,
        name,
        timestamps,
    };
}
