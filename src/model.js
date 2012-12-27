  // This is the base Model class in KnockoutApp
  var Model = KnockoutApp.Model = function(attributes, options){

    // 'id' is an observable property, initially set to 'false'
    this.id = ko.observable(false);

    // The model stores its data inside this object
    this.attributes = {};

    // If an 'attributes' object is passed as a parameter:
    if(attributes){

      // In case it contains an 'id' (or the idAttribute property) property set **this.id()** value to it and delete it from the attributes object 
      if(attributes[this.idAttribute]){
        this.id(attributes[this.idAttribute]);
        delete attributes[this.idAttribute];
      }

      // Merge the attributes passed as parameters with the default attributes stored inside **this.defaultAttributes()**
      //
      // Using **Utils.extendObjKnockout** ensured that observable properties inside *this.defaultAttributes()*
      // are correctly set into *this.attributes*
      this.attributes = Utils.extendObjKnockout(Utils.cloneObjKnockout(this.defaultAttributes), attributes);
    }

    // This function allows to be passed, as the second parameter, a reference to a **Collection**.
    // In that case a reference to the collection is set as *this.collection*
    if(options && options.collection) this.collection = options.collection;

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
    defaultAttributes: {},

    idAttribute: 'id',

    // Uses this.collection.sync || KnockoutApp.Sync can be overriden
    sync: function(){
      return ((this.collection && this.collection.sync) || KnockoutApp.Sync).apply(this, arguments);
    },

    // Returns the model url on the server using the model's baseUrl or collection's url properties
    url: function(){
      var base = Utils.unwrapValue(this, 'baseUrl') || (this.collection && Utils.unwrapValue(this.collection, 'url'));
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

      options.success = function(data){
        delete data[self.idAttribute];
        self.attributes = Utils.extendObjKnockout(Utils.cloneObjKnockout(self.defaultAttributes), data);
      };
      
      options.error = function(){
        Utils.wrapError(arguments);
      };

      if(_options) ko.utils.extend(options, _options);

      return this.sync.call(this, 'fetch', this, options);
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
        if(method === 'create') self.id(data[self.idAttribute]);
      };

      options.error = function(){
        Utils.wrapError(arguments);
      };

      if(_options) ko.utils.extend(options, _options);

      return this.sync.call(this, method, this, options);
    },

    // Destroy the model on the server and remove it from its collection (if exists)
    // Options for the Ajax call can be passed as a parameter
    destroy: function(_options){
      if(this.isNew()){
        if(this.collection) this.collection.models.remove(this);
        return false;
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
        
        return this.sync.call(this, 'destroy', this, options);
      }
    },

    // Used for serialization, returns an object that contains model's attributes and its id
    toJSON: function(){
      var obj = ko.toJS(this.attributes);
      if(this.id()) obj[this.idAttribute] = this.id();
      return obj;
    }
  });
