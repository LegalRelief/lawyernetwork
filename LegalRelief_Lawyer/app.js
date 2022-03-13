//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
// const router = express.Router();
const request = require('request');
//firebase dependencies
const firebase = require("firebase");
require("firebase/firestore");
const db = firebase.firestore();
var cors = require('cors')

fbApp = require('./secrets/legalrelief-lawyer')

//init bodyparsing of elements for HTTP requests
app.use(bodyParser.json());
app.use('/', routes);
app.use(cors())

app.use((err, req, res, next) => {
  res.json(err);
});

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
  });

app.listen(3000, () => console.log('Lawyer app listening on port 3000!'));

module.exports = app;