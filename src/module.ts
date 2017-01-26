import { Tyr } from 'tyranid';
import * as _ from 'lodash';
import { taggedUnion } from './util';
import {
  generateCollectionInstanceInterface,
  generateEnumCollectionIdTypeAlias,
  EnumCollectionIdTypeAlias,
  EnumIdAliasLookup
} from './collection';


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
  collections: Tyr.GenericCollection[],
  opts: GenerateModuleOptions = {}
) {
  const { client, commentLineWidth } = opts;

  const byNameEntries: string[] = [];
  const byIdEntries: string[] = [];
  const collectionInterfaceDeclarations: string[] = [];
  const documentInterfaceDeclarations: string[] = [];


  /**
   * get enum value type literal definitions for use in links
   */
  const enumCollectionIdChain = _.chain(collections)
    .filter(col => col.def.enum)
    .map(col => generateEnumCollectionIdTypeAlias({ col }))
    .compact();

  const enumCollectionIdLookup = enumCollectionIdChain
    .reduce((out, alias: EnumCollectionIdTypeAlias) => {
      out[alias.col.def.name] = alias;
      return out;
    }, <EnumIdAliasLookup> {})
    .value();

  const enumCollectionIdAliases = enumCollectionIdChain.value();


  const collectionInterfaces = _.chain(collections)
    .sortBy(col => col.def.name)
    .map(col => generateCollectionInstanceInterface({
      col, enumCollectionIdLookup, commentLineWidth
    }))
    .value();


  for (const colInt of collectionInterfaces) {
    const { name, id, doc, interfaceName, declaration } = colInt;
    byNameEntries.push(`${name}: ${interfaceName};`);
    byIdEntries.push(`${id}: ${interfaceName};`);
    documentInterfaceDeclarations.push(doc.declaration);
    collectionInterfaceDeclarations.push(declaration);
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

    ${collectionInterfaceDeclarations.join('')}
    ${documentInterfaceDeclarations.join('')}
    ${enumCollectionIdAliases.map(a => a.declaration).join('')}

    /**
     * Union type of all current collection names
     */
    export type CollectionName = ${taggedUnion(Tyr.collections, 'def.name')};

    /**
     * Union type of all current collection ids
     */
    export type CollectionId = ${taggedUnion(Tyr.collections, 'def.id')};
  `;

  return definitions;
}