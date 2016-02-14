var google = require('google');

var renderHomepage = function(req, res, responseBody) {
       res.render('second', {title: 'News', 
      pageHeader: {
        title: 'Expert',
        strapline: 'Hear what the experts have to say.'
      },
      experts: responseBody
  });
}
/* GET Expert Info page */
module.exports.expertInfo = function(req,res) {
     res.render('index', {title: 'Your Financial Intel'});

};
// pass in a string of people where Barry is
// then create a function that captures two for each person that meet a 
// specific criteria.
//page 212
module.exports.homelist = function(req,res) {
   google('Barry Ritholtz 2/13/2016',function(err, response, body) {
    var data = [];
    for (var i = 0; i < body.length; ++i) {
      if (body[i].title != '' && body[i].description != '' && body[i].link != '')
       data.push(body[i])
     }
   renderHomepage(req,res,data);
   }
   );

};