import { Tyr } from 'tyranid';
import test from 'ava';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';

import { generateFileSync, generateStream, generateFile } from '../src';
import { wordWrap } from '../src/util';

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





test('Word wrap should wrap long lines', (t) => {
  const str = `
Duis enim elit reprehenderit laborum quis sint irure cupidatat. Consequat quis consequat anim velit ullamco excepteur. Incididunt sunt excepteur eiusmod nisi cillum elit voluptate ullamco. Ad ex velit culpa voluptate non esse. Sunt sint officia dolore mollit consequat est magna cupidatat consequat irure esse consectetur. Cupidatat nulla veniam consectetur laboris excepteur laboris nostrud labore.
  `;
  const length = 80;
  const wrapped = wordWrap(str, length);
  const words = str.trim().split(/\s+/g);
  words.sort();
  const wrappedWords = wrapped.join(' ').trim().split(/\s+/g);
  wrappedWords.sort();

  t.deepEqual(words, wrappedWords);
  for (const line of wrapped) {
    t.true(line.length <= length);
  }
});


test('Word wrap should handle words longer than the line width', (t) => {
  const str = `
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  `;
  const length = 40;
  const wrapped = wordWrap(str, length);
  const joined = wrapped.join(' ');
  const wrappedWords = joined.replace(/- /g, '').split(' ');
  const split = str.trim().split(/\s+/g);
  split.sort();
  t.deepEqual(wrappedWords, split);
});