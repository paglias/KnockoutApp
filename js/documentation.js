$(function() {

  $("#toc").tocify({
  	context: "#documentation",
  	selectors: "h1, h2, h3",
  	scrollTo: "50" //dovrebbe essere solo per width maggiore 967px
  });

  $("#toc").find("li a").text(function(i, text){
  	return text.split(" ")[0];
  });

  prettyPrint();
});