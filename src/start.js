(function(){

	// Set a reference to the 'window' object and to KnockoutJS
	var root = this,			
			ko = root.ko;

	// Knockout.js must be loaded
	if(typeof ko === 'undefined') throw "knockoutJS is not loaded";

	// Define a namespace
	var KnockoutApp = root.KnockoutApp = {};

	// KnockoutApp's version
	KnockoutApp.VERSION = "0.1.0";