var express = require('express');
var router = express.Router();
var ctrlExperts = require('./tweets');

router.get('/', ctrlExperts.homelist);

/* GET testing news page. */

module.exports = router;
