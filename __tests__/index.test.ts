import * as library from '../src';

import { Field } from '../src/lib/collections/decorators/field';
import { Database } from '../src/lib/database';
import { Collection } from '../src/lib/collections/decorators/collection';

describe('Library', () => {

    test('Should export parts', () => {
        expect(library.Field).toEqual(Field);
        expect(library.Database).toEqual(Database);
        expect(library.Collection).toEqual(Collection);
    });

});