import { pad, formatName, wordWrap } from './util';
import { EnumIdAliasLookup } from './collection';
import { Tyr } from 'tyranid';

function assignableToString(fieldName: string) {
  switch (fieldName) {
    case 'string':
    case 'url':
    case 'email':
    case 'image':
    case 'password':
    case 'uid':
      return true;
  }
  return false;
}

export function addComment(
  field: Tyr.FieldDefinition,
  indent: number,
  width = 80
) {
  let out = '';
  if (field.note) {
    const lines = wordWrap(field.note, width);

    out += '/*\n';
    let line: string | undefined = '';
    while ((line = lines.shift())) {
      out += pad(' * ' + line + (lines.length === 0 ? '' : '\n'), indent);
    }
    out += '\n';
    out += pad(' */', indent);
    out += '\n' + pad('', indent);
  }
  return out;
}

/**
 *
 * given an field definition, emit a type definition
 *
 */
export function addField(opts: {
  name: string;
  def: Tyr.FieldDefinition;
  indent: number;
  enumCollectionIdLookup: EnumIdAliasLookup;
  parent?: string;
  colName?: string;
  siblingFields?: { [key: string]: any };
  noPopulatedProperty?: boolean;
  commentLineWidth?: number;
}): string {
  let {
    name,
    def,
    indent = 0,
    parent,
    siblingFields,
    enumCollectionIdLookup,
    colName,
    commentLineWidth,
    noPopulatedProperty = false
  } = opts;

  /**
   *
   * TODO: tyranid typings need to be fixed
   *
   */
  if (def.def) def = def.def;

  // if the field is `_id` and the collection is an enum, use the type alias
  if (name === '_id' && colName && colName in enumCollectionIdLookup) {
    return enumCollectionIdLookup[colName].idTypeAlias;
  }

  /**
   *
   * link types
   *
   */
  if (def.link) {
    const linkIdType = def.link in enumCollectionIdLookup
      ? enumCollectionIdLookup[def.link].idTypeAlias
      : 'ObjectID';

    // add populated prop too
    if (parent === 'array' || noPopulatedProperty) return linkIdType;
    // TODO: better parser will add optional array populated prop
    let out = '';
    out += `${linkIdType};\n`;

    const deIded = name.replace(/Id$/, '');
    let replacementName = !/Id$/.test(name) ||
      (siblingFields && deIded in siblingFields)
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
      return `${def.of
        ? addField({
            name,
            def: def.of,
            indent,
            parent: 'array',
            enumCollectionIdLookup
          })
        : 'any'}[]`;
    }

    case 'object': {
      if (def.keys && def.of) {
        if (
          !def.keys.is ||
          (!assignableToString(def.keys.is) && def.keys.is !== 'integer')
        ) {
          console.warn(
            `Invalid key type: ${JSON.stringify(def.keys)} defaulting to any`
          );
          return 'any';
        }

        const subType = addField({
          name: name + '_hash',
          def: def.of,
          indent: indent + 1,
          enumCollectionIdLookup,
          noPopulatedProperty: true
        });

        const keyType = assignableToString(def.keys.is) ? 'string' : 'number';

        let out = '';
        out += '{';
        out += '\n';
        out += pad(`[key: ${keyType}]: ${subType} | void ;`, indent);
        out += '\n';
        out += pad('}', indent - 1);
        return out;
      }

      const subFields = def.fields;

      if (!subFields || (Array.isArray(subFields) && !subFields.length))
        return 'any';
      const subFieldKeys = Object.keys(subFields);
      subFieldKeys.sort();

      let obj = '{';

      for (const sub of subFieldKeys) {
        const subDef = subFields[sub].def;
        const required =
          sub === '_id' ||
          subFields[sub].required ||
          (subDef && subDef.required);
        obj += '\n';
        const subName = sub + (required ? '' : '?');
        const subType = addField({
          name: sub,
          def: subFields[sub],
          indent: indent + 1,
          siblingFields: subFields,
          enumCollectionIdLookup
        });
        const fieldDef = `${subName}: ${subType};`;
        const comment =
          (subDef && addComment(subDef, indent, commentLineWidth)) || '';
        obj += comment ? pad(comment, indent) : '';
        obj += comment ? fieldDef : pad(fieldDef, indent);
      }

      obj += '\n';
      obj += pad('}', indent - 1);
      return obj;
    }

    default:
      return 'any';
  }
}
