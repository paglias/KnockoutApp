<h2 class="page-header">where <small>collection.where( attrs )</small></h2>

Returns an array of models that match the passed attributes.

<pre class="prettyprint">
collection.add({
  name: "John",
  gender: "male"
},
{
  name: "Bob",
  gender: "male"
},
{
  name: "Ann",
  gender: "female"
});

collection.where({gender: "male"}) // -> returns Bob's and John's model
</pre>

If no match is found returns an empty array.