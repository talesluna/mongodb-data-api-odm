/// <reference path="./typings/lib/index.d.ts" />
declare module 'mongodb-data-api-odm' {
    const Database: Database.IConstructor;
    const Collection: (name: string) => <L>(target: Collection.EntityConstructor<L>) => void;
    const Field: (config?: Collection.EntityField) => (target: any, key: string) => void;
}