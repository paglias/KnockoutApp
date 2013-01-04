<h2 class="page-header">collection <small>model.collection</small></h2>

If the model is contained into a collection it stores a reference to the collection.

<pre class="prettyprint">
var collection = new KnockoutApp.Collection();

var model = new KnockotuApp.Model({
  id: "1",
  name: "one model"
});

collection.add(model);

// model.collection === collection
</pre>