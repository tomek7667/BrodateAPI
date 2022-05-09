const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require("mysql");
const queryManager = require('./managers/QueryManager').QueryManager;
const port = 4444;
let app = express();
const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'brodateapi'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/add', function(req, res) {
  res.render('add', { title: 'BrodateAPI' });
})

app.post('/add', function (req, res) {
  if (req.body && req.body.key && req.body.key === "xd") {
    queryManager.addUser(req.body.reported, req.body.reporter, req.body.reason, req.body.score).then(() => {
      queryManager.getUsers().then(data => {
        res.render('index', { title: 'BrodateAPI', players: data });
      }).catch(() => {
        createError(500);
      })
    }).catch(() => {
      createError(400);
    })
  } else {
    createError(500);
  }
})

app.get('/*', function(req, res, next) {
  queryManager.getUsers().then(data => {
    res.render('index', { title: 'BrodateAPI', players: data });
  }).catch(() => {
    createError(500);
  })
});

con.connect((err) => {
  if (err) {
    console.error('error connecting:', err.stack);
    return;
  }
  console.log('connected as id: '+con.threadId);
  queryManager.setCon(con);
  app.listen(port, '127.0.0.1', () => {
    console.log(`Node server running on ${port}`);
  });
})


module.exports = app;
