<h2 class="page-header">unwrapValue <small>KnockoutApp.Utils.unwrapValue( object, value )</small></h2>

Return the value (first parameter) in the object (second parameter) if it's a property, invoke it if it's a function.

<pre class="prettyprint">
var obj = {
  url: function(){return "url!"};
}

KnockoutApp.Utils.unwrapValue(obj, url); // -> "url!"

obj.url = "url! string!";

KnockoutApp.Utils.unwrapValue(obj, url) // "url! string!"
</pre>