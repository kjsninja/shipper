require('dotenv').config();
require('./lib/basedir');

const express = require('express');
const app = express();

require('./lib/database');

app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes'));

app.use('*', (req, res)=>{
  res.status(404).end();
});

module.exports = app;
