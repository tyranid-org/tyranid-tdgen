import { Tyr } from 'tyranid';
import * as _ from 'lodash';
import { pad, formatName } from './util';
import { DocumentInterfaceDeclaration, generateDocumentInterface } from './document';


/**
 * generated interface for tyranid collection type,
 * with metadata
 */
export interface CollectionInterfaceDeclaration extends DocumentInterfaceDeclaration {
  id: string;
  doc: DocumentInterfaceDeclaration;
}

export interface EnumCollectionIdTypeAlias {
  col: Tyr.CollectionInstance;
  declaration: string;
  idTypeAlias: string;
}

export interface EnumIdAliasLookup {
  [key: string]: EnumCollectionIdTypeAlias;
}


/**
 * produce union type alias for enum id values
 */
export function generateEnumCollectionIdTypeAlias(
  opts: {
    col: Tyr.CollectionInstance
  }
): EnumCollectionIdTypeAlias | void {
  const { col } = opts;
  if (!col.def.enum) throw new Error(`Non-enum collection passed to generateEnumCollectionIdTypeAlias`);

  const { name, values = [] } = col.def;

  if (!values.length) {
    throw new Error(`Enum type with no values provided: ${col.def.name}`);
  }

  if (!('_id' in values[0])) return;

  const idTypeAlias = `${formatName(name)}Id`;
  const idType = values.map((v: any) => {
    const id = v['_id'];
    if (typeof id === 'string') return `'${id}'`;
    return id;
  }).join('|');

  return {
    col,
    idTypeAlias,
    declaration: `
    /**
     * Type alias for enum id values in "${name}" collection
     */
    export type ${idTypeAlias} = ${idType};
    `
  };
}



/**
 * generate interface for individual tyranid collection
 */
export function generateCollectionInstanceInterface(
  opts: {
    col: Tyr.CollectionInstance,
    enumCollectionIdLookup: EnumIdAliasLookup
  }
): CollectionInterfaceDeclaration {
  const { col, enumCollectionIdLookup } = opts;

  const {
    name,
    id,
    fields
  } = col.def;

  const interfaceName = `${formatName(name)}Collection`;
  const doc = generateDocumentInterface({
    col,
    colInterfaceName: interfaceName,
    enumCollectionIdLookup
  });

  const properties: string[] = [];
  const enummeration = col.def.enum;

  if (!fields) throw new Error(`Collection "${name}" has no fields!`);

  if (enummeration) {
    const rows = _.sortBy(col.def.values || [], 'name');

    if (rows.length && ('name' in fields)) {
      for (const row of rows) {
        let obj = '{';
        for (const key in row) {
          if (row[key]) {

            // for enum values, reproduce constant values literally
            const literalString = typeof row[key] === 'string';
            const literalNumber = typeof row[key] === 'number';

            let propType: string;
            switch (true) {
              case literalString:
                propType = `'${row[key]}'`;
                break;
              case literalNumber:
                propType = `${row[key]}`;
                break;
              default:
                propType = 'any';
            }

            obj += '\n';
            obj += pad(`${key}: ${propType},`, 4);
          }
        }
        obj += '\n';
        obj += pad('}', 3);

        let enumPropName = _.snakeCase((<any> row)['name']).toUpperCase();

        // need to wrap in quotes if starting with digit
        if (/[0-9]/.test(enumPropName[0])) {
          enumPropName = `"${enumPropName}"`;
        }

        properties.push(
          `\n      ${enumPropName}: ${obj};`
        );
      }
    }
  }

  const interfaceType = enummeration
    ? 'TypedEnum'
    : 'TypedCollection';

  return {
    name,
    id,
    doc,
    interfaceName,
    declaration: `
    /**
     * Type definition for "${name}" collection
     */
    export interface ${interfaceName} extends ${interfaceType}<${doc.interfaceName}> {}
    `
  };
};