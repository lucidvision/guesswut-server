const app = require('./src');

app.set('port', process.env.PORT);

app.listen(app.get('port'), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Magic happens on port ${app.get('port')}`);
  }
});
