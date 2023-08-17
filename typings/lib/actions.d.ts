type BaseTypes = string | boolean | number | BigInt;
type BSONTypes = 'double' | 'string' | 'object' | 'array' | 'binData' | 'undefined' | 'objectId' | 'bool' | 'date' | 'null' | 'regex' | 'dbPointer' | 'javascript' | 'symbol' | 'javascriptWithScope' | 'int' | 'timestamp' | 'long' | 'decimal' | 'minKey' | 'maxKey';

type ODate = { $date: string }
type ObjectId = { $oid: string }
type Eq = { $eq: BaseTypes };
type Ne = { $ne: BaseTypes };
type Gt = { $gt: BaseTypes };
type Gte = { $gte: BaseTypes };
type Lt = { $lt: BaseTypes };
type Lte = { $lte: BaseTypes };
type In = { $in: BaseTypes[] };

type Regex =  { $regex: string };
type Exists =  { $exists: boolean };
type Type =  { $type: BSONTypes };

type Operators = Eq | Ne | Lt | Lte | Gt | Gte | In | Regex | Exists | ODate | ObjectId | Type;


declare namespace ApiActions {

    type NotExpression = { $not: Operators };
    type OperationFilters<T> = Partial<Record<keyof T, Operators | NotExpression | BaseTypes>> & {
        $or?: OperationFilters<T>[];
        $and?: OperationFilters<T>[];
        $nor?: OperationFilters<T>[];
        [k: string]: Operators | NotExpression | BaseTypes
    };

    type Sort<T = never> = Partial<Record<keyof T, -1 | 1>>;
    type Filter<T = never> = OperationFilters<T>;
    type Projection<T = never> = Partial<Record<keyof T, 0 | 1 | boolean>>;
    type Pipeline = any[];

    interface IBaseAction {
        collection: string;
    }
    
    interface IFind extends IBaseAction {
        sort?: Sort;
        limit?: number;
        filter?: Filter;
        projection?: Projection;
    }
    
    interface IFindById extends IBaseAction {
        id: string;
        projection?: Projection;
    }
    
    interface IFindOne extends IBaseAction{
        filter: Filter;
        projection?: Projection;
    }
    
    interface IInsertOne extends IBaseAction {
        document: Record<string, any>;
    }

    interface IInsertMany extends IBaseAction {
        documents: Record<string, any>[];
    }

    interface IUpdateOne extends IBaseAction {
        filter: Filter;
        upsert?: boolean;
        update: {
            $set: Record<string, any>;
        }
    }

    interface IUpdateMany extends IBaseAction {
        filter: Filter;
        update: {
            $set: Record<string, any>;
        }
    }
    
    interface IDelete extends IBaseAction {
        filter: Filter;
    }

    interface IAggregate extends IBaseAction {
        pipeline: Pipeline;
    }

}

declare namespace ApiActionResponses {

    type Doc<T> = T & {
        _id: string;
    };

    interface IFind<T> {
        documents: Doc<T>[];
    }
    
    interface IFindOne<T> {
        document: Doc<T> | null;
    }

    interface IInsertOne {
        insertedId: string;
    }

    interface IInsertMany {
        insertedIds: string[];
    }

    interface IDelete {
        deletedCount: number;
    }
    
    interface IUpdate {
        matchedCount: number;
        modifiedCount: number;
    }

    interface IAggregate<T> {
        documents: T[];
    }

}