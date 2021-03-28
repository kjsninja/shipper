const tableName = 'files';
const helper = require('../lib/migration');

exports.up = async function(knex) {
  await knex.schema.createTable(tableName, function(table) {
    table.increments('id');
    table.string('ip', 16);
    table.string('publicKey', 100);
    table.string('privateKey', 100);
    table.json('file');
    table.integer('status').defaultTo(1);
    table.string('storage', 20);
    table.timestamps(false, true);
  });

  await helper.addTimestampTrigger(knex, tableName);
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};

exports.config = {transaction: true};
