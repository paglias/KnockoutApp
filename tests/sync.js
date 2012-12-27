module("Sync");

test( "throws an error if jQuery is not loaded", function() {
  var old$ = function(){
    return $;
  }();

  $ = undefined;
  throws(KnockoutApp.Sync);
  $ = old$;
});

