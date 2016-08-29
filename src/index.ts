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


function addField(def: any, indent = 0): string {
  if ('def' in def) def = def.def;
  if ('link' in def) return 'ObjectID';

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
      return `${def.of ? addField(def.of, indent) : 'any'}[]`;

    case 'object': {
      const subFields = def.fields;
      if (!subFields) return 'any';
      let obj = ""
      obj += "{";
      for (const sub in subFields) {
        obj += "\n"
        obj += pad(`${sub}: ${addField(subFields[sub], indent + 1)}`, indent);
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

  let properties: string[] = [];

  for (const field in fields) {
    properties.push(
      `${field}: ${addField(fields[field]['def'], 4)};`
    );
  }

  return {
    name,
    interfaceName,
    declaration: `
    /**
     * Document returned by collection "${name}" <${colInterfaceName}>
     */
    interface ${interfaceName} extends Document {
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
    id
  } = col.def;

  const interfaceName = `${formatName(name)}CollectionInstance`;
  const doc = generateDocumentInterface(col, interfaceName);
  const signature = `(...args: any[]): `;

  return {
    name,
    id,
    doc,
    interfaceName,
    declaration: `
    /**
     * Type definition for "${name}" collection
     */
    interface ${interfaceName} extends CollectionInstance {
      ${methods.single.map(m => `${m}${signature}${doc.interfaceName};`).join("\n      ")}
      ${methods.singlePromise.map(m => `${m}${signature}Promise<${doc.interfaceName}>;`).join("\n      ")}
      ${methods.arrayPromise.map(m => `${m}${signature}Promise<${doc.interfaceName}[]>;`).join("\n      ")}
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


export function generateFile(collections: Tyr.CollectionInstance[], filename: string): Promise<string> {
  return new Promise((res, rej) => {
    try {
      const td = generate(collections);
      fs.writeFile(filename, td, (err) => {
        if (err) rej(err);
        res(td);
      });
    } catch (err) {
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