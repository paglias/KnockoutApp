<h2 class="page-header">attributes <small>model.attributes</small></h2>

Model's attributes are stored in a plain javascript object:

<pre class="prettyprint">
var model = new KnockoutApp.Model({
  attr1: "an attribute"
});

model.attributes.attr1; // "an attribute"
</pre>