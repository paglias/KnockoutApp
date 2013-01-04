<h2 class="page-header">name <small>model.name</small></h2>

If defined, when syncing the model with the server, the data will be wrapped in an object which name is `model.name`.

It's useful, for example, when using **Ruby On Rails** that expect the data to be wrapped in a parameter which name is model's name.

<pre class="prettyprint">

var Task = KnockoutApp.Model.extend({
  defaults: {
    name: ko.observable("a task"),
    done: ko.observable(false)
  },
  name: "tasks"
});

var task = new Task({
  id: 1
});

task.save();
</pre>

The server will receive this data:

<pre class="prettyprint">
task: {
  id: 1,
  name: "a task",
  done: true
}
</pre>