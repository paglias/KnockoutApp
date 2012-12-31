$(function() {

  $("#toc").tocify({
  	context: "#content",
  	selectors: "h1, h2, h3",
    //extendPageOffset: $(document).height(), //KEEP OR NOT?
  	scrollTo: "10" //dovrebbe essere solo per width maggiore 967px e anche scrollin generale
  });

  $("#toc").find("li a").text(function(i, text){
  	return text.split(" ")[0];
  });

  prettyPrint();
  window.scroll(0, 1);
});