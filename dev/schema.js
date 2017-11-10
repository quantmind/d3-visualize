const d3 = require('../build/d3-visualize');
const fs = require('fs');
const Ajv = require('ajv');
const logger = require('console');

const outFile = 'build/schema.json';
const draft = 'draft-04';

const schema = JSON.parse(JSON.stringify(d3.visuals.schema));
const ajv = new Ajv;
schema.$schema = `http://json-schema.org/${draft}/schema#`;
ajv.addMetaSchema(require(`ajv/lib/refs/json-schema-${draft}.json`));
//
// validate schema
ajv.compile(schema);

fs.writeFile(outFile, JSON.stringify(schema), err => {
    if (err) {
        logger.error(`Failed to write ${outFile}: ${err}`);
    } else {
        logger.info(`Created ${outFile}`);
    }
});
