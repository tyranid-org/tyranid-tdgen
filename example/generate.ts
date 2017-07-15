import { Tyr } from 'tyranid';
import * as fs from 'fs';
import * as mongodb from 'mongodb';
import * as path from 'path';
import { generateFile } from '../';

generate().catch(console.error);

async function generate() {
  const db = await mongodb.MongoClient.connect(
    'mongodb://127.0.0.1:27017/tyranid_tdgen'
  );

  Tyr.config({
    db: db,
    validate: [
      {
        dir: path.resolve(__dirname, `./models/`),
        fileMatch: '.*.ts'
      }
    ]
  });

  await Promise.all([
    generateFile(
      Tyr.collections,
      path.resolve(__dirname, './output/isomorphic.d.ts')
    ),
    generateFile(
      Tyr.collections,
      path.resolve(__dirname, './output/server.d.ts'),
      { type: 'server' }
    ),
    generateFile(
      Tyr.collections,
      path.resolve(__dirname, './output/client.d.ts'),
      { type: 'client' }
    )
  ]);

  process.exit(0);
}
