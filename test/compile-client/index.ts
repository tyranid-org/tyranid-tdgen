import { Tyr } from 'tyranid-client';



function run() {
  Tyr.byName.user.findAll({ query: {} })
    .then(docs => {
      const doc = docs[0];
      doc.email;
    });
}

run();