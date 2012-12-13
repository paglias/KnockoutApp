var Task = KnockoutApp.Model.extend({

	// Define the default values for the model's attributes
	defaultAttributes: function(){
		return {
			title: ko.observable("a task"),
			done: ko.observable(false)
		};
	},

	initialize: function(){

		// Set up a dirty flag (not included by default, see dirty-flag.js in this folder)
		var isInitiallyDirty = this.isNew() === true ? true : false;
		this.status = new KnockoutApp.Utils.dirtyFlag(this.attributes, isInitiallyDirty);

		// Save the model each time it changes
		this.saveOnchange = ko.computed(function(){
			var self = this;

			if(this.status.isChanged() === true){
				this.save({
					success: function(){
						self.status.reset();
					}
				});
			}
		}, this);

		this.editing = ko.observable(false);
		this.edit = function(){
			this.editing(true);
		};

	}

});

//Extend the base collection
var TaskListCollection = KnockoutApp.Collection.extend({
	
	initialize: function(){
		this.show = ko.observable('all');

		this.toShow = ko.computed(function(){
			switch ( this.show() ) {
			case 'done':
				return this.models().filter(function(task) {
					return task.attributes.done();
				});

				break;
			case 'todo':
				return this.models().filter(function(task) {
					return !task.attributes.done();
				});

				break;
			default:
				return this.models();
			}
		}, this);
	}

});

//Create a new collection
var TaskList = new TaskListCollection(Task);

// Set up the localStorage adapter (not included by default, see localstorage-sync.js in this folder) 
TaskList.sync = LocalStorageSync;	
TaskList.localStorageStore = new localStorageStore("knockout-app-todo");

var ViewModel = function(){
	var self = this;
	self.collection = TaskList;

	self.addFromForm = function(elements){
		var input = $(elements).children();
		if ( input.val().length < 1 ) { //use validation
			return false;
		}

		self.collection.add({
			title: input.val()
		});

		input.val("");
	};
};

$(function() {
	TaskList.fetch();
	ko.applyBindings(new ViewModel());
});
