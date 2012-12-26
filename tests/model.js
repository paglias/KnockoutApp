module("Model");

test( "initialize", function(){
	var model = KnockoutApp.Model.extend({
		initialize: function(attributes, collection){
			this.property = "initialize with " + attributes.first + " " + collection;
		}
	});

	var instance = new model({first: "first"}, "collection");

	equal( instance.property, "initialize with first collection" );
});

test( "attributes and defaultAttributes", function(){
	var model = KnockoutApp.Model.extend({
		defaultAttributes: function(){
			return {
				firstName: ko.observable("firstName"),
				lastName: ko.observable("lastName")
			};
		}
	});

	var instance = new model({
		lastName: "Pagliazzi"
	});

	equal( instance.attributes.firstName(), "firstName" );
	equal( instance.attributes.lastName(), "Pagliazzi" );
	equal( instance.defaultAttributes().lastName(), "lastName" );
});

test( "collection", function(){
	var model = KnockoutApp.Model.extend();
	var collection = new KnockoutApp.Collection(model);

	var instance = new model(null, collection);

	equal(instance.collection, collection);
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

	var isNew = new model();

	equal(isNew.isNew(), true);

	isNew.id("2");

	equal(isNew.isNew(), false);

	var nonNew = new model({id: "1"});

	equal(nonNew.isNew(), false);
});

test( "sync", function(){
	var model = KnockoutApp.Model.extend({
		sync: function(){
			return arguments;
		}
	});
	var instance = new model();

	//Check that model.sync can be overriden
	equal(instance.sync.call(instance, 'fetch', instance)[0], "fetch");
});

test( "url", function(){
	var model = KnockoutApp.Model.extend({
		baseUrl: "base"
	});

	var instanceNew = new model();

	equal(instanceNew.url(), "base");

	var instance = new model({id: 1});

	equal(instance.url(), "base/1");

	var coll = KnockoutApp.Collection.extend({
		url: "coll"
	});

	model.prototype.baseUrl = undefined;

	var coll1 = new coll(model);

	coll1.add({id: 2});

	equal(coll1.models()[0].url(), "coll/2");
});

asyncTest( "fetch", function(){
	var model = KnockoutApp.Model.extend({
		baseUrl: "/tasks",

		defaultAttributes: function(){
			return {
				name: ko.observable("a task"),
				done: ko.observable(false)
			};
		}

	});

	var instance = new model({id: 44, name: "my task", done: false});

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

	instance.fetch();

	setTimeout(function(){
		equal(instance.id(), 44);
		equal(instance.attributes.name(), "my fetched task");
		equal(instance.attributes.done(), false);
		$.mockjaxClear(ajax);
		start();
	}, 6);

});

asyncTest( "create (save)", function(){
	var model = KnockoutApp.Model.extend({
		baseUrl: "/tasks",

		defaultAttributes: function(){
			return {
				name: ko.observable("a task"),
				done: ko.observable(false)
			};
		}

	});

	var instance = new model({name: "my task", done: false});

	var ajax = $.mockjax({
		type: 'POST',
		url: '/tasks',
		responseTime: 5,
		contentType: 'text/json',
		responseText: {
			id: 55,
			name: "my task",
			done: false
		}
	});

	instance.save();

	setTimeout(function(){
		equal(instance.id(), 55);
		equal(instance.attributes.name(), "my task");
		equal(instance.attributes.done(), false);
		$.mockjaxClear(ajax);
		start();
	}, 6);
});

asyncTest( "update (save)", function(){
	var result = false;

	var model = KnockoutApp.Model.extend({
		baseUrl: "/tasks",

		defaultAttributes: function(){
			return {
				name: ko.observable("a task"),
				done: ko.observable(false)
			};
		}

	});

	var instance = new model({id: 77, name: "my task", done: false});

	var ajax = $.mockjax({
		type: 'PUT',
		url: '/tasks/77',
		responseTime: 5,
		contentType: 'text/json',
	});

	instance.save({
		success: function(data){
			result = true;
		}
	});

	setTimeout(function(){
		equal(result, true);
		$.mockjaxClear(ajax);
		start();
	}, 6);
});

asyncTest( "destroy", function(){
	var isNew = new KnockoutApp.Model({name: "john"});

	equal(isNew.destroy(), false);

	var coll = new KnockoutApp.Collection(KnockoutApp.Model);

	var nonNew = new KnockoutApp.Model({id: 66, name: "john"});
	nonNew.baseUrl = "/tasks";

	coll.add(nonNew);

	equal(coll.models().length, 1);

	var ajax = $.mockjax({
		type: 'DELETE',
		url: '/tasks/66',
		responseTime: 5,
		contentType: 'text/json'
	});

	nonNew.destroy();

	setTimeout(function(){
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
