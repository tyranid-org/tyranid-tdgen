import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export const { version } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../package.json'),
    'utf-8'
  )
);


/**
 * standard formatting for interface name
 */
export function formatName(
  name: string
) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


/**
 * add indentation to string for emit
 */
export function pad(
  str: string,
  n: number
) {
  let indent = '';
  let curr = '  ';
  while (true) {
    if (n & 1) indent += curr;
    n >>>= 1;
    if (n <= 0) break;
    curr += curr;
  }

  return indent + str;
}


/**
 * create a tagged union type from an array of primatives
 */
export function taggedUnion(
  arr: any[],
  prop?: string
): string {
  return _.chain(arr)
    .map(el => prop ? _.get(el, prop) : el)
    .sortBy()
    .map(v => typeof v === 'string' ? `'${v}'` : v)
    .join('|')
    .value();
}
