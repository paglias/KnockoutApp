(function(){

  // Set a reference to the 'window' object and to KnockoutJS' 'ko' object
  var root = this,      
      ko = root.ko;

  // Ensure KnockoutJS is loaded
  if(typeof ko === 'undefined') throw "knockoutJS must be loaded to use KnockoutApp";

  // Create a namespace
  var KnockoutApp = root.KnockoutApp = {};

  // KnockoutApp's version
  KnockoutApp.VERSION = "0.2.0";
  