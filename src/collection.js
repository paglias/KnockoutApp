	// A collection stores models in an arrayObservable and provide methods for adding, removing, fetching... models
	var Collection = KnockoutApp.Collection = function(model){

		// If no model is passed to the Collection throw an error
		if(!model) throw "A model must be provided for a collection";

		// Set the model
		this.model = model;

		// An array observable to store all the models
		this.models = ko.observableArray();

		// Instead of overriding the function constructor use the initialize function to execute custom code on collection creation
		if(this.initialize) this.initialize.apply(this, arguments);

	};

	// Extend Collection's prototype
	ko.utils.extend(Collection.prototype, {

		// Fetch the models on the server and add them to the collection, this.url must be defined either as a string or a function
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

		// Add one or more models to collection and optionally create them on the server setting 'create' to 'true'
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