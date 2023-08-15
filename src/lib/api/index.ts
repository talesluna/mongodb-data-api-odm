import { ApiError } from './error';
import axios, { AxiosError } from 'axios';

export class Api implements Api.IInstance {

    private endpoint;
    private database;
    private datasource;

    constructor({ database, datasource, credentials, endpoint }: Database.IConfig) {
        
        this.database = database;
        this.datasource = datasource;
        
        this.endpoint = axios.create({
            baseURL: endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
            }
        });

        if ('key' in credentials) {
            this.endpoint.defaults.headers['apiKey'] = credentials.key;
        }

        if ('email' in credentials && 'password' in credentials) {
            this.endpoint.defaults.headers['email'] = credentials.email;
            this.endpoint.defaults.headers['password'] = credentials.password;
        }

        if ('bearer' in credentials) {
            this.endpoint.defaults.headers['Authorization'] = `Bearer ${credentials.bearer}`;
        }
    }

    insert(action: ApiActions.IInsertOne): Promise<ApiActionResponses.IInsertOne> {
        return this.runAction('insertOne', action);
    }
    insertMany(action: ApiActions.IInsertMany): Promise<ApiActionResponses.IInsertMany> {
        return this.runAction('insertMany', action);
    }
    find<T>(action: ApiActions.IFind): Promise<ApiActionResponses.IFind<T>> {
        return this.runAction('find', action);
    }
    findOne<T>(action: ApiActions.IFindOne): Promise<ApiActionResponses.IFindOne<T>> {
        return this.runAction('findOne', action);
    }
    updateOne(action: ApiActions.IUpdateOne): Promise<ApiActionResponses.IUpdate> {
        return this.runAction('updateOne', action);
    }
    updateMany(action: ApiActions.IUpdateMany): Promise<ApiActionResponses.IUpdate> {
        return this.runAction('updateMany', action);
    }
    deleteOne(action: ApiActions.IDelete): Promise<ApiActionResponses.IDelete> {
        return this.runAction('deleteOne', action);
    }
    deleteMany(action: ApiActions.IDelete): Promise<ApiActionResponses.IDelete> {
        return this.runAction('deleteMany', action);
    }

    /**
     *
     * @param path
     * @param action
     * @returns 
     */
    private async runAction<T>(action: string, payload: Record<string, any>) {
        try {
            const { data } = await this.endpoint.post<T>(`/action/${action}`, {
                ...payload,
                database: this.database,
                dataSource: this.datasource,
            });
    
            return data;
        } catch (error) {
            throw error instanceof AxiosError
                ? ApiError.fromAxiosError(error)
                : new ApiError((error as Error).message, 'Unknown', 'unknown');
        }
    }

}