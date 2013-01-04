<h2 class="page-header">toJSON <small>collection.toJSON()</small></h2>

Like <a href="#toJSONmodel.toJSON()">model.toJSON()</a> it is used for serialization.

It calls `model.toJSON()` on each model in the collection and puts the result in an array that is then returned.


<pre class="prettyprint">
var collection = new KnockoutApp.Collection();

collection.add({
  id: 1,
  attr1: "model 1"
},{
  attr1: "model 2"
});

collection.toJSON();
</pre>

Produces:

<pre class="prettyprint">
[{
  id: 1,
  attr1: "model 1"
}, {
  attr1: "model 2"
}]
</pre>