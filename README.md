# Generate type definition files from tyranid schemas

[![npm version](https://badge.fury.io/js/tyranid-tdgen.svg)](https://badge.fury.io/js/tyranid-tdgen)
[![Build Status](https://travis-ci.org/tyranid-org/tyranid-tdgen.svg?branch=master)](https://travis-ci.org/tyranid-org/tyranid-tdgen)
[![codecov](https://codecov.io/gh/tyranid-org/tyranid-tdgen/branch/master/graph/badge.svg)](https://codecov.io/gh/tyranid-org/tyranid-tdgen)

Generate typescript `.d.ts` files from your tyranid schema definitions. The generated type definition files extend tyranids own type definitions through [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)


### Example Usage - Command Line

Pass your model directory to `tyranid-tdgen`

```bash
npm install -g tyranid-tdgen
tyranid-tdgen ./models/ > generated.dts
```

For help...

```bash
tyranid-tdgen --help
```

### Example Usage - Module

Say we have a user tyranid document, `User.ts`...

```javascript
import Tyr from 'tyranid';

export default new Tyr.Collection({
  id: 'u00',
  name: 'user',
  dbName: 'users',
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' },
    email: { is: 'email' },
    teamId: { link: 'team' },
    skills: {
      is: 'array',
      of: {
        is: 'object',
        fields: {
          years: { is: 'integer' },
          name: { is: 'string' }
        }
      }
    }
  }
})
```

In a separate typescript/javascript file, after initializing tyranid, we can generate a type definition file like so...

```javascript
import Tyr from 'tyranid';
import * as mongodb from 'mongodb';
import { generateStream } from 'tyranid-tdgen';

async function start() {
  const db = await mongodb
    .MongoClient
    .connect('mongodb://127.0.0.1:27017/tyranid_tdgen');

  Tyr.config({
    db: db,
    validate: [
      { dir: __dirname + `/models/`,
        fileMatch: '.*.js' }
    ]
  });

  generateStream(Tyr.collections)
    .pipe(fs.createWriteStream("./my-tyranid-stuff.d.ts"));
}
```


Then, in `./my-tyranid-stuff.d.ts`, the following will have been generated...


```typescript
import { ObjectID } from 'mongodb';

declare module 'tyranid' {

  namespace Tyr {

    /**
     * Add lookup properties to Tyr.byName with extended interfaces
     */
    interface TyranidCollectionsByName {
      // other defs...
      user: UserCollectionInstance;
    }


    /**
     * Type definition for "user" collection
     */
    interface UserCollectionInstance extends CollectionInstance {
      new (...args: any[]): UserDocument;
      fromClient(...args: any[]): UserDocument;
      findAndModify(...args: any[]): Promise<UserDocument>;
      findOne(...args: any[]): Promise<UserDocument>;
      findAll(...args: any[]): Promise<UserDocument[]>;
    }


    /**
     * Document returned by collection "user" <UserCollectionInstance>
     */
    interface UserDocument extends Document {
      _id: ObjectID;
      name: string;
      email: string;
      teamId: ObjectID,
      skills: {
        years: number
        name: string
      }[];
    }

  }

}
```