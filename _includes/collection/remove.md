<h2 class="page-header">remove <small>collection.remove( model_s, [ options ] )</small></h2>

Remove on or more models from the collection by calling <a href="#destroymodel.destroy([options])">model.destroy</a> on each model passed to this method.

Accepts also an array of models.

<pre class="prettyprint">
var collection = new KnockoutApp.Collection();

var model1 = new KnockoutApp.Model({id: 1});
var model2 = new KnockoutApp.Model({id: 1});

collection.add([model1, model2]);

collection.remove([model1, model2]);
</pre>

As the second parameter you can pass options for <a href="#destroymodel.destroy([options])">model.destroy</a>.