import * as program from 'commander';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';
import { generateStream } from './index';

const ROOT = __dirname;
const config = require(path.join(ROOT, '../../package.json'));
const CWD = process.cwd();
const { Tyr } = require(path.join(
  CWD,
  './node_modules/tyranid/dist/src/tyranid.js'
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
    '-t, --type [outputType]',
    'type of definitions to output (client|server|isomorphic)'
  )
  .action(glob => {
    fileGlob = glob;
  })
  .parse(process.argv);

/**
 * Run command
 */
(async () => {
  if (!fileGlob) return program.help();

  const globToUse =
    path.resolve(fileGlob) === fileGlob ? fileGlob : path.join(CWD, fileGlob);

  Tyr.config({ validate: [{ glob: globToUse }] });

  const stream = generateStream(Tyr.collections, {
    type: program.type || 'isomorphic'
  });

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
