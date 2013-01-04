<h2 class="page-header">toJSON <small>model.toJSON()</small></h2>

Despite what the name may suggests it is used to serialize the model's attributes and [idAttribute](#idAttributemodel.idAttribute).

<pre class="prettyprint">
var Task = KnockoutApp.Model.extend({
  defaults: {
    name: ko.observable("a task"),
    done: ko.observable(false)
  }
});

var task = new Task({
  name: "task to serialize",
  done: true,
  id: 1
});

task.toJSON();
</pre>

Produces:

<pre class="prettyprint">
{
  id: 1,
  name: "task to serialize",
  done: true
}
</pre>