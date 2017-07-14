import { Tyr } from 'tyranid';
import * as _ from 'lodash';
import { wrappedUnionType } from './util';
import * as names from './names';
import { colInterface, enumIdAlias } from './collection';
import { docInterface } from './document';
import { baseInterface } from './base';

export interface GenerateModuleOptions {
  client?: boolean;
  commentLineWidth?: number;
}

/**
 * create a type definition file for tyranid collections,
 * expects the following types to be in scope:
 *
 *   - ObjectID
 *   - Tyr.Document
 *   - Tyr.Collection<T extends Tyr.Document>
 *
 */
export function generateModule(
  collections: Tyr.CollectionInstance[],
  opts: GenerateModuleOptions = {}
) {
  const { client, commentLineWidth } = opts;
  const byNameEntries: string[] = [];
  const byIdEntries: string[] = [];
  const cols: string[] = [];
  const docs: string[] = [];
  const bases: string[] = [];
  const enumIds: string[] = [];

  for (const col of _.sortBy(collections, 'def.name')) {
    const { id, name } = col.def;
    const interfaceName = names.collection(name);
    const alias = col.def.enum && enumIdAlias(col);

    bases.push(baseInterface(col, { commentLineWidth }));
    docs.push(docInterface(col));
    cols.push(colInterface(col));
    if (alias) enumIds.push(alias);

    byNameEntries.push(`${name}: ${interfaceName};`);
    byIdEntries.push(`${id}: ${interfaceName};`);
  }

  const definitions = `
    /**
     * Add lookup properties to Tyr.byName with extended interfaces
     */
    ${client ? 'export ' : ''}interface CollectionsByName {
      ${byNameEntries.join('\n      ')}
    }

    /**
     * Add lookup properties to Tyr.byId with extended interfaces
     */
    ${client ? 'export ' : ''}interface CollectionsById {
      ${byIdEntries.join('\n      ')}
    }

    ${cols.join('')}
    ${docs.join('')}
    ${bases.join('')}
    ${enumIds.join('')}

    /**
     * Union type of all current collection names
     */
    export type CollectionName =
      ${wrappedUnionType(Tyr.collections, 'def.name', 3)};

    /**
     * Union type of all current collection ids
     */
    export type CollectionId =
      ${wrappedUnionType(Tyr.collections, 'def.id', 3)};
  `;

  return definitions;
}
