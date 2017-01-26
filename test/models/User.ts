import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 'u00',
  name: 'user',
  dbName: 'users',
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' },
    email: { is: 'email' },
    skills: {
      is: 'array',
      note: 'A list of skills that the user has.',
      of: {
        is: 'object',
        note: 'A sub document comment',
        fields: {
          years: {
            is: 'integer'
          },
          name: {
            is: 'string',
            note: 'The name of a skill that the user has.'
          }
        }
      }
    }
  }
})