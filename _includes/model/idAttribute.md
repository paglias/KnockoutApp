<h2 class="page-header">idAttribute <small>model.idAttribute</small></h2>

The model's attribute used for <a href="#idmodel.id([newvalue])">model.id</a>, by default it is `id`, but can be set to everything else.

This is useful when the server provide the model's `id` field under another name like `_id` when using **MongoDB**:

It can be set passing the idAttribute fields with the attributes object when creating the model:

<pre class="prettyprint">
var Model = KnockoutApp.Model.extend({
  idAttribute: "_id"
});

var model = new model({
  _id: "123"
});

model.id(); // "123"
</pre>