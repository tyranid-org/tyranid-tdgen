import { Tyr } from 'tyranid';
import test from 'ava';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';

import { generateFileSync, generateStream, generateFile } from '../src';

const root = __dirname.replace(`${path.sep}test`, '');

test.before(async () => {
  const db = await mongodb.MongoClient.connect(
    'mongodb://127.0.0.1:27017/tyranid_tdgen'
  );

  Tyr.config({
    db: db,
    validate: [
      { dir: root + `${path.sep}test${path.sep}models`, fileMatch: '.*.js' }
    ]
  });
});

test('Should successfully write file', () => {
  generateFileSync(Tyr.collections, path.join(root, '../generated/test.d.ts'));
});

test('Should successfully write file async', t => {
  return generateFile(
    Tyr.collections,
    path.join(root, '../generated/test-async.d.ts'),
    () => {
      t.pass();
    }
  ).then(() => {}); // void promise for ava
});

test('Should successfully write stream', t => {
  generateStream(Tyr.collections)
    .pipe(
      fs.createWriteStream(path.join(root, '../generated/test-stream.d.ts'))
    )
    .on('end', () => {
      t.pass();
    });
});

test('Should generate client-side definitions', t => {
  generateStream(Tyr.collections, { client: true })
    .pipe(
      fs.createWriteStream(
        path.join(root, '../generated/test-stream-client.d.ts')
      )
    )
    .on('end', () => {
      t.pass();
    });
});
