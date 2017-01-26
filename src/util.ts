import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')
);

export interface InterfaceGenerationOptions {
  // write date to file
  date?: boolean;
  // string to write at top of generated file
  header?: string;
  // length of comment lines
  commentLineWidth?: number;
}

/**
 * standard formatting for interface name
 */
export function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * add indentation to string for emit
 */
export function pad(str: string, n: number) {
  let indent = '';
  let curr = '  ';
  while (true) {
    if (n & 1)
      indent += curr;
    n >>>= 1;
    if (n <= 0)
      break;
    curr += curr;
  }

  return indent + str;
}

/**
 * create a tagged union type from an array of primatives
 */
export function taggedUnion(arr: any[], prop?: string): string {
  return _
    .chain(arr)
    .map(el => prop ? _.get(el, prop) : el)
    .sortBy()
    .map(v => typeof v === 'string' ? `'${v}'` : v)
    .join('|')
    .value();
}


/**
 *
 * split a string into lines of a certain width
 *
 */
export function wordWrap(
  str: string,
  width = 80
): string[] {
  const lines: string[] = [];
  const words = str.trim().split(/\s+/g);
  const SPACE = ' ';
  const HYPHEN = '-';

  let line = '';
  let word: string | undefined;

  while (word = words.shift()) {

    if ((line.length + SPACE.length + word.length) <= width) {
      line += SPACE + word;
    } else if (line.length < width) {

      const remainingChars = width - line.length;

      if (remainingChars > 1) {
        if (word.length >= width) {
          const substringLength = remainingChars - SPACE.length - HYPHEN.length;
          line += (
            SPACE +
            word.substring(0, substringLength) +
            HYPHEN
          );
          lines.push(line.trim());

          word = word.substring(substringLength);

          while (word.length >= width) {
            line = word.substring(0, width - HYPHEN.length) + HYPHEN;
            lines.push(line);
            word = word.substring(width - HYPHEN.length);
          }

          line = word;
        } else {
          lines.push(line.trim());
          line = word;
        }
      } else {
        lines.push(line.trim());
        line = word;
      }

    } else {
      lines.push(line.trim());
      line = '';
    }

  }

  if (line) lines.push(line);

  return lines;
}