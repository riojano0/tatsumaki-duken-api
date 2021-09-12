var express = require('express');
var serverless = require('serverless-http')
var googleApi = require('../api/google-api');

const app = express();
var router = express.Router();

const apiRouter = router.get('/', async function(req, res, next) {
  const videos = await googleApi.getVideos();
  res.json(videos);
});

app.use('/.netlify/functions/api', apiRouter);

module.exports = app;
module.exports.handler = serverless(app)
