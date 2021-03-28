module.exports = {
  addTimestampTrigger: (knex, tableName) => {
    return knex.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${tableName}
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
      `);
  },
};
