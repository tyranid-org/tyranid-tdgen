import { Tyr } from 'tyranid';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

const { version: tdgenVersion } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../../package.json"),
    "utf-8"
  )
);


function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


function pad(str: string, indent: number) {
  let i = indent;
  while (i--) str = "  " + str;
  return str;
}




function addField(name: string, def: any, indent = 0, parent?: string): string {
  if (def.def) def = def.def;
  if (def.link) {
    // add populated prop too
    if (parent === 'array') return 'ObjectID'; // TODO: better parser will add optional array populated prop
    let out = '';
    out += 'ObjectID;\n';
    out += pad(`${name.replace(/Id$/, '')}$?: ${formatName(def.link)}Document`, indent - 1);
    return out;
  }

  switch (def.is) {

    case 'string':
    case 'url':
    case 'email':
    case 'image':
    case 'password':
    case 'uid':
      return 'string';

    case 'boolean':
      return 'boolean';

    case 'double':
    case 'integer':
      return 'number';

    case 'date':
      return 'Date';

    case 'mongoid':
      return 'ObjectID';

    case 'array':
      return `${def.of ? addField(name, def.of, indent, 'array') : 'any'}[]`;

    case 'object': {
      const subFields = def.fields;
      if (!subFields) return 'any';
      let obj = ""
      obj += "{";
      for (const sub in subFields) {
        const required = (sub === '_id') || subFields[sub].required || (subFields[sub].def && subFields[sub].def.required);
        obj += "\n"
        obj += pad(`${sub + (required ? '' : '?')}: ${addField(sub, subFields[sub], indent + 1)}`, indent);
      }
      obj += "\n";
      obj += pad("}", indent - 1);
      return obj;
    }

    default:
      return 'any';

  }
}


export const version = tdgenVersion;

export interface DocumentInterfaceDeclaration {
  interfaceName: string;
  name: string;
  declaration: string
};

export interface CollectionInterfaceDeclaration extends DocumentInterfaceDeclaration {
  id: string;
  doc: DocumentInterfaceDeclaration;
}


export function generateDocumentInterface(
  col: Tyr.CollectionInstance,
  colInterfaceName: string
): DocumentInterfaceDeclaration {
  const { name, fields } = col.def;
  const interfaceName = `${formatName(name)}Document`;
  const properties: string[] = [];

  for (const field in fields) {
    const def = fields[field]['def'];
    const required = (field === '_id') || def.required || (def.def && def.def.required);
    properties.push(
      `${field + (required ? '' : '?')}: ${addField(field, def, 4)};`
    );
  }

  return {
    name,
    interfaceName,
    declaration: `
    /**
     * Document returned by collection "${name}" <${colInterfaceName}>
     */
    export interface ${interfaceName} extends Document {
      ${properties.join("\n      ")}
    }
    `
  };
}



  /**
   * Methods to override with new document type
   */
export const methods = {
  single: [
    'new ',
    'fromClient'
  ],
  arrayPromise: [
    'findAll'
  ],
  singlePromise: [
    'findAndModify',
    'findOne'
  ]
};


export function generateCollectionInstanceInterface(
  col: Tyr.CollectionInstance
): CollectionInterfaceDeclaration {
  const {
    name,
    id,
    fields
  } = col.def;

  const interfaceName = `${formatName(name)}CollectionInstance`;
  const doc = generateDocumentInterface(col, interfaceName);
  const signature = `(...args: any[]): `;
  const properties: string[] = [];
  const enummeration = col.def.enum;

  if (enummeration) {
    const rows = col.def.values;

    if ('name' in fields) {
      for (const row of rows) {
        let obj = "{";
        for (const key in row) {
          if (row[key]) {
            obj += '\n';
            obj += pad(`${key}: ${
              typeof row[key] === 'string'
                ? `'${row[key]}'`
                : (typeof row[key] === 'number' ? 'number' : 'any')
            },`, 4)
          }
        }
        obj += '\n';
        obj += pad('}', 3);

        properties.push(
          `\n      ${(<any> row)['name'].toUpperCase().trim().replace(/\s+/gi, '_')}: ${obj};`
        );
      }
    }
  }

  let methodDeclarations = '';

  if (!enummeration) {
    methodDeclarations += [
      '',
      methods.single.map(m => `${m}${signature}${doc.interfaceName};`).join("\n      "),
      methods.singlePromise.map(m => `${m}${signature}Promise<${doc.interfaceName}>;`).join("\n      "),
      methods.arrayPromise.map(m => `${m}${signature}Promise<${doc.interfaceName}[]>;`).join("\n      "),
      `byLabel(label: string): Promise<${doc.interfaceName}>;`,
      ''
    ].join("\n      ");
  } else {
    methodDeclarations += [
      '',
      `byLabel(label: string): ${doc.interfaceName};`,
      ''
    ].join("\n      ");
  }

  return {
    name,
    id,
    doc,
    interfaceName,
    declaration: `
    /**
     * Type definition for "${name}" collection
     */
    export interface ${interfaceName} extends CollectionInstance {
      ${methodDeclarations}${
        properties.length
          ? "\n      " + properties.join("\n      ") + "\n      "
          : ''
      }
    }
    `
  }
};


export function generateStream(collections: Tyr.CollectionInstance[]) {
  const stream = new Readable();
  const td = generate(collections);
  stream.push(td);
  stream.push(null);
  return stream;
}


export function generateFileSync(collections: Tyr.CollectionInstance[], filename: string): string {
  const td = generate(collections);
  fs.writeFileSync(filename, td);
  return td;
}


export function generateFile(collections: Tyr.CollectionInstance[], filename: string, cb?: Function): Promise<string> {
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


export function generate(collections: Tyr.CollectionInstance[]) {
  const collectionInterfaces = collections.map(generateCollectionInstanceInterface);
  const byNameEntries: string[] = [];
  const byIdEntries: string[] = [];
  const collectionInterfaceDeclarations: string[] = [];
  const documentInterfaceDeclarations: string[] = [];

  for (const colInt of collectionInterfaces) {
    const { name, id, doc, interfaceName, declaration } = colInt;
    byNameEntries.push(`${name}: ${interfaceName};`)
    byIdEntries.push(`${id}: ${interfaceName};`);
    documentInterfaceDeclarations.push(doc.declaration);
    collectionInterfaceDeclarations.push(declaration);
  }

  const td = `/**
 * Generated by \`tyranid-tdgen@${version}\`: https://github.com/tyranid-org/tyranid-tdgen
 * date: ${new Date()}
 */
import { ObjectID } from 'mongodb';

declare module 'tyranid' {

  namespace Tyr {

    /**
     * Add lookup properties to Tyr.byName with extended interfaces
     */
    interface TyranidCollectionsByName {
      ${byNameEntries.join("\n      ")}
    }

    /**
     * Add lookup properties to Tyr.byId with extended interfaces
     */
    interface TyranidCollectionsById {
      ${byIdEntries.join("\n      ")}
    }

    ${collectionInterfaceDeclarations.join("\n")}

    ${documentInterfaceDeclarations.join("\n")}

  }

}
`;

  return td;
}