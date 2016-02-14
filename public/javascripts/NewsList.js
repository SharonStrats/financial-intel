var app = angular.module('Twitter', ['ngResource', 'ngSanitize','ngRoute']);

/* app.config(function($routeProvider) {

  $routeProvider

   .when('/', {
       templateUrl: 'tweets.html',
       controller: 'TweetList'
   })

   .when('/second', {
       templateUrl: 'second.html',
       controller:  'newsController'
   })

}); */
app.controller('TweetList', function($scope, $resource, $timeout) {

    /**
     * init controller and set defaults
     */
    function init () {

      
      // empty tweet model
      $scope.tweetsResult = [];

      // initiate masonry.js
      //you can play with the columnWidth, blockquote and in the tweets.js
      $scope.msnry = new Masonry('#tweet-list', {
        columnWidth: 360,
        itemSelector: '.tweet-item',
        transitionDuration: 0,
        gutter: 10,
        isFitWidth: true
      });

      // layout masonry.js on widgets.js loaded event
      twttr.events.bind('loaded', function () {
        $scope.msnry.reloadItems();
        $scope.msnry.layout();
      });

      $scope.getTweets();
    }

    /**
     * requests and processes tweet data
     */
    function getTweets (paging) {

      var params = {
       action: 'lists/statuses',
        slug: 'finsite',
        owner_screen_name: 'StratsSharon'
   
      };
   
      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      // create Tweet data resource
         $scope.tweets = $resource('/tweets/lists/statuses/:slug/:owner_screen_name', params);

          
     

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {

        if( angular.isUndefined(paging) ) {
          $scope.tweetsResult = [];
        }

        $scope.tweetsResult = $scope.tweetsResult.concat(res);
        console.log($scope.tweetsResult);
        //$scope.tweetsResult.filter(tweetsResult, 
        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);
      });
    }

    /**
     * binded to @user input form
     */
    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    }

    /**
     * binded to 'Get More Tweets' button
     */
    $scope.getMoreTweets = function () {
      getTweets(true);
    }

    init();
});

// Second controller for the newsController
app.controller('newsController', ['$scope', '$log', '$routeParams', function($scope, $log, $routeParams) {
    
    $scope.num = $routeParams.num || 1;
    
}]);