<h2 class="page-header">url <small>collection.url</small></h2>

The url property used by the collection and all the models inside it (unless in a model you defined `model.baseUrl`), by default it's left undefined.

<pre class="prettyprint">
var Collection = KnockoutApp.Collection.extend({
  url: "/collection"
});
</pre>