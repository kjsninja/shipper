require('dotenv').config();
process.env.BASE_DIR = __dirname;

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes'));

app.use('*', (req, res)=>{
  res.status(404).end();
});

module.exports = app;
