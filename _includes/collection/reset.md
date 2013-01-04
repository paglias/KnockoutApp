<h2 class="page-header">reset <small>collection.reset()</small></h2>

Empties a collection by removing all the models stored inside `collection.models` and remove from all the models the reference to the collection.

<pre class="prettyprint">
var collection = new knockoutApp.Collection();

model1 = new KnockoutApp.Model();

collection.add(model1);

collection.models().length; // 1 (the number of items in collection.models())

model1.collection === collection;

collection.reset();

collection.models().length; // 0

model1.collection === undefined;
</pre>