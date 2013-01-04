<h1 class="page-header">Sync <small>KnockoutApp.Sync( method, model, options )</small></h1>

This is the method used by KnockoutApp for communicating with the server, it uses jQuery's `$.ajax` to make ajax calls.

It accepts three parameters:

- **model**: the **model** or the **collecion** that made the request

- **method**: can be **fetch**, **create**, **update** or **destroy**

- **options**: this one is optional, you can pass an object of options that will be passed to `$.ajax`

If the model is contained into a collection then it uses collection's sync method while if it isn't <a href="#SyncKnockoutApp.Sync(method,model,options)">KnockoutApp.Sync</a> is used.

To use a custom method, you can override globally `KnockoutApp.Sync` or only for a specific model or collection respectively `model.sync` or `collection.sync`.