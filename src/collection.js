  // ## KnockoutApp.Collection
  // A collection stores models in an arrayObservable and provide methods to modify it
  var Collection = KnockoutApp.Collection = function(model_s){

    // Create an array observable to store all the models
    this.models = ko.observableArray();

    // If any model is passed to the constructor, add it
    if(model_s) this.add(model_s);

    // Instead of overriding the function constructor use the initialize function to execute custom code on model creation
    // Knockout's observable properties can't be defined as prototype properties
    // so this is the perfect place to define them
    if(this.initialize) this.initialize.apply(this, arguments);

  };

  // Extend Collection's prototype
  ko.utils.extend(Collection.prototype, {

    // A reference to the model class, by default *KnockoutApp.Model*
    model: Model,

    // by default uses KnockoutApp.Sync as sync method, can be overriden
    sync: function(){
      return KnockoutApp.Sync.apply(this, arguments);
    },

    // Add one or more models to collection and optionally create them on the server setting the 'create' parameter to 'true'
    // It will also add a reference to the collection on each model
    add: function(model_s, create, options){
      var toAdd = model_s instanceof Array ? model_s : [model_s],
          self = this;

      ko.utils.arrayForEach(toAdd, function(attributes){
        var model;
        if(attributes instanceof Model){
          model = attributes;
          model.collection = self;
        }else{
          model = new self.model(attributes, {collection: self});
        }
        self.models.push(model);
        if(create) model.save(options);
      });
    },

    // Empty the collection by removing all it's models and the reference to the collection from them
    reset: function(){
      ko.utils.arrayForEach(this.models(), function(model){
        model.collection = undefined;
      });

      this.models([]);
    },

    // Fetch models from server and add them to the collection.
    // Options for the sync method can be passed as an object
    fetch: function(_options){
      var self = this, //collection
          options = _options || {},
          success = options.success; //custom success function passed in _options

      options.success = function(data){
        var toAdd = [];

        for(var model in data){
          toAdd.push(data[model]);
        }

        self.reset(); //reset the collection
        if(toAdd.length > 0) self.add(toAdd);
        if(success) success(self, data);
      };

      return this.sync.call(this, 'fetch', this, options);
    },

    // Remove one or more models from the colection and destroy them on the server if saved
    // It simply calls model.destroy() on each model is passed to it
    // Options for the sync method can be passed as an object
    remove: function(model_s, options){
      var toRemove = model_s instanceof Array ? model_s : [model_s];

      ko.utils.arrayForEach(toRemove, function(model){
        model.destroy(options);
      });
    },

    // Find a model in the collection, either an object of attributes or the model.id() value can be passed to it
    // *collection.find(1)* or *collection.find({attr1: "value", attr2: "value"})*
    find: function(attrs){
      if(!attrs) return false;

      return ko.utils.arrayFirst(this.models(), function(model){
        if(typeof attrs !== 'object'){
          if(model.id() === attrs) return true;
          return false;
        }

        var result = true;
        for(var attr in attrs){
          if(ko.utils.unwrapObservable(model.attributes[attr]) !== attrs[attr]){
            result = false;
            break;
          }
        }
        return result;
      });
    },

    // Returns an array of models which attributes match the one passed as parameter
    // *collection.where({attr1: "value", attr2: "value"})*
    where: function(attrs){
      if(!attrs) return [];
      return ko.utils.arrayFilter(this.models(), function(model){
        var result = true;

        for(var attr in attrs){
          if(model.idAttribute === attr && model.id() !== attrs[attr]){ //don't know if it should work with id...
            result = false;
            break;
          }

          if(ko.utils.unwrapObservable(model.attributes[attr]) !== attrs[attr]){
            result = false;
            break;
          }
        }

        return result;
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
