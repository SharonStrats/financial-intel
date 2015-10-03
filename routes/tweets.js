var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 50;
var MAX_WIDTH = 385;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'lists/statuses';

router.get('/lists/statuses/:slug/:owner_screen_name', function(req, res) {

  var oEmbedTweets = [], tweets = [],

  params = {
    slug:req.params.slug,
    owner_screen_name: req.params.owner_screen_name,
    count: TWEET_COUNT // how many tweets to return
  }; 
  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }
    


  // request data 
  twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {
  
    tweets = data;
     //  
        
    var i = 0, len = tweets.length;
   
    for(i; i < len; i++) {
    if (tweets[i].user.screen_name != ' ') {
         getOEmbed(tweets[i]);
           } }
  }); 
  /**
   * requests the oEmbed html
   */
  function getOEmbed (tweet) {

    var params = {
      "id": tweet.id_str,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // request data 
    twitter.get(OEMBED_URL, params, function (err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == 50) {
        res.setHeader('Content-Type', 'application/json');
        res.send(oEmbedTweets);
      }
    });
  }
});

module.exports = router;
