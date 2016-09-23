import * as program from 'commander';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';
import { generateStream } from './index';

const ROOT = __dirname;
const DEFAULT_HOST = 'mongodb://127.0.0.1:27017';
const DEFAULT_DBNAME = '__tyranid__tdgen__';
const config = require(path.join(ROOT, '../../package.json'));

// TODO: is there a way to require a module relative to a different directory?
const Tyr = require(path.join(process.cwd(), './node_modules/tyranid/dist/tyranid.js')).Tyr;

let dir: string | undefined;

program
  .version(config.version)
  .usage('[options] <dir>')
  .option('-o, --out-file [outFileName]', 'File to output declaration into, defaults to stdout')
  .option('-f, --file-match', 'file match string, defaults to "*.js"')
  .option('-d, --database-name [name]', `mongodb database name to use, defaults to ${DEFAULT_DBNAME}`)
  .option('-h, --mongodb-host', `mongodb host, defaults to ${DEFAULT_HOST}`)
  .action((dirGlob) => {
    dir = dirGlob;
  })
  .parse(process.argv);

/**
 * Run command
 */
(async () => {
  if (!dir) return program.help();

  const db = await mongodb
    .MongoClient
    .connect(`${DEFAULT_HOST}/${DEFAULT_DBNAME}`);

  Tyr.config({
    db: db,
    validate: [
      { dir: path.join(process.cwd(), dir), fileMatch: '.*\.js' }
    ]
  });

  const stream = generateStream(Tyr.collections);

  if (program['outFile']) {
    stream.pipe(fs.createWriteStream(program['outFile']))
      .on('finish', () => {
        process.exit();
      });
  } else {
    stream.pipe(process.stdout);
  }

  stream.on('end', () => {
    process.exit();
  });
})()
.catch(err => {
  console.log(err.stack);
  process.exit(1);
});