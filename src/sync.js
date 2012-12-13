	// Used to sync models to the server, it can be overriden to support, for example, HTML5 localStorage
	// Require a method (fetch, create, update, destroy)and  a model (or a collection)
	// The third parameter is used to pass options to id
	KnockoutApp.Sync = function(method, model, options){

		// Throw an error if jQuery is not loaded
		if(typeof root.$ === 'undefined') throw "jQuery is necessary to make Ajax calls"

		var params = {};
		param.dataType = 'json';

		//Get the url of the model/collection (model.url or model.url())
		params.url = Utils.unwrapValue(model.url);
		
		switch(method){
			case 'fetch':
				params.type = 'GET';
				break;
			case 'create':
				params.type = 'POST';
				if(model.modelName){
					params.data = {};
					params.data[model.modelName] = model.toJSON();
				}else{
					params.data = model.toJSON();
				}
				break;
			case 'update':
				params.type = 'PUT';
				if(model.modelName){
					params.data = {};
					params.data[model.modelName] = model.toJSON();
				}else{
					params.data = model.toJSON();
				}
				break;
			case 'destroy':
				params.type = 'DELETE';
				break;
		}
		
		// Returns an Ajax call using jQuery
		return root.$.ajax(ko.utils.extend(params, options));
	};	