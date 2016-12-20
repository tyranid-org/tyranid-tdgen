import { Tyr } from 'tyranid';
import * as _ from 'lodash';
import { version } from './util';
import {
  generateCollectionInstanceInterface,
  generateEnumCollectionIdTypeAlias,
  EnumCollectionIdTypeAlias,
  EnumIdAliasLookup
} from './collection';


/**
 * create a type definition file for tyranid collections
 */
export function generate(collections: Tyr.CollectionInstance[]) {
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
    }, {} as EnumIdAliasLookup)
    .value();

  const enumCollectionIdAliases = enumCollectionIdChain.value();


  const collectionInterfaces = _.chain(collections)
    .sortBy(col => col.def.name)
    .map(col => generateCollectionInstanceInterface({ col, enumCollectionIdLookup }))
    .value();


  for (const colInt of collectionInterfaces) {
    const { name, id, doc, interfaceName, declaration } = colInt;
    byNameEntries.push(`${name}: ${interfaceName};`);
    byIdEntries.push(`${id}: ${interfaceName};`);
    documentInterfaceDeclarations.push(doc.declaration);
    collectionInterfaceDeclarations.push(declaration);
  }

  const td = `/**
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * 
 * Generated by \`tyranid-tdgen@${version}\`: https://github.com/tyranid-org/tyranid-tdgen
 * date: ${new Date()}
 */
import { ObjectID } from 'mongodb';
import { Tyr } from 'tyranid';

declare module 'tyranid' {

  namespace Tyr {

    /**
     * Add lookup properties to Tyr.byName with extended interfaces
     */
    interface TyranidCollectionsByName {
      ${byNameEntries.join('\n      ')}
    }

    /**
     * Add lookup properties to Tyr.byId with extended interfaces
     */
    interface TyranidCollectionsById {
      ${byIdEntries.join('\n      ')}
    }

    ${collectionInterfaceDeclarations.join('\n')}

    ${documentInterfaceDeclarations.join('\n')}

    ${enumCollectionIdAliases.map(a => a.declaration).join('\n')}

  }

}
`;

  return td;
}