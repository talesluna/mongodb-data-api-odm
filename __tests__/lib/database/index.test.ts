import { Api } from '../../../src/lib/api';
import { Field } from '../../../src/lib/collections/decorators/field';
import { Database } from '../../../src/lib/database';
import { Collection } from '../../../src/lib/collections/decorators/collection';
import { Collection as CollectionInstance } from '../../../src/lib/collections'

describe('Database', () => {

    const mockConfig: Database.IConfig = {
        credentials: {
            key: 'my-key',
        },
        database: 'my-db',
        datasource: 'my-ds',
        endpoint: 'https://localhost',
    };

    const database = new Database(mockConfig);

    describe('Instance', () => {

        test('Should be a instance of Database class', () => {
            expect(database).toBeInstanceOf(Database);
            expect(database['api']).toBeInstanceOf(Api);
        });

        test('Should have a method to get a collection constructor', () => {
            expect(database.getCollection).toBeDefined();
        });

    });

    describe('GetCollection', () => {

        @Collection('MyCollection')
        class MyCollection {

            @Field({ name: 'other-name' })
            public name!: string;
        }


        test('Should retrive a collection instance', () => {
            
            const collection = database.getCollection(MyCollection);

            expect(collection).toBeInstanceOf(CollectionInstance);
            expect(collection['target']).toEqual(MyCollection);

        });

    });

});