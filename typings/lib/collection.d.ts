declare namespace Collection {

    interface EntityField {
        required: boolean;
    }

    interface Entity {
        name: string;
        fields: Record<string, EntityField>
    }

    interface EntityConstructor<T = any> {
        __entity__?: Entity;
        new(): T;
    }

    type Doc<T> = Omit<T, '_id'> & { _id: string };
    type DocIn<T> = Omit<T, '_id'>;

    interface IConstructor<T> {
        new(target: Collection.EntityConstructor<T>, api: Api.IInstance): IInstance<T>;
    }

    interface IInstance<T> {
    
        // (C) INSERT
        create(document: DocIn<T>): Promise<Doc<T>>;
        insert(document: DocIn<T>): Promise<Doc<T>>;
        insertMany(document: DocIn<T>[]): Promise<Doc<T>[]>;

        // (R) FIND
        find(filter?: ApiActions.Filter<T>, projection?: ApiActions.Projection<T>, options?: { sort?: ApiActions.Sort<T>; limit?: number }): Promise<Doc<T>[]>;
        findOne(filter: ApiActions.Filter<T>, projection?: ApiActions.Projection<T>): Promise<Doc<T> | null>;
        findById(id: string, projection?: ApiActions.Projection<T>): Promise<Doc<T> | null>;

        // (U) UPDATE
        updateOne(filter: ApiActions.Filter<T>, data: Partial<DocIn<T>>): Promise<ApiActionResponses.IUpdate>;
        updateById(id: string, data: Partial<DocIn<T>>): Promise<ApiActionResponses.IUpdate>;
        updateMany(filter: ApiActions.Filter<T>, data: Partial<DocIn<T>>): Promise<ApiActionResponses.IUpdate>;
        findOneAndUpdate(filter: ApiActions.Filter<T>, data: Partial<DocIn<T>>): Promise<Doc<T> | null>;
        findByIdAndUpdate(id: string, data: Partial<DocIn<T>>): Promise<Doc<T> | null>;

        // (D) DELETE
        deleteOne(filter: ApiActions.Filter<T>): Promise<ApiActionResponses.IDelete>;
        deleteById(id: string): Promise<ApiActionResponses.IDelete>;
        deleteMany(filter: ApiActions.Filter<T>): Promise<ApiActionResponses.IDelete>;
        findOneAndDelete(filter: ApiActions.Filter<T>): Promise<Doc<T> | null>;
        findByIdAndDelete(id: string): Promise<T | null>;

    }

}