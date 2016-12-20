import * as fs from 'fs';
import * as path from 'path';

export const { version } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../package.json'),
    'utf-8'
  )
);


export function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


export function pad(str: string, indent: number) {
  let i = indent;
  while (i--) str = '  ' + str;
  return str;
}

