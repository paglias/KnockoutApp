/*! Knockout App - v0.2.2 - 2013-02-10
* https://github.com/paglias/KnockoutApp
* Copyright (c) 2013 Matteo Pagliazzi; Licensed MIT */

// Set up KnockoutApp appropriately for the environment
(function(root, factory) {
  // **Node/CommonJS**
  if (typeof exports !== 'undefined') {
    // This is intended for use with [browserify](https://github.com/substack/node-browserify) or similar tools
    var target;
    if(typeof module !== undefined){
      target = module.exports;
    }else{
      target = exports;
    }

    factory(target, require('knockout'), require('jquery'));

  // **AMD**
  } else if (typeof define === 'function' && define.amd) {
    define(['exports', 'knockout', 'jquery'], function(exports, ko, $){
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global KnockoutApp
      //
      // This allow for non-amd modules to work
      root.KnockoutApp = factory(exports, ko, $);
    });

  // **Browser global**
  } else {
    root.KnockoutApp = factory({}, root.ko, root.jQuery);
  }
})(this, function(KnockoutApp, ko, $){ // this === window in browser

  // Check that KnockoutJS is loaded
  if(typeof ko === 'undefined') throw "KnockoutJS must be loaded to use KnockoutApp";

  // KnockoutApp's version, set by Grunt when KnockoutApp is built, the value is taken by *package.json*
  KnockoutApp.VERSION = "0.2.2";

  // ## KnockoutApp.Utils
  // An object that stores all utils methods used by KnockoutApp
  var Utils = KnockoutApp.Utils = {

    // Check if an object is an observable array
    isObservableArray: function(obj){
      return ko.isObservable(obj) && obj.destroyAll !== undefined;
    },

    // Extend an object (destination) with observable properties with a given one (params)
    // It is used in model constructor to extend the base object with the passed parameters
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

    // Used to clone an object with Knockout observable properties
    cloneObjKnockout: function(obj){
      if(ko.isWriteableObservable(obj)) return ko.observable(obj());
      if(obj === null || typeof obj !== 'object') return obj;

      var temp = obj.constructor();
      for (var key in obj) {
        temp[key] = Utils.cloneObjKnockout(obj[key]);
      }

      return temp;
    },

    // A simple method to extend a 'class' using newClass = Class.extend(), it is based on BackboneJS's one
    // No parameter can be passed to it, copy instance and static properties
    // Support __super__ which is a reference to the parent class prototype
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

      return child;
    },

    // Return the value provided either if it's a function or a property (model.url or model.url())
    // The first parameter is the object where the value is contained, the second one is the value itself
    // After various attemps to make this working I've decided to adopt Underscore's *result* method.
    unwrapValue: function(object, property){
      if (object === null) return null;
      var value = object[property];
      return typeof value === 'function' ? value.call(object) : value;
    }

  };

  // ## KnockoutApp.Model
  // Define the Model class
  var Model = KnockoutApp.Model = function(attributes, options){

    // *id* is an observable property, initially set to *false*
    this.id = ko.observable(false);

    // An object for storing model's attributes
    this.attributes = {};

    // If an *attributes* object is passed as a parameter:
    if(attributes){

      // In case it contains the *idAttribute* property set *this.id()* value to it and delete it from the attributes object
      if(attributes[this.idAttribute]){
        this.id(attributes[this.idAttribute]);
        delete attributes[this.idAttribute];
      }

      // Merge the attributes passed as parameters with the default attributes set in *this.defaults*
      //
      // *Utils.cloneObjKnockout* is used to clone an object containing observable properties
      //
      // *Utils.extendObjKnockout* ensures that observable properties inside *this.defaults*
      // are correctly set into *this.attributes*
      var defaults = Utils.cloneObjKnockout(this.defaults);
      this.attributes = Utils.extendObjKnockout(defaults, attributes);
    }

    // If *options.collection* has been passed as a prameter set *this.collection* to *options.collection*
    if(options && options.collection) this.collection = options.collection;

    // Detect if the model has been created on the server by checking if the 'id' property is set
    this.isNew = ko.computed(function(){
      return (this.id() === false) ? true : false;
    }, this);

    // Instead of overriding the function constructor use the initialize function to execute custom code on model creation
    // Knockout's observable properties can't be defined as prototype properties
    // so this is the perfect place to define them
    if(this.initialize) this.initialize.apply(this, arguments);

  };

  // Extend Model's prototype
  ko.utils.extend(Model.prototype, {

    // An object with the default attributes for the model
    // Model's observable attributes  must be defined here
    defaults: {},

    // The property used as model's id, by default *id*
    // It can be set to something different if the server use a different value for the id (for example when using MongoDB you may set it to *_id*)
    idAttribute: 'id',

    // Model's sync method: uses Collection's sync method if the model is stored in a collection, if it isn't use KnockoutApp.Sync
    // Can be overriden with a custom method
    sync: function(){
      return ((this.collection && this.collection.sync) || KnockoutApp.Sync).apply(this, arguments);
    },

    // Returns the model url using model's baseUrl or collection's url properties. If they're both undefined, throw an error
    // If model.id() is set add model.id() to the url
    url: function(){
      var base = Utils.unwrapValue(this, 'baseUrl') || (this.collection && Utils.unwrapValue(this.collection, 'url'));
      if(typeof base === undefined) throw "Missing baseUrl or collection.url properties";
      if(this.isNew()) return base;
      return base + (base[base.length-1] === '/' ? '' : '/') + this.id();
    },

    // Validation method, should return TRUE if the model is valid, something else like an error message if it isn't
    validate: function(){
      return true;
    },

    // Fetch the model on the server and replace its attributes with the one fetched
    // Options for the sync method can be passed as an object
    fetch: function(_options){
      var self = this, //model
          options = _options || {},
          success = options.success; //custom success function passed in _options

      options.success = function(data){
        delete data[self.idAttribute];
        var defaults = Utils.cloneObjKnockout(self.defaults);
        self.attributes = Utils.extendObjKnockout(defaults, data);
        if(success) success(self, data);
      };

      return this.sync.call(this, 'fetch', this, options);
    },

    // Save the model on the server
    // If model.isNew() returns true the model will be created, otherwise it will be updated
    // Options for the sync method can be passed as an object
    save: function(_options){
      if(this.validate() !== true) return false;

      var self = this, //model
          options = _options || {},
          success = options.success, //custom success function passed in _options
          method = this.isNew() ? 'create' : 'update';

      options.success = function(data){
        if(method === 'create') self.id(data[self.idAttribute]);
        if(success) success(self, data);
      };

      return this.sync.call(this, method, this, options);
    },

    // Destroy the model on the server and remove it from its collection (if exists)
    // Options for the sync method can be passed as an object
    // If you set *wait: true* in the options' object it will remove the model from the collection without waiting for the server response
    destroy: function(_options){
      var self = this, //model
          options = _options || {},
          success = options.success; //custom success function passed in _options

      options.success = function(){
        if(self.collection){
          self.collection.models.remove(self);
          delete self.collection;
        }
        if(success) success(self, data);
      };

      if(this.isNew()){
        options.success();
        return false;
      }

      var xhr = this.sync.call(this, 'destroy', this, options);

      if(!options.wait){
        options.success();
        delete options.success;
      }

      return xhr;
    },

    // Used for serialization, returns an object that contains model's attributes and its idAttribute if set
    toJSON: function(){
      var obj = ko.toJS(this.attributes);
      if(this.id()) obj[this.idAttribute] = this.id();
      return obj;
    }
  });

  // ## KnockoutApp.Collection
  // A collection stores models in an arrayObservable and provide methods to modify it
  var Collection = KnockoutApp.Collection = function(){

    // Create an array observable to store all the models
    this.models = ko.observableArray();

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

  // ## KnockoutApp.Sync
  // Used to sync models to the server, it can be overriden to support, for example, HTML5 localStorage
  // Requires two parameters:
  //
  // - a method (fetch, create, update or destroy)
  //
  // - a model or a collection
  //
  // You can pass options to it using the third parameter (in that case the options will be passed to the ajax call)
  KnockoutApp.Sync = function(method, model, _options){

    // Ensure jQuery is loaded
    if(typeof $ === 'undefined') throw "jQuery is necessary to make Ajax calls";

    var params = {},
        options = _options || {};

    params.dataType = 'json';

    // On error response calls KnockoutApp.Utils.wrapError
    params.error = function(){
      KnockoutApp.Utils.wrapError(arguments);
    };

    //Get the url of the model/collection (model.url or model.url())
    params.url = Utils.unwrapValue(model, 'url');

    // If params.url isn't defined throw an error
    if(!params.url) throw "Url property must be defined in model/collection when using KnockoutApp.Sync";

    switch(method){
      case 'fetch':
        params.type = 'GET';
        break;
      case 'create':
        params.type = 'POST';
        if(model.name){
          params.data = {};
          // If model.name property is set wrap model.toJSON() in an object model.name
          params.data[model.name] = model.toJSON();
        }else{
          params.data = model.toJSON();
        }
        break;
      case 'update':
        params.type = 'PUT';
        if(model.name){
          params.data = {};
          // If model.name property is set wrap model.toJSON() in an object model.name
          params.data[model.name] = model.toJSON();
        }else{
          params.data = model.toJSON();
        }
        break;
      case 'destroy':
        params.type = 'DELETE';
        break;
    }

    // Make and return an Ajax call merging the options object passed as the third parameter with the *params* object
    return $.ajax(ko.utils.extend(params, options));
  };

  // Give extensibility to models and collections
  Collection.extend = Model.extend = Utils.extendClass;

  return KnockoutApp;

});