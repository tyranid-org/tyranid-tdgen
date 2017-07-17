/**
 *
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 *
 * Generated by `tyranid-tdgen@0.2.8`: https://github.com/tyranid-org/tyranid-tdgen
 * date: Sun Jul 16 2017 20:37:22 GMT-0400 (EDT)
 */
  
import { ObjectID } from 'mongodb';
import { Tyr } from 'tyranid';
import { Tyr as Isomorphic } from 'tyranid-isomorphic';

declare module 'tyranid' {

  namespace Tyr {
    export type CollectionName = Isomorphic.CollectionName;
    export type CollectionId = Isomorphic.CollectionId;
    

    /**
     * documents inserted into the db and given _id
     */
    interface Inserted extends Tyr.Document {
      _id: ObjectID
    }

    interface TyrLog extends Inserted, Isomorphic.BaseTyrLog<ObjectID, Inserted> {}
    interface TyrLogEvent extends Inserted, Isomorphic.BaseTyrLogEvent<ObjectID, Inserted> {}
    interface TyrLogLevel extends Inserted, Isomorphic.BaseTyrLogLevel<ObjectID, Inserted> {}
    interface TyrSchema extends Inserted, Isomorphic.BaseTyrSchema<ObjectID, Inserted> {}
    interface TyrSchemaType extends Inserted, Isomorphic.BaseTyrSchemaType<ObjectID, Inserted> {}
    interface TyrUserAgent extends Inserted, Isomorphic.BaseTyrUserAgent<ObjectID, Inserted> {}
    interface Unit extends Inserted, Isomorphic.BaseUnit<ObjectID, Inserted> {}
    interface UnitFactor extends Inserted, Isomorphic.BaseUnitFactor<ObjectID, Inserted> {}
    interface UnitSystem extends Inserted, Isomorphic.BaseUnitSystem<ObjectID, Inserted> {}
    interface UnitType extends Inserted, Isomorphic.BaseUnitType<ObjectID, Inserted> {}
    interface User extends Inserted, Isomorphic.BaseUser<ObjectID, Inserted> {}

    interface TyrLogCollection extends Tyr.CollectionInstance<TyrLog> {}
    interface TyrLogEventCollection extends Tyr.CollectionInstance<TyrLogEvent>, Isomorphic.TyrLogEventCollectionEnumStatic {}
    interface TyrLogLevelCollection extends Tyr.CollectionInstance<TyrLogLevel>, Isomorphic.TyrLogLevelCollectionEnumStatic {}
    interface TyrSchemaCollection extends Tyr.CollectionInstance<TyrSchema> {}
    interface TyrSchemaTypeCollection extends Tyr.CollectionInstance<TyrSchemaType>, Isomorphic.TyrSchemaTypeCollectionEnumStatic {}
    interface TyrUserAgentCollection extends Tyr.CollectionInstance<TyrUserAgent> {}
    interface UnitCollection extends Tyr.CollectionInstance<Unit>, Isomorphic.UnitCollectionEnumStatic {}
    interface UnitFactorCollection extends Tyr.CollectionInstance<UnitFactor>, Isomorphic.UnitFactorCollectionEnumStatic {}
    interface UnitSystemCollection extends Tyr.CollectionInstance<UnitSystem>, Isomorphic.UnitSystemCollectionEnumStatic {}
    interface UnitTypeCollection extends Tyr.CollectionInstance<UnitType>, Isomorphic.UnitTypeCollectionEnumStatic {}
    interface UserCollection extends Tyr.CollectionInstance<User> {}

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
    interface CollectionsByName {
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
    interface CollectionsById {
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
