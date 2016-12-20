import { Tyr } from 'tyranid';
import * as fs from 'fs';
import { Readable } from 'stream';
import { generate } from './module';


/**
 * 
 * generate Tyranid collection interfaces
 * and pipe to nodejs writeable stream
 * 
 */
export function generateStream(
  collections: Tyr.CollectionInstance[]
) {
  const stream = new Readable();
  const td = generate(collections);
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
  filename: string
): string {
  const td = generate(collections);
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
  cb?: Function
): Promise<string> {
  return new Promise((res, rej) => {
    try {
      const td = generate(collections);
      fs.writeFile(filename, td, (err) => {
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