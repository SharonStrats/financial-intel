const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config');
const sleep = require('sleep-promise');
// instantiate Twit module
const twitter = new Twit(config.twitter);
//const nytTop = require("nyt-top");
//nytTop.key('not a key'); // set your Top Stories API developer key

// you can play with the width here
const TWEET_COUNT = 80;
const MAX_WIDTH = 320;
const OEMBED_URL = 'statuses/oembed';
const USER_TIMELINE_URL = 'lists/statuses';
let max_id = 0;
let oEmbedTweets = [], tweets = [],
  params = {
    slug: 'finsite',
    owner_screen_name: 'StratsSharon',
    count: TWEET_COUNT // how many tweets to return
  };

let renderHomepage = function (req, res) {
  res.render('index', {
    title: 'Your Financial Intel',
    pageHeader: {
      title: 'Expert',
      strapline: 'Hear what the experts have to say.'
    },
    tweets: oEmbedTweets
  });

}

/**
   * requests the oEmbed html
   */
function getOEmbed(tweet) {

  let params = {
    "id": tweet.id_str,
    "maxwidth": MAX_WIDTH,
    "hide_thread": true,
    "omit_script": true
  };

  // request data 
  twitter.get(OEMBED_URL, params, function (err, data, resp) {
    tweet.oEmbed = data;
    oEmbedTweets.push(tweet);
  });
}

module.exports.homelist = function (req, res) {
  if (oEmbedTweets > 92) {
    oEmbedTweets = [];
  }
  if (oEmbedTweets.length !== 0) {
    params = {
      slug: 'finsite',
      owner_screen_name: 'StratsSharon',
      since_id: max_id
    };
    console.log(JSON.stringify(params));
  }

  twitter.get(USER_TIMELINE_URL, params, async function (err, data, resp) {

    tweets = data;
    console.log('Error: ' + err);
    
    let count = 0;
    for (let i = 0; i < tweets.length; i++) {
      // if (tweets[i].user.screen_name != ' ' && tweets[i].user.screen_name != 'ReutersBiz') {
      console.log(" id " + tweets[i].id);
      // the first time I want them all to appear
      // the second time when the tweet is the one with the max_id
      // I don't want to add it because having trouble excluding it from request.
      if (max_id !== tweets[i].id) {
        getOEmbed(tweets[i]);
        count++;
      }
      if (max_id < tweets[i].id) {
        max_id = tweets[i].id;
      }
    } // end if, for   console.log("testing");

    await sleep(5 * 1000);
    renderHomepage(req, res);

  }); //end twitter  
}; // end homelist export
