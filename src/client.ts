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
  collections: Tyr.CollectionInstance[],
  passedOptions: InterfaceGenerationOptions = {}
) {
  const td = `${generateDefinitionPreamble(passedOptions)}

declare module 'tyranid-client' {

  export namespace Tyr {

    type ObjectID = string;

    export const byName: CollectionsByName & { [key: string]: CollectionInstance | void };

    export const byId: CollectionsById & { [key: string]: CollectionInstance | void };

    export interface CollectionInstance<T extends Tyr.Document = Tyr.Document> {
      findAll(args: any): Promise<T[]>;
      findOne(args: any): Promise<T>;
      idToUid(id: string): string;
    }

    export interface Document {
      $model: Tyr.CollectionInstance<this>;
      $uid: string;
      $id: string;
    }

${generateModule(collections, {
    client: true,
    commentLineWidth: passedOptions.commentLineWidth
  })}
  }

}
`;

  return td;
}
