import { Api } from '../../../src/lib/api';
import { Field } from '../../../src/lib/collections/decorators/field';
import { Collection } from '../../../src/lib/collections';
import { CollectionDocument } from '../../../src/lib/collections/document';
import { Collection as CollectionDecorator } from '../../../src/lib/collections/decorators/collection';

describe('Collection', () => {

    @CollectionDecorator('MockCollection')
    class MockCollection {

        @Field({ name: '_id' })
        public id!: string;

        @Field({ name: 'customer' })
        public name!: string;

        @Field()
        public age!: number;

    }

    const mockApi = new Api({
        credentials: {
            key: 'my-key',
        },
        database: 'my-db',
        datasource: 'my-ds',
        endpoint: 'https://localhost',
    });

    const mockCollection = new Collection(MockCollection, mockApi);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Instance', () => {

        test('Should be a instance of Collection', () => {

            expect(mockCollection).toBeInstanceOf(Collection);
            expect(mockCollection['api']).toBeInstanceOf(Api);
            expect(mockCollection['target']).toEqual(MockCollection);

            expect(mockCollection.create).toBeDefined();
            expect(mockCollection.insert).toBeDefined();
            expect(mockCollection.insertMany).toBeDefined();

            expect(mockCollection.find).toBeDefined();
            expect(mockCollection.findById).toBeDefined();
            expect(mockCollection.findOneAndUpdate).toBeDefined();
            expect(mockCollection.findByIdAndDelete).toBeDefined();

            expect(mockCollection.updateOne).toBeDefined();
            expect(mockCollection.updateById).toBeDefined();
            expect(mockCollection.updateMany).toBeDefined();

            expect(mockCollection.deleteOne).toBeDefined();
            expect(mockCollection.deleteById).toBeDefined();
            expect(mockCollection.deleteMany).toBeDefined();

        });

    });

    describe('Actions', () => {

        const spyApiFind = jest.spyOn(mockApi, 'find');
        const spyApiInsert = jest.spyOn(mockApi, 'insert')
        const spyApiFindOne = jest.spyOn(mockApi, 'findOne');
        const spyApiUpdateOne = jest.spyOn(mockApi, 'updateOne');
        const spyApiInsertMany = jest.spyOn(mockApi, 'insertMany');
        const spyApiUpdateMany = jest.spyOn(mockApi, 'updateMany');
        const spyApiDeleteOne = jest.spyOn(mockApi, 'deleteOne');
        const spyApiDeleteMany = jest.spyOn(mockApi, 'deleteMany');

        describe('(C) Insert', () => {

            test('Should insert one document', async () => {

                const mockInsertedId = '507f191e810c19729de860ea';

                spyApiInsert.mockResolvedValue({ insertedId: mockInsertedId });


                const data: Partial<MockCollection> = {
                    name: 'jony',
                };

                const result = await mockCollection.create(data);

                expect(result).toBeInstanceOf(MockCollection);
                expect(result.name).toEqual(data.name);
                expect(result.toObject().name).toEqual(data.name);
                expect(spyApiInsert).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    document: CollectionDocument.parseFields(MockCollection, data, true),
                }));

            });

            test('Should insert many documents using method insertMany', async () => {

                const data: Partial<MockCollection>[] = [
                    {
                        name: 'jony',
                    },
                    {
                        name: 'meggie',
                    }
                ];

                const mockInsertedIds = data.map((_, index) => `507f191e810c19729de860e${index}`);
                spyApiInsertMany.mockResolvedValue({ insertedIds: mockInsertedIds });

                const result = await mockCollection.insertMany(data);

                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(data.length);

                result.forEach((doc, index) => {
                    expect(doc).toBeInstanceOf(MockCollection);
                    expect(doc).toMatchObject({
                        ...data[index],
                        id: mockInsertedIds[index],
                    })
                });

                expect(spyApiInsertMany).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    documents: data.map(doc => CollectionDocument.parseFields(MockCollection, doc, true)),
                }));

            });

        });

        describe('(R) Find', () => {

            test('Should find one document by ID', async () => {

                const mockId = '507f191e810c19729de860ea';

                const mockDocument = {
                    _id: mockId,
                    age: 52,
                    customer: 'joel',
                };

                spyApiFindOne.mockResolvedValue({ document: mockDocument });

                const result = await mockCollection.findById(mockId);

                expect(result).toBeInstanceOf(MockCollection);
                expect(result).toMatchObject(CollectionDocument.parseFields(MockCollection, mockDocument));
                expect(spyApiFindOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    
                    filter: {
                        _id: {
                            $oid: mockId,
                        }
                    },
                    projection: undefined,
                }));

            });


            test('Should find many document', async () => {


                const mockDocuments = [
                    {
                        _id: '507f191e810c19729de860e1',
                        age: 52,
                        customer: 'joel',
                    },
                    {
                        _id: '507f191e810c19729de860e2',
                        age: 21,
                        customer: 'jony',
                    },
                    {
                        _id: '507f191e810c19729de860e3',
                        age: 25,
                        customer: 'meggie',
                    }
                ];

                spyApiFind.mockResolvedValue({ documents: mockDocuments });

                const mockFielter = {
                    $gte: 18
                };

                const result = await mockCollection.find(mockFielter);

                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(mockDocuments.length);
                
                result.forEach((document, index) => {
                    expect(document).toBeInstanceOf(MockCollection);
                    expect(document).toMatchObject(CollectionDocument.parseFields(MockCollection, mockDocuments[index]));
                });

                expect(spyApiFind).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    filter: mockFielter,
                    projection: undefined,
                }));

            });

        });

        describe('(U) Update', () => {


            test('Should update one document by ID', async () => {

                const mockId = '507f191e810c19729de860ea';
                const mockChanges: Partial<MockCollection> = {
                    name: 'parker',
                }

                spyApiUpdateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });
                const result = await mockCollection.updateById(mockId, mockChanges);

                expect(result.matchedCount).toEqual(1);
                expect(spyApiUpdateOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    filter: {
                        _id: {
                            $oid: mockId,
                        }
                    },
                    update: {
                        $set: mockChanges
                    },
                }));

            });

            test('Should update many documents', async () => {

                const mockFilter = {
                    age: {
                        $gte: 18
                    }
                };

                const mockChanges: Partial<MockCollection> = {
                    age: 20,
                }

                spyApiUpdateMany.mockResolvedValue({ matchedCount: 5, modifiedCount: 5 });
                const result = await mockCollection.updateMany(mockFilter, mockChanges);

                expect(result.matchedCount).toEqual(5);
                expect(result.modifiedCount).toEqual(5);
                expect(spyApiUpdateMany).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    filter: mockFilter,
                    update: {
                        $set: mockChanges
                    },
                }));

            });

            describe('Find And Update', () => {

                const mockDocument = {
                    _id: '507f191e810c19729de860ea',
                    age: 53,
                    customer: 'joel',
                };

                test('Should find one and update', async () => {
    
                    const mockFilter = {
                        customer: mockDocument.customer,
                    };
    
                    const mockChanges: Partial<MockCollection> = {
                        age: mockDocument.age + 1,
                    }
    
                    spyApiFindOne.mockResolvedValue({ document: mockDocument });
                    spyApiUpdateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });

                    const result = await mockCollection.findOneAndUpdate(mockFilter, mockChanges);
    
                    expect(result).toBeInstanceOf(MockCollection);
                    expect(result).toMatchObject(CollectionDocument.parseFields(MockCollection, mockDocument));
                    expect(spyApiFindOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                        filter: mockFilter,
                        projection: {
                            _id: true,
                        }
                    }));
                    expect(spyApiUpdateOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                        filter: {
                            _id: {
                                $oid: mockDocument._id,
                            }
                        },
                        update: {
                            $set: mockChanges
                        },
                    }));
    
                });

            });

        });

        describe('(D) Delete', () => {

            test('Should delete one document by ID', async () => {

                const mockId = '507f191e810c19729de860ea';

                spyApiDeleteOne.mockResolvedValue({ deletedCount: 1 });
                const result = await mockCollection.deleteById(mockId);

                expect(result.deletedCount).toEqual(1);
                expect(spyApiDeleteOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    filter: {
                        _id: {
                            $oid: mockId,
                        }
                    },
                }));

            });

            test('Should delete many documents', async () => {

                const mockFilter = {
                    age: {
                        $lte: 18
                    }
                };

                spyApiDeleteMany.mockResolvedValue({ deletedCount: 0 });
                const result = await mockCollection.deleteMany(mockFilter);

                expect(result.deletedCount).toEqual(0);
                expect(spyApiDeleteMany).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                    filter: mockFilter,
                }));

            });

            describe('Find And Delete', () => {

                const mockDocument = {
                    _id: '507f191e810c19729de860ea',
                    age: 53,
                    customer: 'joel',
                };

                test('Should find by ID and delete', async () => {

                    const mockId = '507f191e810c19729de860ea';
    
                    spyApiFindOne.mockResolvedValue({ document: mockDocument });
                    spyApiDeleteOne.mockResolvedValue({ deletedCount: 1 });

                    const result = await mockCollection.findByIdAndDelete(mockId);
    
                    expect(result).toBeInstanceOf(MockCollection);
                    expect(spyApiFindOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                        filter: {
                            _id: {
                                $oid: mockId,
                            }
                        },
                    }));
                    expect(spyApiDeleteOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                        filter: {
                            _id: {
                                $oid: mockId,
                            }
                        },
                    }));
    
                });

                test('Should find one and delete', async () => {

                    const mockFilter = {
                        customer: 'parker',
                    }
    
                    spyApiFindOne.mockResolvedValue({ document: mockDocument });
                    spyApiDeleteOne.mockResolvedValue({ deletedCount: 1 });

                    const result = await mockCollection.findOneAndDelete(mockFilter);
    
                    expect(result).toBeInstanceOf(MockCollection);
                    expect(spyApiFindOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                        filter: mockFilter,
                        projection: {
                            _id: true,
                        }
                    }));
                    expect(spyApiDeleteOne).toHaveBeenCalledWith(mockCollection['getActionPayload']({
                        filter: {
                            _id: {
                                $oid: mockDocument._id,
                            }
                        },
                    }));
    
                });
    
            });

        });

    });

});