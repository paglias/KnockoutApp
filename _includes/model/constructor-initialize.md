<h2 class="page-header">constructor/initialize <small>new KnockoutApp.Model( attributes, [ options ] )</small></h2>

When creating a new model you can its [attributes](#attributesmodel.attributes):

<pre class="prettyprint">
new MyModel({
  attr1: "the first attribute"
});
</pre>

The second parameter is used to pass options to the model, as of now the only option you can set is a reference to a collection:

<pre class="prettyprint">
new KnockoutApp.Model({
  //attributes
}{
  collection: MyCollection
});
</pre>

This way a reference to `MyCollection` will be set in [model.collection](#collectionmodel.collection).

If you define a `initialize` function in the class' prototype it will be executed when model is created:

<pre class="prettyprint">
var MyModel = KnockoutApp.Model.extend({
  initialize: function(attributes, options){
    console.log("initialized");
  }
});

new MyModel(); // "initialized" will be logged in the console
</pre>

You can access the parameters passed to the model in `initialize` and inside it `this` refers to the model itself.