var express = require('express');
var router = express.Router();

const { genearteTagclouds } = require('../utils/tagCloud.js');

router.get('/gettagclouds', async function(req, res, next) { 
  const threshold = req.query?.threshold | 5;
  const result = await genearteTagclouds(threshold);
  res.status(200).json(result);
});

module.exports = router;


