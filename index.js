const app = require('./app');

app.set('port', process.env.PORT);

app.listen(process.env.PORT, ()=>{
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
