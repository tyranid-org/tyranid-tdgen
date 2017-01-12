import { Tyr } from 'tyranid';
import { InterfaceGenerationOptions } from './util';
import { generateModule } from './module';
import { generateDefinitionPreamble } from './preamble';

/**
 *
 * TODO: base interfaces should be moved to tyranid repo
 *
 */
/**
 *
 * Generate tyranid definition file for client usage
 *
 */
export function generateClientDefinitionFile(
  collections: Tyr.GenericCollection[],
  passedOptions: InterfaceGenerationOptions = {}
) {
  const td = `${generateDefinitionPreamble(passedOptions)}

declare module 'tyranid-client' {

  export namespace Tyr {

    type ObjectID = string;

    export const byName: CollectionsByName & { [key: string]: GenericCollection | void };

    export const byId: CollectionsById & { [key: string]: GenericCollection | void };

    export interface GenericCollection extends CollectionInstance<Tyr.Document> {}

    export interface CollectionInstance<T extends Tyr.Document> {
      findAll(args: any): Promise<T[]>;
      findOne(args: any): Promise<T>;
      idToUid(id: string): string;
    }

    export interface Document {
      $model: Tyr.CollectionInstance<this>;
      $uid: string;
      $id: string;
    }

${generateModule(collections, true)}
  }

}
`;

  return td;
}
