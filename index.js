const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { nome, dataNascimento } = req.body;
  const idade = moment().diff(moment(dataNascimento), 'years');

  let rota = 'major';

  if (idade < 18) {
    rota = 'minor';
  }

  res.redirect(`/${rota}?nome=${nome}`);
});

const minorMajorMiddleware = (req, res, next) => {
  const { nome } = req.query;

  if (nome) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/major', minorMajorMiddleware, (req, res) => {
  const { nome } = req.query;

  res.send(`Parabéns ${nome}, você tem mais de 18 anos.`);
});

app.get('/minor', minorMajorMiddleware, (req, res) => {
  const { nome } = req.query;

  res.send(`Que pena ${nome}, você tem menos de 18 anos.`);
});

app.listen(3000);
