<h2 class="page-header">defaults <small>model.defaults</small></h2>

This object store the default value for model's attributes and it's very important because here you can define `observable properties` that when the model is created will be correctly set in the attribute's object removing the need to redefine them every time:

<pre class="prettyprint">
var Task = KnockoutApp.Model.extend({
  defaults: {
    name: ko.observable("a task"),
    done: ko.observable(false)
  }
});

var myTask = new Task({
  name: "my task",
  done: true
});

// myTask.attributes.name is an observable property:
myTask.attributes.name(); // -> "my task"
</pre>

`defaults` also works with `observable arrays` and standard javascript properties.