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
