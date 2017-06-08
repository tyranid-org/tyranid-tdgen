import { Tyr } from 'tyranid-client';

function run() {
  Tyr.byName.user.findAll({ query: {} }).then(docs => {
    const doc = docs[0];
    doc.email;
  });

  const t: Tyr.SpreadsheetTemplateMappingTypeId =
    Tyr.byName.spreadsheetTemplateMappingType.TABULAR._id;
  t === 1;
}

run();
