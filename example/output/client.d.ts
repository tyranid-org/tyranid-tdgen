/**
 *
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 *
 * Generated by `tyranid-tdgen@0.2.0`: https://github.com/tyranid-org/tyranid-tdgen
 * date: Sat Jul 15 2017 17:45:12 GMT-0400 (EDT)
 */
  

declare module 'tyranid-client' {
  import { Tyr as Isomorphic } from 'tyranid-isomorphic';

  export namespace Tyr {

    export const byName: CollectionsByName & { [key: string]: CollectionInstance | void };
    export const byId: CollectionsById & { [key: string]: CollectionInstance | void };
    export type CollectionName = Isomorphic.CollectionName;
    export type CollectionId = Isomorphic.CollectionId;

    export interface CollectionInstance<T extends Document = Document> {
      findAll(args: any): Promise<T[]>;
      findOne(args: any): Promise<T>;
      idToUid(id: string): string;
    }

    export interface Document {
      $model: CollectionInstance<this>;
      $uid: string;
      $id: string;
    }

    
    export interface TyrLog extends Tyr.Document, Isomorphic.BaseTyrLog<string, Tyr.Document> {}
    export interface TyrLogEvent extends Tyr.Document, Isomorphic.BaseTyrLogEvent<string, Tyr.Document> {}
    export interface TyrLogLevel extends Tyr.Document, Isomorphic.BaseTyrLogLevel<string, Tyr.Document> {}
    export interface TyrSchema extends Tyr.Document, Isomorphic.BaseTyrSchema<string, Tyr.Document> {}
    export interface TyrSchemaType extends Tyr.Document, Isomorphic.BaseTyrSchemaType<string, Tyr.Document> {}
    export interface TyrUserAgent extends Tyr.Document, Isomorphic.BaseTyrUserAgent<string, Tyr.Document> {}
    export interface Unit extends Tyr.Document, Isomorphic.BaseUnit<string, Tyr.Document> {}
    export interface UnitFactor extends Tyr.Document, Isomorphic.BaseUnitFactor<string, Tyr.Document> {}
    export interface UnitSystem extends Tyr.Document, Isomorphic.BaseUnitSystem<string, Tyr.Document> {}
    export interface UnitType extends Tyr.Document, Isomorphic.BaseUnitType<string, Tyr.Document> {}
    export interface User extends Tyr.Document, Isomorphic.BaseUser<string, Tyr.Document> {}

    export interface TyrLogCollection extends Tyr.CollectionInstance<TyrLog> {}
    export interface TyrLogEventCollection extends Tyr.CollectionInstance<TyrLogEvent>, Isomorphic.TyrLogEventCollectionEnumStatic {}
    export interface TyrLogLevelCollection extends Tyr.CollectionInstance<TyrLogLevel>, Isomorphic.TyrLogLevelCollectionEnumStatic {}
    export interface TyrSchemaCollection extends Tyr.CollectionInstance<TyrSchema> {}
    export interface TyrSchemaTypeCollection extends Tyr.CollectionInstance<TyrSchemaType>, Isomorphic.TyrSchemaTypeCollectionEnumStatic {}
    export interface TyrUserAgentCollection extends Tyr.CollectionInstance<TyrUserAgent> {}
    export interface UnitCollection extends Tyr.CollectionInstance<Unit>, Isomorphic.UnitCollectionEnumStatic {}
    export interface UnitFactorCollection extends Tyr.CollectionInstance<UnitFactor>, Isomorphic.UnitFactorCollectionEnumStatic {}
    export interface UnitSystemCollection extends Tyr.CollectionInstance<UnitSystem>, Isomorphic.UnitSystemCollectionEnumStatic {}
    export interface UnitTypeCollection extends Tyr.CollectionInstance<UnitType>, Isomorphic.UnitTypeCollectionEnumStatic {}
    export interface UserCollection extends Tyr.CollectionInstance<User> {}

    export type TyrLogEventId = Isomorphic.TyrLogEventId;
    export type TyrLogLevelId = Isomorphic.TyrLogLevelId;
    export type TyrSchemaTypeId = Isomorphic.TyrSchemaTypeId;
    export type UnitId = Isomorphic.UnitId;
    export type UnitFactorId = Isomorphic.UnitFactorId;
    export type UnitSystemId = Isomorphic.UnitSystemId;
    export type UnitTypeId = Isomorphic.UnitTypeId;
  
    /**
     * Add lookup properties to Tyr.byName with extended interfaces
     */
    export interface CollectionsByName {
      tyrLog: TyrLogCollection;
      tyrLogEvent: TyrLogEventCollection;
      tyrLogLevel: TyrLogLevelCollection;
      tyrSchema: TyrSchemaCollection;
      tyrSchemaType: TyrSchemaTypeCollection;
      tyrUserAgent: TyrUserAgentCollection;
      unit: UnitCollection;
      unitFactor: UnitFactorCollection;
      unitSystem: UnitSystemCollection;
      unitType: UnitTypeCollection;
      user: UserCollection;
    }

    /**
     * Add lookup properties to Tyr.byId with extended interfaces
     */
    export interface CollectionsById {
      _l0: TyrLogCollection;
      _l2: TyrLogEventCollection;
      _l1: TyrLogLevelCollection;
      _t1: TyrSchemaCollection;
      _t0: TyrSchemaTypeCollection;
      _u4: TyrUserAgentCollection;
      _u2: UnitCollection;
      _u3: UnitFactorCollection;
      _u0: UnitSystemCollection;
      _u1: UnitTypeCollection;
      u00: UserCollection;
    }
  
  }

}