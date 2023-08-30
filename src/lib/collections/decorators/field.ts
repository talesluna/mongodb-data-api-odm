export const Field = (config?: Partial<Collection.EntityField>) => (target: any, key: string) => {
    target.__entity__ = {
        ...target.__entity__!,
        fields: {
            ...target.__entity__?.fields,
            [key]: {
                name: config?.name || key,
                required: !!config?.required,
                
            }
        }
    }
}