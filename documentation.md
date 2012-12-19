KnockoutApp Documentation
=========================

## KnockoutApp.Model

A model is used to store data and has methods to connect it with the server.

	var Task = KnockoutApp.Model.extend({

		defaultAttributes: function(){
			return {
				title: ko.observable("A task to do"),
				done: ko.observable(false)
			};
		}

	});

	var task1 = new Task({
		title: "my first task"
	});

### extend
KnockoutApp.Model.extend( [ protoProps, staticProps ] )

Give a Model the possibility to be extended, accepts two objects: one to extend instance properties and the second one for static properties.

	var Task = KnockoutApp.Model.Extend({
		//instance properties and methods
	},
	{
		//static properties and methods
	});

Used to extend model prototype and static methods.

### constructor / initialize
new KnockoutApp.Model( [ attributes, collection ] )

Create a new model instance, accepts two parameters:

- an object of *attributes* to be set

- if the model is inside a collection you can pass as a second parameter a reference to the collection

Instead of overriding the constructor use the *initialize* method that will be called using *apply()* from the collection so *this* will be the model.

Remember that KnockoutJS observable properties can't be defined in the model's prototype so *initialize* is the perfect place.

	Task.prototype.initialize = function(){
		//code code code
	};

### id
model.id()

An observable property, used to communicate with the server.

If its value is set to *false* model.isNew() will return true.

### attributes
model.attributes

A simple object where all the model's attributes are stored.

### defaultAttributes
model.defaultAttributes()

A function that returns an object with the default attributes of the model.

You can also define KnockoutJS observable properties.

*Must be a function since I've not implemented any clone method.*

	Task.prototype.defaultAttributes = function(){
		return {
			title: ko.observable("default title"),
			done: ko.observable(false)
		}
	}

### collection
model.collection

If the model is stored in a Collection it stores a reference to the collection.

### sync
model.sync

If this property is set, it will be used instead of KnockoutApp.Sync.

### isNew
model.isNew()

Used to detect if the model has been saved to the server.

Return *false* if model.id() is not *false*.

### fetch
model.fetch( [ options ] )

Fetch a model from the server and overrides its attributes with the one fetched.

Accepts as a parameter an *options* object tha will be passed to Knockout.Sync.

### save
model.save( [ options ] )

If model.isNew() the model will be created on the server, otherwise it will be saved.

Accepts as a parameter an *options* object that will be passed to KnockoutApp.Sync.

### destroy
model.destroy( [ options ] )

If the model is inside a collection, remove it from the collection.

If the model has been saved to the server, delete it on the server.

Accepts as a parameter an *options* object tha will be passed to Knockout.Sync.

### url
model.url()

If the model is inside a collection return the collection url plus the id property if the item has been saved to the server.

### validate
model.validate()

Not implementd, returns true.

It is called before saving the model to the server and should return *true* unless the model isn't valid.

### toJSON
model.toJSON()

Used for serialization return an object with the model attributes and the *id* property.

## Collection

A collection's main purpose is to store models providing methods to add, remove and show them.

### extend
KnockoutApp.Collection.extend( [instance properties, static properties] )

Give a Collection the possibility to be extended, accepts two objects: one to extend instance properties and the second one for static properties.

	var TasksList = KnockoutApp.Collection.Extend({
		//instance properties and methods
	},
	{
		//static properties and methods
	});

### constructor / initialize
new KnockoutApp.Collection( model )

Create a new collection instance passing the model class as the first parameter.

Remember that KnockoutJS observable properties can't be defined in the model's prototype so *initialize* is the perfect place.

	TasksList.prototype.initialize = function(){
		//code code code
	};

	new TasksList(Task);

### models
collection.models()

A Knockout observable array to store all the models of the collection.

### model
collection.model

A reference to the model class.

### sync
collection.sync

If this property is set, it will be used instead of KnockoutApp.Sync for this collection and for all its models.

### url
collection.url

Used to make calls to the server using KnockoutApp.Sync.

Can be either a function or a standard string, by default it's not defined.

	collection.url = 'http://mywebsite.com'

### fetch
collection.fetch( [ options ] )

Fetch the collection from the server using KnockoutApp.Sync and add models to the collection using collection.add().

Accepts as a parameter an *options* object tha will be passed to Knockout.Sync.

### add
collection.add( model_s, [ create ] )

Add on or more models (using an array) to the collection, also add a reference to the collection to each model.

If you set the second parameter to *TRUE* it'll call model.save() on each model.

	var task = {
		name: "my task",
		done: false
	};

	// Will add a new model to the collection passing the task object as the attributes and create it on the server.
	TasksList.add(task, true);

### remove
collection.remove( model_s )

Call model.destroy() on each model passed to it (accepts also an array).

	TasksList.remove([task1, task2, task3]);

### toJSON
collection.toJSON()

Return an array of all the models in the collection calling on each model *model.toJSON()*.

## Sync
KnockoutApp.Sync(method, model, options)

By default it makes calls to the server using jQuery's Ajax but can be overridden to use any storing system like HTML5 LocalStorage.

Accepts three parameters:

- *method*: can be *fetch, create, update or destroy*

- *model*: the model or the collection you are referring to

- *options*: an object that can contain option for the Ajax call

## Utils

Some utilitity methods used by KnockoutApp.

### unwrapValue
KnockoutApp.Utils.unwrapValue( value, [ context ] )

If the passed value is a function call it or if it's a simple property simply return it.

	var a = "a property";

	// returns "a property"
	KnockoutApp.Utils.unwrapValue(a);

	var a = function(){
		return "a method";
	};

	//returns "a method"
	KnockoutApp.Utils.unwrapValue(a)

An optional second parameters "context" will be used as the context for calling value() ( value.call(context) )

### extendObjKnockout
KnockoutApp.Utils.extendObjKnockout( destination, params )

Given a *destination* object and a *params* object sets *params* properties into *destination*.

It's like any extend method in JS with the only differences that in *destination* you can have KnockoutJS observable properties that you can set by the *params* object without having to create a new observable or to call it passing a value ( observable("my value") ).

	var destination = {
		firstName: ko.observable("first name"),
		lastName: ko.observable("last namse"),
		nonObservable: "a normal string"
	};

	var params = {
		firstName: "Matteo",
		lastName: "Pagliazzi",
		nonObservable: "another normal string"
	};

	// Will set destination.firstName() to "Matteo" (keeping it an observable)
	// destination.lastName() to "Pagliazzi" (keeping it too an observable)
	// destination.nonObservable to "another normal string"
	KnockoutApp.Utils.extendObjKnockout(destination, params);

### extendClass
KnockoutApp.Utils.extendClass( [ protoProps, staticProps ] )

Give extensibility to a class, is the one used by Collection and Model and it's almost the same used by BackboneJs to which all the credits are due.

### isObservableArray
KnockoutApp.Utils.isObservableArray( object )

Returns *trueé if the value passed is an observable array.

	var a = ko.observableArray();

	//returns TRUE
	KnockoutApp.Utils.isObservableArray(a);


