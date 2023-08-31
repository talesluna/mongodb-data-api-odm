/// <reference path="./typings/lib/index.d.ts" />
declare module 'mongodb-data-api-odm' {
    const Database: Database.IConstructor;
    const Collection: (name: string | Collection.Config) => <L>(target: Collection.EntityConstructor<L>) => void;
    const Field: (config?: Partial<Collection.EntityField>) => (target: any, key: string) => void;
}