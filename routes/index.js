var express = require('express');
var router = express.Router();
var ctrlExperts = require('../routes/news');

//router.get('/', ctrlExperts.expertInfo);
router.get('/', ctrlExperts.homelist);

/* GET testing news page. */

module.exports = router;
