<h2 class="page-header">fetch <small>model.fetch( [ options ] )</small></h2>

Fetches the model on the server using `model.sync` and replace the model's attributes with the ones returned from the server.

It accepts an object of option that will be passed to `model.sync`, when using <a href="#SyncKnockoutApp.Sync(method,model,options)">KnockoutApp.Sync</a> these options will be set as params for the ajax call.

If you pass, inside options, a `success` callback it will be executed in addition to the default success callback (that consists in setting the attributes returned from the server in the model), if you want to override the default success callback you must override the whole `model.fetch` method.