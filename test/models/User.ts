import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 'u00',
  name: 'user',
  dbName: 'user',
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' }
  }
});