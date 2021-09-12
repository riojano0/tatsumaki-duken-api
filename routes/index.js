var express = require('express');
var googleApi = require('../api/google-api');
var router = express.Router();

router.get('/', async function(req, res, next) {
  const videos = await googleApi.getVideos();
  res.json(videos);
});

module.exports = router;
