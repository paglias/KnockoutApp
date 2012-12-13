/*! Knockout App - v0.1.0 - 2012-12-13
* http://PROJECT_WEBSITE/
* Copyright (c) 2012 Matteo Pagliazzi; Licensed MIT */

(function(){

	// Set a reference to the 'window' object and to KnockoutJS' 'ko' object
	var root = this,			
			ko = root.ko;

	// Ensure KnockoutJS is loaded
	if(typeof ko === 'undefined') throw "knockoutJS must be loaded to use KnockoutApp";

	// Create a namespace
	var KnockoutApp = root.KnockoutApp = {};

	// KnockoutApp's version
	KnockoutApp.VERSION = "0.1.0";
	// An object to store all utils (and also some function that is not reall and helper like the dirtyFlag)
	var Utils = KnockoutApp.Utils = {

		// Check if an object is an observable array
		isObservableArray: function(obj){
			return ko.isObservable(obj) && obj.destroyAll !== undefined;
		},

		// Extend an object (destination) with observable properties with a given one (params).
		// It is used in model constructor to extend the base object with the passed parameters.
		// To extend normal objects use ko.utils.extend
		extendObjKnockout: function(destination, params){
			for(var i in params){
				var param = params[i];
				if(typeof param === "object" && param !== null && destination[i] && !ko.isWriteableObservable(destination[i])) {
					Utils.extendObjKnockout(destination[i], param); //use this.appky???
				}else{
					if(Utils.isObservableArray(destination[i])){
						if(param instanceof Array){
							destination[i](param);
						}else{
							destination[i].push(param);
						}
					}else if(ko.isWriteableObservable(destination[i])){
						destination[i](param);
					}else{
						destination[i] = param;
					}
				}
			}
			return destination;
		},

		// A simple method to extend a 'class' using newClass = Class.extend(), it is based on BackboneJS's one.
		// No parameter can be passed to it, copy instance and static properties.
		// Support __super__ which is a reference to the parent class prototype.
		extendClass: function (protoProps, staticProps) {
			var parent = this,
					ctor = function(){},
					child;

			if (protoProps && protoProps.hasOwnProperty('constructor')) {
				child = protoProps.constructor;
			} else {
				child = function(){ parent.apply(this, arguments); };
			}

			ko.utils.extend(child, parent);

			ctor.prototype = parent.prototype;
			child.prototype = new ctor();

			if (protoProps) ko.utils.extend(child.prototype, protoProps);
			if (staticProps) ko.utils.extend(child, staticProps);

			child.prototype.constructor = child;
			child.__super__ = parent.prototype;

			child.extend = parent.extend;
			return child;
		},

		// Return a value either if a function or a property (model.url or model.url())
		unwrapValue: function(value){
			return typeof value === 'function' ? value() : value;
		},

		// Errors wrapper, for now it simply log in the console everything is passed as a parameter to it ex. wrapError("an error occurred")
		wrapError: function(){
			var args = Array.prototype.slice.call(arguments);
			console.log("Error", args);
		}

	};

	// This is the base Model class in KnockoutApp
	var Model = KnockoutApp.Model = function(attributes, collection){

		// 'id' is an observable property, initially set to 'false'
		this.id = ko.observable(false);

		// The model stores its data inside this object
		this.attributes = {};

		// If an 'attributes' object is passed as a parameter:
		if(attributes){

			// In case it contains an 'id' property set **this.id()** value to it and delete it from the attributes object 
			if(attributes.id){
				this.id(attributes.id);
				delete attributes.id;
			}

			// Merge the attributes passed as parameters with the default attributes stored inside **this.defaultAttributes()**
			//
			// Using **Utils.extendObjKnockout** ensured that observable properties inside *this.defaultAttributes()*
			// are correctly set into *this.attributes*
			this.attributes = Utils.extendObjKnockout(this.defaultAttributes(), attributes);
		}

		// This function allows to be passed, as the second parameter, a reference to a **Collection**.
		// In that case a reference to the collection is set as *this.collection*
		if(collection) this.collection = collection;

		// Detect if the model has been created on the server by checking if the 'id' property is defined
		this.isNew = ko.computed(function(){
			return (this.id() === false) ? true : false;
		}, this);

		// Instead of overriding the function constructor use the initialize function to execute custom code on model creation
		// Knockout's observable properties can't be defined in the class prototype 
		// so this is the perfect place to use them.
		if(this.initialize) this.initialize.apply(this, arguments);

	};

	// Extend Model's prototype
	ko.utils.extend(Model.prototype, {

		// An object with the default attributes for the model 
		// It must be a function because no 'clone' method has been implemented so far, will be fixed in future versions
		// Here you can also use observable properties.
		defaultAttributes: function(){
			return {};
		},

		// Returns the model url on the server using the model's baseUrl or collection's url properties
		url: function(){
			var base = this.baseUrl || this.collection.url;
			if(this.isNew()) return base;
			return base + (base[base.length-1] === '/' ? '' : '/') + this.id();
		},

    // Validation method, should return TRUE if the model is valid
		validate: function(){
			return true;
		},

		// Fetch the model on the server and replace its attributes with the one fetched
		// Options for the Ajax call can be passed as a parameter
		fetch: function(_options){
			var self = this,
					options = {};

			options.succes = function(data){
				delete data.id;
				self.attributes = Utils.extendObjKnockout(self.defaultAttributes(), data);
			};
			
			options.error = function(){
				Utils.wrapError(arguments);
			};

			if(_options) ko.utils.extend(options, _options);

			return (this.sync || (this.collection && this.collection.sync) || KnockoutApp.Sync).call(this, 'fetch', this, options);
		},

		// Save the model on the server.
		// If this.isNew() returns true it will be created, otherwise it will be updated
		// Options for the Ajax call can be passed as a parameter
		save: function(_options){
			if(this.validate() !== true) return false;

			var self = this,
					options = {},
					method = this.isNew() ? 'create' : 'update';

			options.success = function(data){
				if(method === 'create') self.id(data.id);
			};

			options.error = function(){
				Utils.wrapError(arguments);
			};

			if(_options) ko.utils.extend(options, _options);

			return (this.sync || (this.collection && this.collection.sync) || KnockoutApp.Sync).call(this, method, this, options);
		},

		// Destroy the model on the server and remove it from its collection (if exists)
		// Options for the Ajax call can be passed as a parameter
		destroy: function(_options){
			if(this.isNew() && this.collection){
				this.collection.models.remove(this);
			}else if(!this.isNew()){
				var options = {},
						self = this;

				options.success = function(data){
					if(self.collection) self.collection.models.remove(self);
				};

				options.error = function(){
					Utils.wrapError(arguments);
				};

				if(_options) ko.utils.extend(options, _options);
				
				return (this.sync || (this.collection && this.collection.sync) || KnockoutApp.Sync).call(this, 'destroy', this, options);
			}
		},

		// Used for serialization, returns an object that contains model's attributes and its id
		toJSON: function(){
			var obj = ko.toJS(this.attributes);
			obj.id = this.id();
			return obj;
		}
	});

	// A collection stores models in an arrayObservable and provide methods for adding, removing, fetching... models
	var Collection = KnockoutApp.Collection = function(model){

		// A model must be passed to the Collection as the first parameter
		if(!model) throw "A model must be provided for a collection";

		// Set a reference to the model
		this.model = model;

		// Create an array observable to store all the models
		this.models = ko.observableArray();

		// Instead of overriding the function constructor use the initialize function to execute custom code on collection creation
		// Knockout's observable properties can't be defined in the class prototype 
		// so this is the perfect place to use them.
		if(this.initialize) this.initialize.apply(this, arguments);

	};

	// Extend Collection's prototype
	ko.utils.extend(Collection.prototype, {

		// Fetch the models on the server and add them to the collection, this.url must be defined either as a string or a function
		// Options for the Ajax call can be passed as a parameter
		fetch: function(_options){
			var self = this,
					options = {};

			options.success = function(data){
				var toAdd = [];

				for(model in data){
					toAdd.push(data[model]);
				}

				if(toAdd.length > 0) self.add(toAdd);
			};

			options.error = function(){
				Utils.wrapError(arguments);
			};

			if(options) ko.utils.extend(options, _options);

			return (this.sync || KnockoutApp.Sync).call(this, 'fetch', this, options); //return?
		},

		// Add one or more models to collection and optionally create them on the server setting the 'create' parameter to 'true'
		// It will also add a reference to the collection inside each model
		add: function(model_s, create){
			var toAdd = model_s instanceof Array ? model_s : [model_s],
					self = this;

			ko.utils.arrayForEach(toAdd, function(attributes){
				var model = new self.model(attributes, self);
				self.models.push(model);
				if(create) model.save();
			});
		},

		// Remove one or more models from the colection and destroy them on the server
		// It simply calls model.destroy() on each model is passed to it
		remove: function(model_s){
			var toRemove = model_s instanceof Array ? model_s : [model_s];

			ko.utils.arrayForEach(toRemove, function(model){
				model.destroy();
			});
		},

		// Used for serialization, returns an array containing all the models in the collection serialized calling model.toJSON()
		toJSON: function(){
			var result = [];

			ko.utils.arrayForEach(this.models(), function(model){
				result.push(model.toJSON());
			});

			return result;
		}
	});
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
		if(typeof root.$ === 'undefined') throw "jQuery is necessary to make Ajax calls"

		var params = {},
				options = _options || {};

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
		
		// Make and return an Ajax call merging the *options* object passed as the third parameter with the *params* object
		return root.$.ajax(ko.utils.extend(params, options));
	};	
	// Give extensibility to models and collections
	Collection.extend = Model.extend = Utils.extendClass;

}).call(this);