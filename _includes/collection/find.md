<h2 class="page-header">find <small>collection.find( attrs )</small></h2>

Returns the first model that match the passed attributes.

<pre class="prettyprint">
collection.add({
  name: "John",
  gender: "male"
},
{
  name: "Bob",
  gender: "male"
},
);

collection.find({name: "John"}) // -> returns John's model
</pre>

If no match is found returns `false`.