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

		// A reference to KnockoutApp.Sync and overridable
		sync: KnockoutApp.Sync,

		// Fetch the models on the server and add them to the collection, this.url must be defined either as a string or a function
		// Options for the Ajax call can be passed as a parameter
		fetch: function(_options){
			var self = this,
					options = {};

			options.success = function(data){
				var toAdd = [];

				for(var model in data){
					toAdd.push(data[model]);
				}

				if(toAdd.length > 0) self.add(toAdd);
			};

			options.error = function(){
				Utils.wrapError(arguments);
			};

			if(options) ko.utils.extend(options, _options);

			return this.sync.call(this, 'fetch', this, options);
		},

		// Add one or more models to collection and optionally create them on the server setting the 'create' parameter to 'true'
		// It will also add a reference to the collection inside each model
		add: function(model_s, create){
			var toAdd = model_s instanceof Array ? model_s : [model_s],
					self = this;

			ko.utils.arrayForEach(toAdd, function(attributes){
				var model;
				if(attributes instanceof Model){
					model = attributes;
				}else{
					model = new self.model(attributes, self);
				}
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