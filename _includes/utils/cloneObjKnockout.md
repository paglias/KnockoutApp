<h2 class="page-header">cloneObjKnockout <small>KnockoutApp.Utils.cloneObjKnockout( obj )</small></h2>

Clone an object containing observable properties.

<pre class="prettyprint">
var obj = {
  a: ko.observable("a");
};

var cloned = KnockoutApp.Utils.cloneObjKnockout(obj);

cloned.a("cloned a");
obj.a() // "a"
</pre>