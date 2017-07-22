var $ = require('jquery');
var imagesLoaded = require('imagesloaded');
var jQueryBridget = require('jquery-bridget');
var Isotope = require('isotope-layout');
// make Isotope a jQuery plugin
jQueryBridget( 'isotope', Isotope, $ );
// now you can use $().isotope()
   $(window).on('load', function() {
$('.grid').isotope({
   layoutMode: 'masonry',
  itemSelector: '.grid-item',
  masonry: {
    columnWidth: 320,
    gutterWidth: 5

  }
});
$grid.imagesLoaded().always( function() {
  $grid.isotope('reLayout');
});
});

    /*  Old one
   $(document).ready(function() {
    var imgLoad = imagesLoaded('#test');
    imgLoad.on( 'always', function() {
    console.log( imgLoad.images.length + ' images loaded' );
  // detect which image is broken
  for ( var i = 0, len = imgLoad.images.length; i < len; i++ ) {
    var image = imgLoad.images[i];
    var result = image.isLoaded ? 'loaded' : 'broken';
    console.log( 'image is ' + result + ' for ' + image.img.src );
  }
});
*/
/*
function getItem(expert) {
  var item = '<div>';

  return item;
}
function getItems() {
  var items = ' ';
  experts.forEach(getItem(expert)) 
  
  // return a jQuery object
  return $(item);
}
 
 getItems(); */
/*   masonry: {
    columnWidth: '.grid-sizer',
    fitWidth: true
  } */
