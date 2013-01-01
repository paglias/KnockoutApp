// Set up KnockoutApp appropriately for the environment
(function(root, factory) {
  // **Node/CommonJS**
  if (typeof exports !== 'undefined') {
    // This is intended for use with [browserify](https://github.com/substack/node-browserify) or similar tools
    factory(exports, require('knockout'), require('jquery'));

  // **AMD**
  } else if (typeof define === 'function' && define.amd) {
    define(['exports', 'knockout', 'jquery'], function(exports, ko, $){
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global KnockoutApp
      //
      // This allow for non-amd modules to work
      root.KnockoutApp = factory(exports, ko, $);
    });

  // **Browser global**
  } else {
    root.KnockoutApp = factory({}, root.ko, root.jQuery);
  }
})(this, function(KnockoutApp, ko, $){ // this === window in browser

  // Check that KnockoutJS is loaded
  if(typeof ko === 'undefined') throw "KnockoutJS must be loaded to use KnockoutApp";

  // KnockoutApp's version, set by Grunt when KnockoutApp is built, the value is taken by *package.json*
  KnockoutApp.VERSION = "<%= pkg.version %>";
