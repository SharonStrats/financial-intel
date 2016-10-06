var express = require('express');
var router = express.Router();
var google = require('google');
var Twit = require('twit');
var config = require('../config');
// instantiate Twit module
var twitter = new Twit(config.twitter);

// you can play with the width here
var TWEET_COUNT = 40;
var MAX_WIDTH = 320;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'lists/statuses';
var exists;
var data1 = [];  // have to define up here, not in call since doing 2 api calls?
var gnews = [], oEmbedTweets = [], tweets = [],
  params = {
    slug: 'finsite',
    owner_screen_name: 'StratsSharon',
    count: TWEET_COUNT // how many tweets to return
  }; 
  // the max_id is passed in via a query string param
/*  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }
*/
  
var renderHomepage = function(req, res, responseBody) {
       res.render('index', {title: 'Your Financial Intel', 
      pageHeader: {
        title: 'Expert',
        strapline: 'Hear what the experts have to say.'
      },
      experts: responseBody
      });
        }

/* GET Expert Info page */
module.exports.expertInfo = function(req,res) {
      res.render('index', {title: 'Your Financial Intel', 
      pageHeader: {
        title: 'Expert',
        strapline: 'Hear what the experts have to say.'
      },
      experts: responseBody
      });
      }



  function checkExists(item, dataArray) {
     var exists = false;
     for (var i = 0;  i < dataArray.length; i++)  {
       if (item.title == dataArray[i].title) {
         return true;
       };
     } ;
  }
/**
   * requests the oEmbed html
   */
  function getOEmbed (req,res, tweet) {

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
      data1.push(tweet);
    
    // console.log(JSON.stringify(tweet));

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == 10) {
          if (data1.length == 20) {
            renderHomepage(req,res,data1);   
            }
       // res.setHeader('Content-Type', 'application/json');
       // res.send(data1);
      // renderHomepage(req,res,data1);
       }
       });
  }

// pass in a string of people where Barry is
// then create a function that captures two for each person that meet a 
// specific criteria.
//page 212
module.exports.homelist = function(req,res) {
  
  google('Barry Ritholtz, Dan Alpert',function(err, response, body) {
  
  gnews = body;  
  console.log(err);
  // console.log(JSON.stringify(body));

  for (var i = 0; i < gnews.length; ++i) {

      if (gnews[i].title != '' && gnews[i].description != '' && gnews[i].link != '') {
      
      exists = checkExists(gnews[i], data1);  
      if (!exists) {
      data1.push( {title: gnews[i].title,
                     description: gnews[i].description,
                     link: gnews[i].link,
                     oEmbed: { html: "News"}}); //end push
     }}} //end if, for
     console.log("Google news: " + gnews.length);
    
     }); //end google


     //Trying again from start
  twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {
    tweets = data;
    
    //console.log(JSON.stringify(tweets));
       // 
      console.log('Error: ' + err); 
     
      var  i = 0, len = tweets.length;
      console.log("Tweets length: " + tweets.length);
 
      for (i; i < len; i++) {
        if (tweets[i].user.screen_name != ' ' && tweets[i].user.screen_name != 'ReutersBiz') {
          getOEmbed(req, res, tweets[i]);
             } } // end if, for
 
   console.log("Data1 length:" + data1.length);

   if (data1.length >= 20) {
        renderHomepage(req,res,data1);  
    // data1 = [] not sure if it needs to be here.
     }
      }); //end twitter

  }; // end homelist export