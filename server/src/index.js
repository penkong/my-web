//include server.js from full stack react
import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();
//proxy sit between browser and api and catch cookie
app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
      opts.headers['x-forwarded-host'] = 'localhost:3000';
      return opts;
    }
  })
);


//tell express let all humanity and aliens use this folder
app.use(express.static('public'));





app.get('*', (req, res) => {
  //cause of proxy and axios instance work on store pass req to it / include cookie
  const store = createStore(req);
  //these are logic help us to load routes duo to req path for react-router-config
  //match routes do this here,
  const promises = matchRoutes(Routes, req.path)
    //for first time load data call from here to manually dispatch
    .map(({ route }) => route.loadData ? route.loadData(store) : null )
    //this promise is for not load whole store in app for req of only one comp
    .map(promise => { if (promise) new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
    });
  Promise.all(promises).then(() => {
    const context = {};
    //for static router pass req to find out url .
    //pass store to renderer for init load redux
    const content = renderer(req, store, context);
    if (context.url) res.redirect(301, context.url);
    if (context.notFound) {res.status(404);}
    res.send(content);
  });
});






app.listen(3000, () => {
  console.log('Listening on prot 3000');
});

// this is server.js
////////////////////////////////////////////////////
//from full stack guys

//seems these guys related to api ha?
const express = require('express');
const path = require('path');


const app = express();

//all server routes come here db auth or other ...

if (process.env.NODE_ENV !== 'production') {
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config');

  app.use(webpackMiddleware(webpack(webpackConfig))); //for dev
} else {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  })
}
app.listen(3050, () => console.log('listening'));

const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);