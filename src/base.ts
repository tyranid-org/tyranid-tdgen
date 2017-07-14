import { Tyr } from 'tyranid';
import { pad } from './util';
import * as names from './names';
import { addField, addComment } from './field';

/**
 * generate base interface for tyranid document type
 */
export function baseInterface(col: Tyr.CollectionInstance, opts: {
  commentLineWidth?: number;
}): string {
  const {
    commentLineWidth
  } = opts;
  const { name, fields } = col.def;
  const interfaceName = names.base(name);
  const properties: string[] = [];

  if (!fields) throw new Error(`Collection "${name}" has no fields!`);

  const fieldKeys = Object.keys(fields);
  fieldKeys.sort();

  for (const field of fieldKeys) {
    const def = fields[field]['def'];

    /**
     * don't include injected _id in raw response
     */
    if (def && field !== '_id') {
      const required = def.required;
      const indent = 4;
      const fieldName = field + (required ? '' : '?');
      const fieldType = addField({
        name: field,
        def: def,
        indent,
        siblingFields: fields,
        colName: name,
        commentLineWidth
      });

      properties.push(
        addComment(def, indent - 1, commentLineWidth) +
          `${fieldName}: ${fieldType};`
      );
    }
  }

  return `
    /**
     * Base interface from which documents in collection
     * "${name}" <${names.collection(name)}> are derived
     */
    export interface ${interfaceName}<Container extends {}> {
      ${properties.join('\n' + pad('', 3))}
    }
    `;
}
