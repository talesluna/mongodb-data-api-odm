# MongoDB Data API ODM
An ODM implementation for Atlas MongoDB Data API

![](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/npm/l/rastrojs?color=blue&label=License)

![](https://img.shields.io/npm/dm/mongodb-data-api-odm?label=Downloads&logo=npm)
![](https://img.shields.io/github/issues/talesluna/mongodb-data-api-odm?color=red&label=Issues&logo=github&logoColor=white)
![](https://img.shields.io/github/stars/talesluna/mongodb-data-api-odm?color=yellow&label=Stars&logo=github)

## Reason
This ODM library was born to provide a bold implementation of communication with the Atlas Data API. More than an HTTP client, this library powers your projects to manage typed classes that represent MongoDB Collections with the most common data interaction methods and arguments.

## Inspiration
This ODM is inspired by Mongoose and TypeORM

## Implementation

### Database Concept
To allow you project instatiate many database (multi). You can easilly create many instances for different Data APIs endpoint
```ts
import { Database } from 'mongodb-data-api-odm';

const db = new Database({
    credentials: {
        key: 'api-key',
    },
    database: 'db-name',
    datasource: 'ds-name',
    endpoint: 'https://...',
});
```

### Typed Collection
Use classes and decorators to create Entity, Collection, Model or whatever name you want in your data layer
```ts
import { Collection, Field } from 'mongodb-data-api-odm';
Create 
@Collection('X')
class MyCollectionX {

    @Field({ required: true });
    public _id: string;

    @Field({ required: true });
    public name: string;

    @Field();
    public points: number[] = [];

    // Not field, but your instance, your rules
    public get hasPoints() {
        return !!this.points.length;
    }

}

```

### Typed Methods
```ts
class MyAnyService {    
    private xCollection = db.getCollection(MyCollectionX);

    public async getAll() {
        const xses = await xCollection.find();
    }

    public async getAll() {
        const x = await xCollection.create({ name: '<EOF>', points: [0] });
    }

}
```

## Collection Methods

- insert(data)
- insertMany(data[])
- create(data[]) - Same of insert
- find(filter?, projection?, { limit?, sort? })
- findOne(filter, projection)
- findById(_id, projection)
- updateOne(filter, partial)
- updateMany(filter, partial)
- updateById(_id, partial);
- findOneAndUpdate(filter, partial)
- findByIdAndUpdate(filter, partial)
- deleteOne(filter)
- deleteMany(filter)
- deleteById(_id)
- findOneAndDelete(filter)
- findByIdAndDelete(_id)
- ~~aggregate~~ - Comming Soon

### Examples
```ts

    // Find by regex
    const w = await xCollection.findOne({
        name: {
            $regex: '/^Anne/g'
        }
    });

    // Conditions
    const x = await xCollection.findOne({
        $and: [
            { name: '<EOF>' },
            { points: { $in: [0] } }
        ]
    });

    // Find fast by ID
    const y = await xCollection.findByIdAndUpdate(
        '64dae34078db150688ad90db',
        { points: [1] },
    );

    // Delete using filters
    const z = await xCollection.deleteOne({
        points: {
            $in: [1]
        }
    });

```

## License
[MIT](./LICENSE)