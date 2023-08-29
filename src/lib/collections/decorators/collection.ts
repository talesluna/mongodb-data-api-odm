export const Collection = (name: string) => <L>(target: Collection.EntityConstructor<L>) => {
    target.__entity__ = {
        ...Object.getOwnPropertyDescriptors(target).prototype.value.__entity__,
        name
    };
}
