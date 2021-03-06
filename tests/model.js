module("Model");

test( "initialize", function(){
  var model = KnockoutApp.Model.extend({
    initialize: function(attributes, options){
      this.property = "initialize with " + attributes.first + " " + options.first;
    }
  });

  var instance = new model({
    first: "first" // attributes
  }, {
    first: "option 1" // options
  });

  equal(instance.property, "initialize with first option 1");
});

test( "attributes and defaults", function(){
  var model = KnockoutApp.Model.extend({
    defaults: {
      firstName: ko.observable("firstName"),
      lastName: ko.observable("lastName")
    }
  });

  var instance = new model({
    lastName: "Pagliazzi"
  });

  equal(instance.attributes.firstName(), "firstName" );
  equal(instance.attributes.lastName(), "Pagliazzi" );
  equal(instance.defaults.lastName(), "lastName" );
});

test( "collection", function(){
  var model = KnockoutApp.Model.extend();
  var coll = new KnockoutApp.Collection(model);

  var instance = new model(null, {collection: coll});

  equal(instance.collection, coll);
});

test( "id and idAttribute", function(){
  var model = KnockoutApp.Model.extend({
    idAttribute: "_id"
  });

  var instance = new model({_id: "1"});

  equal(instance.id(), 1);

  var model2 = KnockoutApp.Model.extend();
  var instance2 = new model2({id: "33"});

  equal(instance2.id(), 33);
});

test( "isNew", function(){
  var model = KnockoutApp.Model.extend();

  var notSaved = new model();

  equal(notSaved.isNew(), true);

  notSaved.id("2");

  equal(notSaved.isNew(), false);

  var saved = new model({id: "1"});

  equal(saved.isNew(), false);
});

test( "sync", function(){
  var model = KnockoutApp.Model.extend({
    sync: function(){
      return "sync overriden!";
    }
  });

  var instance = new model();

  //Check that model.sync can be overriden
  equal(instance.sync(), "sync overriden!");
});

test( "url", function(){
  var Model = KnockoutApp.Model.extend({
    baseUrl: "base"
  });

  var notSaved = new Model();

  equal(notSaved.url(), "base");

  notSaved.baseUrl = undefined;

  throws(notSaved.url());

  var saved = new Model({id: 1});

  equal(saved.url(), "base/1");

  var Collection = KnockoutApp.Collection.extend({
    url: "collection",
    model: Model
  });

  var coll = new Collection;

  coll.add({id: 2});

  collFirst = coll.models()[0];

  collFirst.baseUrl = undefined;

  equal(collFirst.url(), "collection/2");

});

asyncTest( "fetch", function(){

  var model = KnockoutApp.Model.extend({
    baseUrl: "/tasks",
    defaults: {
      name: ko.observable("a task"),
      done: ko.observable(false)
    }
  });

  var instance = new model({
    id: 44,
    name: "my task",
    done: false,
    attr: "onother attr..."
  });

  var ajax = $.mockjax({
    url: '/tasks/44',
    responseTime: 5,
    contentType: 'text/json',
    responseText: {
      id: 44,
      done: false,
      name: "my fetched task"
    }
  });

  instance.fetch({
    success: function(model, data){
      model.attributes.done(!data.done); //check for success override
    }
  });

  setTimeout(function(){
    equal(instance.id(), 44);
    equal(instance.attributes.name(), "my fetched task");
    equal(instance.attributes.attr, undefined);
    equal(instance.attributes.done(), true);
    $.mockjaxClear(ajax);
    start();
  }, 6);

});

asyncTest( "create (save)", function(){

  var model = KnockoutApp.Model.extend({
    baseUrl: "/tasks",
    defaults: {
      name: ko.observable("a task"),
      done: ko.observable(false)
    },
    name: "task"
  });

  var instance = new model({
    name: "my task",
    done: false
  });

  var ajax = $.mockjax({
    type: 'POST',
    url: '/tasks',
    responseTime: 5,
    contentType: 'text/json',
    data: { // check that the data sent is wrapped in model.name
      task: {
        name: "my task",
        done: false
      }
    },
    responseText: {
      id: 55,
      name: "my task",
      done: false
    }
  });

  instance.save();

  var instance2 = new model({
    name: "my task to be validated",
    done: false
  });

  instance2.validate = function(){
    return "validation failed...";
  };

  var validationResult = false; // what is expected

  instance2.save({
    success: function(){
      validationResult = true; // in case the validation didn't stop the sync call...
    }
  });

  setTimeout(function(){
    // instance correctly created
    equal(instance.id(), 55);

    equal(instance2.validate(), "validation failed...");
    equal(validationResult, false); // check that the sync call hasn't been executed

    $.mockjaxClear(ajax);
    start();
  }, 6);
});

asyncTest( "update (save)", function(){

  var model = KnockoutApp.Model.extend({
    baseUrl: "/tasks",
    defauls: {
      name: ko.observable("a task"),
      done: ko.observable(false)
    }
  });

  var instance = new model({
    id: 77,
    name: "my task",
    done: false
  });

  var ajax = $.mockjax({
    type: 'PUT',
    url: '/tasks/77',
    responseTime: 5,
    contentType: 'text/json',
    responseText: {},
    data: { // check that the data sent is correct
      id: 77,
      name: "my task",
      done: false
    }
  });

  var result = false; // necessary to check that the update has been successful

  instance.save({
    success: function(data){
      console.log("successful")
      result = true; // update successful
    }
  });

  var validationResult = false;

  instance.validate = function(){
    return "validation failed...";
  };

  instance.save({
    success: function(data){
      validationResult = true;
    }
  });

  setTimeout(function(){
    equal(result, true);

    equal(validationResult, false);
    equal(instance.validate(), "validation failed...");

    $.mockjaxClear(ajax);
    start();
  }, 6);
});

asyncTest( "destroy", function(){
  var model = KnockoutApp.Model.extend({
    defaults: {
      name: "john"
    },
    baseUrl: "/tasks"
  });

  var notSaved = new model();

  equal(notSaved.destroy(), false);

  var coll = new KnockoutApp.Collection();

  var saved1 = new model({
    id: 66
  });

  var saved2 = new model({
    id: 67
  });

  coll.add([saved1, saved2]);

  equal(coll.models().length, 2);

  var ajax = $.mockjax({
    type: 'DELETE',
    url: '/tasks/*',
    responseTime: 5,
    responseText: {},
    contentType: 'text/json'
  });

  saved1.destroy();
  saved2.destroy({wait: true});

  setTimeout(function(){
    strictEqual(saved1.collection, undefined);
    strictEqual(saved2.collection, undefined);

    equal(coll.models().length, 0);

    $.mockjaxClear(ajax);
    start();
  }, 6);

});

test( "toJSON", function(){
  var model = new KnockoutApp.Model({
    day: ko.observable("Monday")
  });

  equal(model.toJSON().day, "Monday");
});
