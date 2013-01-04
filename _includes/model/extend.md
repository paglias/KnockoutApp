<h2 class="page-header">extend <small>KnockoutApp.Model.extend( [ prototype properties, class properties] )</small></h2>

A model can be extended to add or to modify any of its properties or methods:

<pre class="prettyprint">
var MyModel = KnockoutApp.Model.extend({
  prototypeProperty: "prototype property"
},{
  classProperty: "class property"
});

MyModel.classProperty // -> "class property"

var modelInstance = new MyModel();

modelInstance.prototypeProperty // -> "prototype property"
</pre>

For more info about extending classes see <a href="#extendClassKnockoutApp.Utils.extendClass(prototypeproperties,classproperties)">Utils.extendClass</a>