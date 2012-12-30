  // Used to sync models to the server, it can be overriden to support, for example, HTML5 localStorage
  // Requires two parameters:
  //
  // - a method (fetch, create, update or destroy)
  //
  // - a model or a collection
  //
  // Using the third, optional, parameter you can pass options to it (in that case options for the Ajax call)
  KnockoutApp.Sync = function(method, model, _options){

    // Ensure jQuery is loaded
    if(typeof $ === 'undefined') throw "jQuery is necessary to make Ajax calls";

    var params = {},
        options = _options || {};

    params.dataType = 'json';

    params.error = function(){
      Utils.wrapError(arguments);
    };

    //Get the url of the model/collection (model.url or model.url())
    params.url = Utils.unwrapValue(model, 'url');

    switch(method){
      case 'fetch':
        params.type = 'GET';
        break;
      case 'create':
        params.type = 'POST';
        if(model.name){
          params.data = {};
          params.data[model.name] = model.toJSON();
        }else{
          params.data = model.toJSON();
        }
        break;
      case 'update':
        params.type = 'PUT';
        if(model.name){
          params.data = {};
          params.data[model.name] = model.toJSON();
        }else{
          params.data = model.toJSON();
        }
        break;
      case 'destroy':
        params.type = 'DELETE';
        break;
    }

    // Make and return an Ajax call merging the *options* object passed as the third parameter with the *params* object
    return $.ajax(ko.utils.extend(params, options));
  };
