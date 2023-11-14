const express = require('express');
const path = require('path');
const morgan = require('morgan');

const { sequelize } = require('./models');

const app = express();

app.set('port', process.env.PORT || 3000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const error = new Error(`There is no router. ${req.method} ${req.url}`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {},
    status: err.status || 500,
  });
});

app.listen(app.get('port'), () => {
  console.log(`Listening at ${app.get('port')} port.`);
});
