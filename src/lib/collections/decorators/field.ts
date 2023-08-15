export const Field = (config?: Collection.EntityField) => (target: { __proto__: Collection.EntityConstructor }, key: string) => {
    target.__proto__.__entity__ = {
        ...target.__proto__.__entity__!,
        fields: {
            ...target.__proto__.__entity__?.fields,
            [key]: config || {
                required: false,
            }
        }
    }
}