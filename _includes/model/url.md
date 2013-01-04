<h2 class="page-header">url <small>model.url()</small></h2>

Returns the model's url that is used to make ajax calls based on the value of `model.baseUrl` (by default not defined) or, if it isn't defined and the model is contained into a collection, on `model.collection.url`'s value, if both of them are undefined it throws an error.

Can be overriden with a custom method/value.

<pre class="prettyprint">
model = new KnockoutApp.Model({
  baseUrl: "/models"
});

model.url(); // -> "/models"

model.id(1);

model.url(); // -> "/models/1"

var coll = new KnockoutApp.Collection();
coll.url = "/collection";

var model.baseUrl = undefined;

coll.add(model);

model.url(); // -> "/collection/1"
</pre>

