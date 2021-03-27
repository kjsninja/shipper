require('dotenv').config();

const express = require('express');
const app = express();

app.use('/', require('./routes'));

app.use('*', (req, res)=>{
  res.status(404).end();
});

app.listen(process.env.PORT, ()=>{
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
