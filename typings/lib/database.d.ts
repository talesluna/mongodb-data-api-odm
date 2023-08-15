interface IConfigKeyCredentials {
    key: string;
}

interface IConfigEmailAndPasswordCredentials {
    email: string;
    password: string;
}

interface IConfigBearerTokenCredentials {
    bearer: string;
}

declare namespace Database {

    interface IConfig {
        endpoint: string;
        database: string;
        datasource: string;
        credentials: IConfigKeyCredentials | IConfigEmailAndPasswordCredentials | IConfigBearerTokenCredentials;
    }

    export interface IConstructor {
        new(config: IConfig): IInstance;
    }

    interface IInstance {
        getCollection<T = never>(target: Collection.EntityConstructor<T>): Collection.IInstance<T>;
    }

}