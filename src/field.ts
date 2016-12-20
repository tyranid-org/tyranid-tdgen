import { pad, formatName } from './util';
import { EnumIdAliasLookup } from './collection';


/**
 * 
 * given an field definition, emmit a type definition
 * 
 */
export function addField(opts: {
  name: string,
  def: any,
  indent: number,
  enumCollectionIdLookup: EnumIdAliasLookup,
  parent?: string,
  siblingFields?: { [key: string]: any },
}): string {
  let {
    name,
    def,
    indent = 0,
    parent,
    siblingFields,
    enumCollectionIdLookup
  } = opts;

  /**
   * 
   * TODO: tyranid typings need to be fixed
   * 
   */
  if (def.def) def = def.def;

  /**
   * 
   * link types
   * 
   */
  if (def.link) {
    const linkIdType = (def.link in enumCollectionIdLookup)
      ? enumCollectionIdLookup[def.link].idTypeAlias
      : 'ObjectID';

    // add populated prop too
    if (parent === 'array') return linkIdType; // TODO: better parser will add optional array populated prop
    let out = '';
    out += `${linkIdType};\n`;

    const deIded = name.replace(/Id$/, '');
    let replacementName = (!/Id$/.test(name) || (siblingFields && (deIded in siblingFields)))
      ? `${name}$`
      : deIded;

    out += pad(`${replacementName}?: ${formatName(def.link)}`, indent - 1);
    return out;
  }

  /**
   * 
   * general types
   * 
   */
  switch (def.is) {

    case 'string':
    case 'url':
    case 'email':
    case 'image':
    case 'password':
    case 'uid':
      return 'string';

    case 'boolean':
      return 'boolean';

    case 'double':
    case 'integer':
      return 'number';

    case 'date':
      return 'Date';

    case 'mongoid':
      return 'ObjectID';

    case 'array': {
      return `${def.of ? addField({
        name, 
        def: def.of, 
        indent, 
        parent: 'array',
        enumCollectionIdLookup
      }) : 'any'}[]`;
    }


    case 'object': {
      const subFields = def.fields;

      if (!subFields || (Array.isArray(subFields) && !subFields.length)) return 'any';
      const subFieldKeys = Object.keys(subFields);
      subFieldKeys.sort();

      let obj = '{';

      for (const sub of subFieldKeys) {
        const required = (
          (sub === '_id') ||
          subFields[sub].required ||
          (subFields[sub].def && subFields[sub].def.required)
        );
        obj += '\n';
        const subName = sub + (required ? '' : '?');
        const subType = addField({
          name: sub,
          def: subFields[sub],
          indent: indent + 1,
          siblingFields: subFields,
          enumCollectionIdLookup
        });
        obj += pad(`${subName}: ${subType};`, indent);
      }

      obj += '\n';
      obj += pad('}', indent - 1);
      return obj;
    }

    default:
      return 'any';

  }
}