import { Tyr } from 'tyranid';
import { formatName } from './util';
import { addField } from './field';
import { EnumIdAliasLookup } from './collection';

/**
 * generated interface for tyranid document type,
 * with metadata
 */
export interface DocumentInterfaceDeclaration {
  interfaceName: string;
  name: string;
  declaration: string;
};


/**
 * generate interface for tyranid document type
 */
export function generateDocumentInterface(opts: {
  col: Tyr.CollectionInstance,
  colInterfaceName: string,
  enumCollectionIdLookup: EnumIdAliasLookup
}): DocumentInterfaceDeclaration {
  const { col, colInterfaceName, enumCollectionIdLookup } = opts;
  const { name, fields } = col.def;
  const interfaceName = `${formatName(name)}`;
  const properties: string[] = [];

  if (!fields) throw new Error(`Collection "${name}" has no fields!`);

  const fieldKeys = Object.keys(fields);
  fieldKeys.sort();

  for (const field of fieldKeys) {
    const def = fields[field]['def'];
    if (def) {
      const required = (field === '_id') || def.required;
      const fieldName = field + (required ? '' : '?');
      const fieldType = addField({
        name: field,
        def: def,
        indent: 4,
        siblingFields: fields,
        enumCollectionIdLookup
      });

      properties.push(`${fieldName}: ${fieldType};`);
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
      ${properties.join('\n      ')}
    }
    `
  };
}
