import { Tyr } from 'tyranid';
import { formatName, pad } from './util';
import { addField, addComment } from './field';
import { EnumIdAliasLookup } from './collection';

/**
 * generated interface for tyranid document type,
 * with metadata
 */
export interface DocumentInterfaceDeclaration {
  interfaceName: string;
  name: string;
  declaration: string;
}

/**
 * generate interface for tyranid document type
 */
export function generateDocumentInterface(opts: {
  col: Tyr.GenericCollection;
  colInterfaceName: string;
  enumCollectionIdLookup: EnumIdAliasLookup;
  commentLineWidth?: number;
}): DocumentInterfaceDeclaration {
  const {
    col,
    colInterfaceName,
    enumCollectionIdLookup,
    commentLineWidth
  } = opts;
  const { name, fields } = col.def;
  const interfaceName = `${formatName(name)}`;
  const properties: string[] = [];

  if (!fields) throw new Error(`Collection "${name}" has no fields!`);

  const fieldKeys = Object.keys(fields);
  fieldKeys.sort();

  for (const field of fieldKeys) {
    const def = fields[field]['def'];
    if (def) {
      const required = field === '_id' || def.required;
      const indent = 4;
      const fieldName = field + (required ? '' : '?');
      const fieldType = addField({
        name: field,
        def: def,
        indent,
        siblingFields: fields,
        colName: name,
        enumCollectionIdLookup,
        commentLineWidth
      });

      properties.push(
        addComment(def, indent - 1, commentLineWidth) +
          `${fieldName}: ${fieldType};`
      );
    }
  }

  return {
    name,
    interfaceName,
    declaration: `
    /**
     * Document returned by collection "${name}" <${colInterfaceName}>
     */
    export interface ${interfaceName} extends Tyr.Document {
      ${properties.join('\n' + pad('', 3))}
    }
    `
  };
}
