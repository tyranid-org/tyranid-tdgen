import { Tyr } from 'tyranid';
import { InterfaceGenerationOptions } from './util';
import { generateModule } from './module';
import { generateDefinitionPreamble } from './preamble';

/**
 *
 * Generate tyranid definition file for server usage, extends existing tyranid types
 *
 */
export function generateServerDefinitionFile(
  collections: Tyr.CollectionInstance[],
  passedOptions: InterfaceGenerationOptions = {}
) {
  const td = `${generateDefinitionPreamble(passedOptions)}
import { ObjectID } from 'mongodb';
import { Tyr } from 'tyranid';

declare module 'tyranid' {

  namespace Tyr {
${generateModule(collections, {
    commentLineWidth: passedOptions.commentLineWidth
  })}
  }

}
`;

  return td;
}
