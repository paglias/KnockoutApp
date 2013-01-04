<h2 class="page-header">destroy <small>model.destroy( [ options ] )</small></h2>

If the model is saved on the server, delete it using `model.sync`.

If it's stored in a collection, remove it from the collection.

It accepts an object of option that will be passed to `model.sync`, when using <a href="#SyncKnockoutApp.Sync(method,model,options)">KnockoutApp.Sync</a> these options will be set as params for the ajax call.

If you pass, inside options, a `success` callback it will be executed in addition to the default success callback (that consists, when the model has been created, in setting the id according to the response from the server), if you want to override the default success callback you must override the whole `model.destroy` method.

If you set `wait: true` in the options then it will wait for the server response before removing the model from the collection.

If the model isn't saved on the server it returns *false*.