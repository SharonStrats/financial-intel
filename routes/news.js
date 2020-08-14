var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../config');
var sleep = require('sleep-promise');
// instantiate Twit module
var twitter = new Twit(config.twitter);
var nytTop = require("nyt-top");
//nytTop.key('not a key'); // set your Top Stories API developer key



// you can play with the width here
var TWEET_COUNT = 28;
var MAX_WIDTH = 320;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'lists/statuses';
var exists;
var results = [];  // have to define up here, not in call since doing 2 api calls?
var oEmbedTweets = [], tweets = [],
  params = {
    slug: 'finsite',
    owner_screen_name: 'StratsSharon',
    count: TWEET_COUNT // how many tweets to return
  };
//I can use the since_id to determine the latest tweets
// the max_id is passed in via a query string param
/*  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }
*/

var renderHomepage = function (req, res, responseBody) {
  res.render('index', {
    title: 'Your Financial Intel',
    pageHeader: {
      title: 'Expert',
      strapline: 'Hear what the experts have to say.'
    },
    experts: responseBody,
    tweets: oEmbedTweets
  });

}

/* GET Expert Info page */
module.exports.expertInfo = function (req, res) {
  res.render('index', {
    title: 'Your Financial Intel',
    pageHeader: {
      title: 'Expert',
      strapline: 'Hear what the experts have to say.'
    },
    experts: responseBody
  });
}



function checkExists(item, dataArray) {
  var exists = false;
  for (var i = 0; i < dataArray.length; i++) {
    if (item.title == dataArray[i].title) {
      return true;
    };
  };
}

/**
   * requests the oEmbed html
   */
function getOEmbed(req, res, tweet) {

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

    // console.log(JSON.stringify(tweet));

    // do we have oEmbed HTML for all Tweets?
    /*  if (oEmbedTweets.length == 20) {
            console.log('In calling render ' + data1.length);
            renderHomepage(req,res,data1);

             
       // res.setHeader('Content-Type', 'application/json');
       // res.send(data1);
      // renderHomepage(req,res,data1);
       } */
  });
}


module.exports.homelist = function (req, res) {
  oEmbedTweets = [];
  oEmbedTweets.length = 0;
  /*
  nytTop.section('business', function (err, data) {
    if (err) { console.log(err); } else {
      results = data.results;
      for (var i = 0; i < results.length; i++) { // top ten most recent stories
       // console.log(results[i]);
        //console.log(results[i].multimedia[1].hasOwnProperty('url'));
       
        if  (results[i].multimedia != '') {
         // console.log(results[i].title);
          var index = results[i].multimedia.length - 1;

          results[i].jumbopic = results[i].multimedia[index].url;
            } else { 
          results[i].jumbopic = '/images/hello.jpg'; }

      
    }
  }
}); */

  //Trying again from start
  twitter.get(USER_TIMELINE_URL, params, async function (err, data, resp) {
    //tweets = data;
    tweets = data;
    //console.log(JSON.stringify(tweets));
    // 
    console.log('Error: ' + err);

    var i = 0, len = tweets.length;
    var count = 0;
    console.log("Tweets length: " + tweets.length);

    for (i; i < len; i++) {
      // if (tweets[i].user.screen_name != ' ' && tweets[i].user.screen_name != 'ReutersBiz') {
      getOEmbed(req, res, tweets[i]);
      count++;
      //    } 
    } // end if, for

    console.log('Count: ' + count);
    if (count >= 25) {
      await sleep(10 * 1000);
      renderHomepage(req, res, results);
    }
  }); //end twitter  
}; // end homelist export

