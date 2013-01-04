<h2 class="page-header">constructor/initialize <small>new KnockoutApp.Collection()</small></h2>

Creating a new collection simply set up an observable array to store the models.

If you define a `initialize` function in the class' prototype it will be executed when collection is created:

<pre class="prettyprint">
var MyCollection = KnockoutApp.Collection.extend({
  initialize: function(){
    console.log("initialized");
  }
});

new Collection(); // "initialized" will be logged in the console
</pre>

You can access the parameters passed to the collection in `initialize` and inside it `this` refers to the collection itself.