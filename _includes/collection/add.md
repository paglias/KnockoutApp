<h2 class="page-header">add <small>collection.add( model_s, [ create, options ] )</small></h2>

Add on or more models to the collection, you can add a model by passing to this method either model's attributes or directly the model.

Multiple models can be added passing an array.

<pre class="prettyprint">
collection.add([{
  number: 1
},{
  number: 2
},{
  number: 3
}]);

var model4 = new KnockoutApp.Model({
  number: 4;
});

var model5 = new KnockoutApp.Model({
  number: 5;
});

collection.add([model4, model5]);
</pre>

On every model created using this method will be set a reference to the collection, accessible at `model.collection`.

If you pass `true` as the second parameter then after adding a model to the collection it will be called <a href="#savemodel.save([options])">model.save</a> and the model will be created/updated using <a href="#syncmodel.sync(model,method,options)">model.sync</a>, you can pass option for <a href="#savemodel.save([options])">model.save</a> in the third parameter.