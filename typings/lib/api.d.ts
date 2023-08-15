declare namespace Api {

    interface IConstructor {
        new(dConfig: Database.IConfig): IInstance;
    }

    interface IInstance {

        // (C) INSERT
        insert(action: ApiActions.IInsertOne): Promise<ApiActionResponses.IInsertOne>;
        insertMany(action: ApiActions.IInsertMany): Promise<ApiActionResponses.IInsertMany>;

        // (R) FIND
        find<T>(action: ApiActions.IFind): Promise<ApiActionResponses.IFind<T>>;
        findOne<T>(action: ApiActions.IFindOne): Promise<ApiActionResponses.IFindOne<T>>;

        // (U) UPDATE
        updateOne(action: ApiActions.IUpdateOne): Promise<ApiActionResponses.IUpdate>;
        updateMany(action: ApiActions.IUpdateMany): Promise<ApiActionResponses.IUpdate>;

        // (D) DELETE
        deleteOne(action: ApiActions.IDelete): Promise<ApiActionResponses.IDelete>;
        deleteMany(action: ApiActions.IDelete): Promise<ApiActionResponses.IDelete>;
        
    }

}