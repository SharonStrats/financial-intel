var express = require('express');
var router = express.Router();
var ctrlExperts = require('../routes/news');




//router.get('/', ctrlExperts.expertInfo);
router.get('/', ctrlExperts.homelist);

module.exports = router;
