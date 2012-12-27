  // An object that stores all utils used by KnockoutApp
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

    // Used to clone an object with knockout elements inside
    cloneObjKnockout: function(obj){
      if(ko.isWriteableObservable(obj)) return ko.observable(obj());
      if(obj === null || typeof obj !== 'object') return obj;
      
      var temp = obj.constructor(); // give temp the original obj's constructor
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

      child.extend = parent.extend;
      return child;
    },

    // Return the value provided either if it's a function or a property (model.url or model.url())
    // The first parameter is the object where the value is contained, the second one is the value itself
    // After various attemps to make this working I've decided to adopt Underscore's *result* method.
    unwrapValue: function(object, property){
      if (object === null) return null;
      var value = object[property];
      return typeof value === 'function' ? value.call(object) : value;
    },

    // Errors wrapper, for now it simply log in the console everything is passed as a parameter to it ex. wrapError("an error occurred")
    wrapError: function(){
      var args = Array.prototype.slice.call(arguments);
      console.log("Error ", args);
    } 

  }; 
