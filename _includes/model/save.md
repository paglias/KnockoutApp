<h2 class="page-header">save <small>model.save( [ options ] )</small></h2>

Save the model on the server using `model.sync`, if the model isNew it will be `created` while in the other case it will be `updated`.

Before saving the model it checks for it to be valid using <a href="#validatemodel.validate()">model.validate</a> and if it isn't it returns `false`.

It accepts an object of option that will be passed to `model.sync`, when using <a href="#SyncKnockoutApp.Sync(method,model,options)">KnockoutApp.Sync</a> these options will be set as params for the ajax call.

If you pass, inside options, a `success` callback it will be executed in addition to the default success callback (that consists, when the model has been created, in setting the id according to the response from the server), if you want to override the default success callback you must override the whole `model.save` method.