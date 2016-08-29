/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../generated/test.d.ts" />
"use strict";
const tyranid_1 = require('tyranid');
function run() {
    tyranid_1.Tyr.byName.user.findAll({})
        .then(docs => {
        const doc = docs[0];
        doc.email;
    });
}
