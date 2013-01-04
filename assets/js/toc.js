$(function() {

  $("#toc").tocify({
    context: "#content",
    selectors: "h1, h2, h3",
    scrollTo: "0" //dovrebbe essere solo per width maggiore 967px e anche scrollin generale
  });

  $("#toc").find("li a").text(function(i, text){
    if(text === "Getting started"){
      return text;
    }else{
      return text.split(" ")[0];
    }
  });

  $("#toc ul").eq(2).after('<span class="nav-header">Documentation</span>');
  $("#toc ul").eq(8).after('<span class="nav-header">More</span>');

  prettyPrint();

  //add divider
});