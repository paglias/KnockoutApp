<h2 class="page-header">extendObjKnockout <small>KnockoutApp.Utils.extendObjKnockout( destination, params )</small></h2>

Extend an object containing observable properties (also observable array).

<pre class="prettyprint">
var original = {
  a: ko.observable("a"),
  b: "b"
}

var extend = {
  a: "a extend",
}

KnockoutApp.Utils.extendObjKnockout(original, extend);

original.a() // -> " a extended"
</pre>

Nested objects are also supported.