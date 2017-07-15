import * as program from 'commander';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';
import { generateStream } from './index';

const ROOT = __dirname;
const DEFAULT_HOST = 'mongodb://127.0.0.1:27017';
const DEFAULT_DBNAME = '__tyranid__tdgen__';
const config = require(path.join(ROOT, '../../package.json'));
const CWD = process.cwd();
const { Tyr } = require(path.join(
  CWD,
  './node_modules/tyranid/dist/tyranid.js'
));
let fileGlob: string | undefined;

program
  .version(config.version)
  .usage('[options] <glob>')
  .option(
    '-o, --out-file [outFileName]',
    'File to output declaration into, defaults to stdout'
  )
  .option(
    '-d, --database-name [name]',
    `mongodb database name to use, defaults to ${DEFAULT_DBNAME}`
  )
  .option('-h, --mongodb-host', `mongodb host, defaults to ${DEFAULT_HOST}`)
  .option('-t, --type [outputType]', 'type of definitions to output (client|server|isomorphic)')
  .action(glob => {
    fileGlob = glob;
  })
  .parse(process.argv);

/**
 * Run command
 */
(async () => {
  if (!fileGlob) return program.help();

  const db = await mongodb.MongoClient.connect(
    `${program['mongodbHost'] || DEFAULT_HOST}/${program['databaseName'] ||
      DEFAULT_DBNAME}`
  );

  const globToUse =
    path.resolve(fileGlob) === fileGlob ? fileGlob : path.join(CWD, fileGlob);

  Tyr.config({ db: db, validate: [{ glob: globToUse }] });

  const stream = generateStream(Tyr.collections, { type: program.type || 'isomorphic' });

  if (program['outFile']) {
    stream.pipe(fs.createWriteStream(program['outFile'])).on('finish', () => {
      process.exit();
    });
  } else {
    stream.pipe(process.stdout);
  }

  stream.on('end', () => {
    process.exit();
  });
})().catch(err => {
  console.log(err.stack);
  process.exit(1);
});
