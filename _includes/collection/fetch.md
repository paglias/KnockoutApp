<h2 class="page-header">fetch <small>collection.fetch( [ options ] )</small></h2>

Fetches the collection's models on the server using `collection.sync` and replace the current models store in `collection.models` with the one fetched.

It accepts an object of option that will be passed to `collection.sync`, when using <a href="#SyncKnockoutApp.Sync(method,model,options)">KnockoutApp.Sync</a> these options will be set as params for the ajax call.

If you pass, inside options, a `success` callback it will be executed in addition to the default success callback (that consists in updating `collection.models` with the models returned from the server), if you want to override the default success callback you must override the whole `collection.fetch` method.

The model are added to the collection using <a href="#addcollection.add(model_s,[create,options])">collection.add</a>, before adding the new models to the collection it is resetted using <a href="#resetcollection.reset()">collection.reset</a>.