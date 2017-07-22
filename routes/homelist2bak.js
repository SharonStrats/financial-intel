// pass in a string of people where Barry is
// then create a function that captures two for each person that meet a 
// specific criteria.
//page 212
module.exports.homelist2 = function(req,res) {
  

  google('Barry Ritholtz, Dan Alpert',function(err, response, body) {
  
  gnews = body;  
  console.log(err);
  // console.log(JSON.stringify(body));

  for (var i = 0; i < gnews.length; ++i) {

      if (gnews[i].title != '' && gnews[i].description != '' && gnews[i].link != '') {
      
      exists = checkExists(gnews[i], data1);  
      if (!exists) {
        var htmlNews = '<div class=\"grid-item\"> <h5>' + gnews[i].title + '</h5>' +
          gnews[i].description +  '<a class=\"links\" href=' + gnews[i].link +  '>More Details<\/a></div>';
      data1.push( {title: gnews[i].title,
                     description: gnews[i].description,
                     link: gnews[i].link,
                     oEmbed: { html: 'News'}}); //end push
     }}} //end if, for
     console.log("Google news: " + gnews.length);
         console.log("Data1: " + data1.length);
    //renderHomepage(req,res,data1); 
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
 
   if (tweets.length >= 25) {
        console.log('Working.... ');
        renderHomepage(req,res,data1);  
    // data1 = [] not sure if it needs to be here.
     } 
      }); //end twitter  

  }; // end homelist export