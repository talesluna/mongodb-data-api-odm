import { Field } from '../../../src/lib/collections/decorators/field';
import { Collection } from '../../../src/lib/collections/decorators/collection';
import { CollectionDocument } from '../../../src/lib/collections/document';


describe('CollectionDocument', () => {

    @Collection('Dogs')
    class Dogs {

        @Field({ name: '_id', required: true })
        public id!: string;

        @Field({ required: true })
        public name!: string;

        @Field({ name: 'bread' })
        public type!: string;

        public get isActive() {
            return true;
        }

    }

    const mockDocument = {
        _id: '507f191e810c19729de860ea',
        name: 'mel',
        bread: 'yorkie'
    };

    test('Should create a instance of collection', () => {

        const document = CollectionDocument.create(Dogs, mockDocument);

        expect(document).toBeInstanceOf(Dogs);
        expect(document.toObject).toBeDefined();
        expect(document.toOriginal).toBeDefined();

        expect(document).toMatchObject(CollectionDocument.parseFields(Dogs, mockDocument));
        expect(document.toOriginal()).toMatchObject(mockDocument);

        expect(document.toObject()).toMatchObject({
            id: mockDocument._id,
            name: mockDocument.name,
            type: mockDocument.bread,
        });

        expect(document.toObject({ getters: true })).toMatchObject({
            id: mockDocument._id,
            name: mockDocument.name,
            type: mockDocument.bread,
            isActive: true,
        });

    });

    test('Should not parse any required field not exists on document', () => {
        try {
            CollectionDocument.parseFields(Dogs, {});
        } catch (error) {
            expect((error as Error).message).toEqual('Dogs.id is required');
        }
    });

    test('Should not parse fields because entity was not found', () => {

        const fields = CollectionDocument.parseFields(Object, {});
        expect(fields).toEqual({});

    });

});