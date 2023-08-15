export const Collection = (name: string) => <L>(target: Collection.EntityConstructor<L>) => {
    target.__entity__ = { ...target.__entity__!, name };
}
