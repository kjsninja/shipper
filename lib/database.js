const config = require('../knexfile');
const knex = require('knex')(config[process.env.NODE_ENV]);

knex.queryBuilder().select(knex.raw('version()')).then((data)=>{
  console.log('DB Connected!');
}).catch((error)=>{
  console.error('Can\'t connect to DB!');
  throw error;
});

module.exports = knex;
