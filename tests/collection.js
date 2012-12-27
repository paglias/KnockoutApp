module("Collection");

test( "model reference", function(){
  var model = KnockoutApp.Model.extend({
    baseUrl: "/tasks"
  });

  var coll = new KnockoutApp.Collection(model);

  equal(coll.model, model);
});

test( "models is an observable array", function(){
  var coll = new KnockoutApp.Collection(KnockoutApp.Model);

  equal(KnockoutApp.Utils.isObservableArray(coll.models), true);
});

test( "initialize", function(){
  var coll = KnockoutApp.Collection.extend({
    initialize: function(model){
      this.property = "initialized with " + this.model;
    }
  });

  var model = KnockoutApp.Model.extend({
    name: "my model"
  });

  var instance = new coll(model);
  equal( instance.property, "initialized with " + model );
});

test( "sync", function(){
  var coll = KnockoutApp.Collection.extend({
    sync: function(){
      return "sync overriden!";
    }
  });

  var instance = new coll(KnockoutApp.Model);

  //Check that collection.sync can be overriden
  equal(instance.sync(), "sync overriden!");
});

asyncTest( "fetch", function(){
  var coll = KnockoutApp.Collection.extend({
    url: "/taskslist"
  });

  var model = KnockoutApp.Model.extend({
    defaultAttributes: {
      name: ko.observable("a task"),
      done: ko.observable(false)
    }
  });

  var instance = new coll(model);

  var ajax = $.mockjax({
    url: '/taskslist',
    responseTime: 5,
    contentType: 'text/json',
    responseText: [{
      id: 1,
      name: "task 1",
      done: true
    }, {
      id: 2,
      name: "task 2",
      done: false
    }]
  });

  instance.fetch();

  setTimeout(function(){
    equal(instance.models().length, 2);
    equal(instance.models()[0].id(), 1);
    equal(instance.models()[0].attributes.name(), "task 1");
    $.mockjaxClear(ajax);
    start();
  }, 6);

});

asyncTest( "add", function(){
  var coll = KnockoutApp.Collection.extend({
    url: "/tasks"
  });

  var model = KnockoutApp.Model.extend({
    defaultAttributes: {
      name: ko.observable("a task"),
      done: ko.observable(false)
    }
  });

  var instance = new coll(model);

  var ajax = $.mockjax({
    type: 'POST',
    url: '/tasks',
    responseTime: 5,
    contentType: 'text/json',
    responseText: {
      id: 1,
      name: "single",
      done: false
    }
  });

  instance.add({
    name: "single"
  }, true);

  instance.add([{
    name: "multiple 1, attributes",
    done: true
  }, new model({
    name: "multiple 2, instance"
  })]);

  setTimeout(function(){
    equal(instance.models().length, 3);

    equal(instance.models()[0].isNew(), false);
    equal(instance.models()[0].id(), 1);

    equal(instance.models()[1].isNew(), true);
    equal(instance.models()[1].attributes.done(), true);

    equal(instance.models()[2].isNew(), true);
    equal(instance.models()[2].attributes.name(), "multiple 2, instance");

    $.mockjaxClear(ajax);
    start();
  }, 6);
});

asyncTest( "remove", function(){
  var coll = new KnockoutApp.Collection(KnockoutApp.Model.extend({
    baseUrl: "/tasks"
  }));

  coll.add([{
    id: 1,
    name: "model 1"
  }, {
    name: "model 2"
  }, {
    name: "model 3"
  }]);

  var ajax = $.mockjax({
    type: 'DELETE',
    url: '/tasks/1',
    responseTime: 5,
    contentType: 'text/json'
  });

  coll.remove(coll.models()[0]);

  setTimeout(function(){

    equal(coll.models().length, 2);

    coll.remove([coll.models()[0], coll.models()[1]]);

    equal(coll.models().length, 0);

    $.mockjaxClear(ajax);
    start();
  }, 6);
});

test( "find", function(){
  var coll = new KnockoutApp.Collection(KnockoutApp.Model);

  coll.add([
    {id: 1, name: "name1"},
    {id: 2, name: "name2"},
    {id: 3, name: "name2", year: 2012}
  ]);

  strictEqual(coll.find(), false);
  equal(coll.find(1).id(), 1);
  equal(coll.find(2).attributes.name, "name2");
  equal(coll.find({name: "name2"}).id(), 2);
  equal(coll.find({name: "name2", year: 2012}).id(), 3);
  equal(coll.find({year: 2012, name: "name2"}).id(), 3);
});

test( "where", function(){
  var coll = new KnockoutApp.Collection(KnockoutApp.Model);

  coll.add([
    {id: 1, name: "name1", gender: "female"},
    {id: 2, name: "name2", gender: "male"},
    {id: 3, name: "name3", gender: "female"}
  ]);

  deepEqual(coll.where(), []);
  equal(coll.where({gender: "male"}).length, 1);
  equal(coll.where({gender: "female"}).length, 2);
  equal(coll.where({gender: "female", name: "name2"}).length, 0);
  equal(coll.where({gender: "male", name: "name2"})[0].id(), 2);
  equal(coll.where({gender: "female", name: "name3"})[0].id(), 3);
});

test( "toJSON", function(){
  var coll = new KnockoutApp.Collection(KnockoutApp.Model);
  coll.add([
    { name: ko.observable(1) },
    { name: 2 }
  ]);

  var res = coll.toJSON();

  equal(res.length, 2);
  equal(res[0].name, 1);
  equal(res[1].name, 2);
});