import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 't00',
  name: 'test',
  dbName: 'test',
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' },
    count: { is: 'double' },
    linkId: { link: 'linked' },
    list: {
      is: 'array',
      of: {
        is: 'object',
        fields: {
          type: { is: 'integer' },
          name: { is: 'string' }
        }
      }
    }
  }
});
