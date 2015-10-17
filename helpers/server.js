'use strict';

// load env variables
require('dotenv').load();

// load deps
let express = require('express');
let session = require('express-session');

// load database
let db = require('../helpers/database');

// load the app
let app = express();

// set the database
app.set('db', db);

// set status API route
app.get('/status', statusRoute);
app.all('/', (req, res) => { res.redirect('/status'); });

// load routers
let Api = require('../api');
let Auth = require('../auth');

db['database'].once('connected', startServer);

module.exports = app;

function startServer () {
  // use session storage
  app.use(session({
    secret: process.env.SESSION_SECRET || '0ThG9zitEectQpq7ThV2'
  }));
  // set the api routes
  app.use('/api', Api(app));
  // mount auth routes
  app.use('/auth', Auth(app));
}

function statusRoute (req, res) {
  res.status(200).send('ok');
}
