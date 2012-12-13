	// A model
	var Model = KnockoutApp.Model = function(attributes, collection){

		// Define an id property
		this.id = ko.observable(false);

		// An object to store model's attributes
		this.attributes = {};

		if(attributes){

			// If an 'id' property is passed to the Model, use it
			if(attributes.id){
				this.id(attributes.id);
				delete attributes.id;
			}

			// Merge the attributes passed to the Model with the default attributes and sets them in the Model
			this.attributes = Utils.extendObjKnockout(this.defaultAttributes(), attributes);
		}

		// If the model is inside a collection, add a reference to it
		if(collection) this.collection = collection;

		// Detect if the model has been created on the server by checking if the 'id' property is defined
		this.isNew = ko.computed(function(){
			return (this.id() === false) ? true : false;
		}, this);

		// Instead of overriding the function constructor use the initialize function to execute custom code on model creation
		if(this.initialize) this.initialize.apply(this, arguments);

	};

	// Extend Model's prototype
	ko.utils.extend(Model.prototype, {

		// An object with the default attributes for the model 
		// It must be a function because no 'clone' method has been implemented so far, will be fixed in future versions
		defaultAttributes: function(){
			return {};
		},

		// Returns the model url on the server using the model's baseUrl or collection's url properties
		url: function(){
			var base = this.baseUrl || this.collection.url;
			if(this.isNew()) return base;
			return base + (base[base.length-1] === '/' ? '' : '/') + this.id();
		},

    // Validation method, should return TRUE if the model is validated
		validate: function(){
			return true;
		},

		// Fetch the model on the server and replace its attributes with the one fetched
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
		// It will be created if the 'id' property is not defined, otherwise it will be updated
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

		// Destroy the model on the server and remove it from its collection (if present)
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
