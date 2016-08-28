import { Tyr } from 'tyranid';
import test from 'ava';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';

import TestCol from './models/Test';
import LinkedCol from './models/Linked';
import User from './models/User';


import {
  generate,
  generateFileSync,
  generateStream
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


test('Should successfully write file', () => {
  generateFileSync(Tyr.collections, "./test.d.ts");
});


test('Should successfully write stream', t => {
  generateStream(Tyr.collections)
    .pipe(fs.createWriteStream("./test-stream.d.ts"))
    .on('end', () => {
      t.pass();
    });
});