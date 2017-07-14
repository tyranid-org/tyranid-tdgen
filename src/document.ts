import { Tyr } from 'tyranid';
import * as names from './names';

/**
 * generate interface for tyranid document type
 */
export function docInterface(col: Tyr.CollectionInstance): string {
  const { name, fields } = col.def;
  const interfaceName = names.document(name);
  const baseName = names.base(name);

  return `
    /**
     * Document returned by collection "${name}" <${names.collection(
    col.def.name
  )}>
     */
    export interface ${interfaceName} extends Tyr.Document, ${baseName}<Tyr.Document> {
      _id: ObjectID
    }
    `;
}
