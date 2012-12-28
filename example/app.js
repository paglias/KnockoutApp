var Task = KnockoutApp.Model.extend({

  // Define the default values for the model's attributes
  defaultAttributes: {
    title: ko.observable("a task"),
    done: ko.observable(false)
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
var TaskList = KnockoutApp.Collection.extend({

  sync: LocalStorageSync,

  initialize: function(){
    this.show = ko.observable('all');

    this.toShow = ko.computed(function(){
      switch ( this.show() ) {
      case 'done':
        return this.where({done: true});

      case 'todo':
        return this.where({done: false});

      default:
        return this.models();
      }
    }, this);

  }

});

//Create a new collection
var tasklist = new TaskList(Task);
tasklist.localStorageStore = new localStorageStore("knockout-app-todo-example");
tasklist.fetch();

var ViewModel = function(){
  var self = this;
  self.collection = tasklist;

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
  ko.applyBindings(new ViewModel());
});
