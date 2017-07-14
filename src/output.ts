import { Tyr } from 'tyranid';
import * as fs from 'fs';
import { Readable } from 'stream';
import { InterfaceGenerationOptions } from './util';
import { generateServerDefinitionFile } from './server';
import { generateClientDefinitionFile } from './client';

export interface DefinitionGenerationOptions extends InterfaceGenerationOptions {
  /**
   *
   * generate client side definitions instead of server
   *
   */
  client?: boolean;
}

function resolveGenerationMethod(opts: DefinitionGenerationOptions = {}) {
  return opts.client
    ? generateClientDefinitionFile
    : generateServerDefinitionFile;
}

/**
 *
 * generate Tyranid collection interfaces
 * and pipe to nodejs writeable stream
 *
 */
export function generateStream(
  collections: Tyr.CollectionInstance[],
  opts?: DefinitionGenerationOptions
) {
  const stream = new Readable();
  const td = resolveGenerationMethod(opts)(collections, opts);
  stream.push(td);
  stream.push(null);
  return stream;
}

/**
 *
 * generate Tyranid collection interfaces
 * and write results to file synchronously
 *
 */
export function generateFileSync(
  collections: Tyr.CollectionInstance[],
  filename: string,
  opts?: DefinitionGenerationOptions
): string {
  const td = resolveGenerationMethod(opts)(collections, opts);
  fs.writeFileSync(filename, td);
  return td;
}

/**
 *
 * generate Tyranid collection interfaces
 * and write results to file
 *
 */
export function generateFile(
  collections: Tyr.CollectionInstance[],
  filename: string,
  rawOpts?: DefinitionGenerationOptions | Function,
  cb?: Function
): Promise<string> {
  let opts: DefinitionGenerationOptions;
  if (rawOpts instanceof Function) {
    cb = rawOpts;
    opts = {};
  } else {
    opts = rawOpts || {};
  }

  return new Promise((res, rej) => {
    try {
      const td = resolveGenerationMethod(opts)(collections, opts);
      fs.writeFile(filename, td, err => {
        if (err) rej(err);
        if (cb) cb(err, td);
        res(td);
      });
    } catch (err) {
      if (cb) cb(err);
      rej(err);
    }
  });
}
