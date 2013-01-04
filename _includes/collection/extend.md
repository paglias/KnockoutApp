<h2 class="page-header">extend <small>KnockoutApp.Collection.extend( [ prototype properties, class properties] )</small></h2>

Like a model, a collection can be extended to add or to modify any of its properties or methods:

<pre class="prettyprint">
var MyCollection = KnockoutApp.Collection.extend({
  prototypeProperty: "prototype property"
},{
  classProperty: "class property"
});

MyCollection.classProperty // -> "class property"

var collection = new MyCollection();

collection.prototypeProperty // -> "prototype property"
</pre>

For more info about extending classes see <a href="#extendClassKnockoutApp.Utils.extendClass(prototypeproperties,classproperties)">Utils.extendClass</a>