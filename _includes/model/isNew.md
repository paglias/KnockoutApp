<h2 class="page-header">isNew <small>model.isNew()</small></h2>

A computed observable that re-evaluate itself every time the value of `model.id` changes and return `true` if `model.id` is `false`, `false` in any other case.

Useful to detect if the model exists on the server.

<pre class="prettyprint">
var model = new KnockoutApp.Model({id: "1"});

model.isNew(); // -> false, id is set

model = new KnockoutApp.Model();

model.isNew(); // -> true, id isn't set

model.save();

model.isNew(); // -> false, the model has been saved on the server and id has been set
</pre>