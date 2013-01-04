<h2 class="page-header">model <small>collection.model</small></h2>

A reference to the model class defined in the prototype. It is used, for example, when <a href="#addcollection.add(model_s,[create,options])">adding</a> a model to the collection.

<pre class="prettyprint">
var Taskslist = KnockoutApp.Collection.extend({
  model: Task
});

var taskslist = new TasksList();

// taskslist.model === Task
</pre>