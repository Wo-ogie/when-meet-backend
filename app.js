const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./models');

const app = express();

app.set('port', process.env.PORT || 3000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Success DB connection.');
  })
  .catch((err) => {
    console.error(err);
  });

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    morgan('combined')(req, res, next);
  } else {
    morgan('dev')(req, res, next);
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);

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
