import { Tyr } from 'tyranid';
import test from 'ava';
import * as mongodb from 'mongodb';
import * as path from 'path';


import TestCol from './models/Test';
import LinkedCol from './models/Linked';
import User from './models/User';


import {
  generate
} from '../src';


const root = __dirname.replace(`${path.sep}test`, '');


test.before(async () => {
  const db = await mongodb
    .MongoClient
    .connect('mongodb://127.0.0.1:27017/tyranid_tdgen');

  Tyr.config({
    db: db,
    validate: [
      { dir: root + `${path.sep}test${path.sep}models`,
        fileMatch: '.*.js' }
    ]
  });
});


test(() => {
  console.log(generate(Tyr.collections));
});