import { AxiosError } from 'axios';

import { Api } from '../../../src/lib/api';
import { ApiError } from '../../../src/lib/api/error';

describe('Api', () => {

    const mockConfig: Omit<Database.IConfig, 'credentials'> = {
        database: 'my-db',
        datasource: 'my-ds',
        endpoint: 'https://localhost',
    };

    describe('Instance', () => {

        let api: Api;

        test('Should instantiate new Api with API key credential', () => {

            const mockKey = Date.now().toString();
            api = new Api({ ...mockConfig, credentials: { key: mockKey } });

            expect(api).toBeInstanceOf(Api);
            expect(api['endpoint'].defaults.headers['apiKey']).toEqual(mockKey);

        });

        test('Should instantiate new Api with email and password credentials', () => {

            const mockEmailAndPassword = {
                email: 'a@a',
                password: Date.now().toString(),
            };

            api = new Api({ ...mockConfig, credentials: mockEmailAndPassword });

            expect(api).toBeInstanceOf(Api);
            expect(api['endpoint'].defaults.headers['email']).toEqual(mockEmailAndPassword.email);
            expect(api['endpoint'].defaults.headers['password']).toEqual(mockEmailAndPassword.password);

        });

        test('Should instantiate new Api with bearer token credential', () => {

            const mockBearerToken = 'my-token';
            api = new Api({ ...mockConfig, credentials: { bearer: mockBearerToken } });

            expect(api).toBeInstanceOf(Api);
            expect(api['endpoint'].defaults.headers['Authorization']).toEqual(`Bearer ${mockBearerToken}`);

        });

        afterAll(() => {
            expect(api).toBeDefined();

            expect(api.find).toBeDefined();
            expect(api.findOne).toBeDefined();

            expect(api.insert).toBeDefined();
            expect(api.insertMany).toBeDefined();

            expect(api.updateOne).toBeDefined();
            expect(api.updateMany).toBeDefined();

            expect(api.deleteOne).toBeDefined();
            expect(api.deleteMany).toBeDefined();
        });

    });

    describe('Actions', () => {

        const api = new Api({ ...mockConfig, credentials: { key: 'key' } });

        const spyApiEndpointPost = jest.spyOn(api['endpoint'], 'post');

        beforeEach(() => {
            spyApiEndpointPost.mockResolvedValue({ data: null });
        });

        describe('(C) Insert', () => {

            test('Should insert one document', async () => {

                const mockAction: ApiActions.IInsertOne = {
                    collection: 'my-collection',
                    document: {
                        name: Date.now().toString(),
                        status: 'active',
                    }
                };

                const mockInsertedId = '507f191e810c19729de860ea';

                spyApiEndpointPost.mockResolvedValue({ data: { insertedId: mockInsertedId } });

                const result = await api.insert(mockAction);

                expect(result.insertedId).toEqual(mockInsertedId);
                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/insertOne', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

            test('Should insert many documents', async () => {

                const mockAction: ApiActions.IInsertMany = {
                    collection: 'my-collection',
                    documents: new Array(9).map((_, index) => ({
                        name: (Date.now() * index).toString(),
                        status: 'active',
                    })),
                };

                const mockInsertedIds = mockAction.documents.map((_, index) => `507f191e810c19729de860e${index}`);

                spyApiEndpointPost.mockResolvedValue({ data: { insertedIds: mockInsertedIds } });

                const result = await api.insertMany(mockAction);

                expect(result.insertedIds).toMatchObject(mockInsertedIds);

                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/insertMany', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

        });


        describe('(R) Find', () => {

            test('Should find one document on data api', async () => {

                const mockDocument = {
                    _id: '507f191e810c19729de860ea',
                    name: Date.now().toString(),
                    status: 'active',
                };

                const mockAction: ApiActions.IFindOne = {
                    collection: 'my-collection',
                    filter: {
                        status: 'active',
                    },
                    projection: {
                        _id: 1,
                        name: true,
                    }
                };

                spyApiEndpointPost.mockResolvedValue({ data: mockDocument });

                const result = await api.findOne(mockAction);

                expect(result).toMatchObject(mockDocument);
                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/findOne', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

            test('Should find many document on data api', async () => {

                const mockDocuments = new Array(9).map((_, index) => ({
                    _id: `507f191e810c19729de860e${index}`,
                    name: Date.now() * index,
                    status: 'active',
                }));


                const mockAction: ApiActions.IFindOne = {
                    collection: 'my-collection-2',
                    filter: {
                        status: 'active',
                    },
                };

                spyApiEndpointPost.mockResolvedValue({ data: mockDocuments });

                const result = await api.find(mockAction);

                expect(result).toBeInstanceOf(Array);
                expect(result).toMatchObject(mockDocuments);

                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/find', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

        });

        describe('(U) Update', () => {

            test('Should update one document', async () => {

                const mockAction: ApiActions.IUpdateOne = {
                    collection: 'my-collection',
                    filter: {
                        status: 'deleted',
                    },
                    update: {
                        $set: {
                            name: Date.now().toString(),
                            status: 'active',
                        }
                    },
                    upsert: false,
                };

                spyApiEndpointPost.mockResolvedValue({ data: { matchedCount: 1, modifiedCount: 1 } });

                const result = await api.updateOne(mockAction);

                expect(result.matchedCount).toEqual(1);
                expect(result.modifiedCount).toEqual(1);
                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/updateOne', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

            test('Should update many documents', async () => {

                const mockAction: ApiActions.IUpdateMany = {
                    collection: 'my-collection',
                    filter: {
                        status: 'deleted',
                    },
                    update: {
                        $set: {
                            name: Date.now().toString(),
                            status: 'pending',
                        }
                    },
                };

                spyApiEndpointPost.mockResolvedValue({ data: { matchedCount: 4, modifiedCount: 3 } });

                const result = await api.updateMany(mockAction);

                expect(result.matchedCount).toEqual(4);
                expect(result.modifiedCount).toEqual(3);
                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/updateMany', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

        });

        describe('(D) Delete', () => {

            test('Should delete one document', async () => {

                const mockAction: ApiActions.IDelete = {
                    collection: 'my-collection',
                    filter: {
                        'name': {
                            $eq: 'jony'
                        },
                    }
                };

                spyApiEndpointPost.mockResolvedValue({ data: { deletedCount: 1 } });

                const result = await api.deleteOne(mockAction);

                expect(result.deletedCount).toEqual(1);
                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/deleteOne', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

            test('Should delete many documents', async () => {

                const mockAction: ApiActions.IDelete = {
                    collection: 'my-collection',
                    filter: {
                        'age': {
                            $lt: 18
                        },
                    }
                };

                spyApiEndpointPost.mockResolvedValue({ data: { deletedCount: 25 } });

                const result = await api.deleteMany(mockAction);

                expect(result.deletedCount).toEqual(25);
                expect(spyApiEndpointPost).toHaveBeenCalledWith('/action/deleteMany', {
                    ...mockAction,
                    database: api['database'],
                    dataSource: api['datasource'],
                });

            });

        });

        describe('Error', () => {

            test('Should format ApiError when axios throws AxiosError', async () => {

                const axiosError = new AxiosError<string>(AxiosError.ETIMEDOUT);
                spyApiEndpointPost.mockRejectedValue(axiosError);

                await expect(api['runAction']('x', {})).rejects.toMatchObject(ApiError.fromAxiosError(axiosError))

            });

            test('Should format ApiError for any erros', async () => {

                const error = new Error('any error')
                spyApiEndpointPost.mockRejectedValue(error);

                await expect(api['runAction']('x', {})).rejects.toMatchObject(new ApiError(error.message, 'Unknown', 'unknown'));

            });

        });
    });

});