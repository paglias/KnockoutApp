(function(){

  // Create a new model extending the base one
  var Task = KnockoutApp.Model.extend({

    // Define the default values for the model's attributes
    defaults: {
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

      // Is the model being edited?
      this.editing = ko.observable(false);

    },

    // Change this.editing from false to true and vice versa
    edit: function(){
      this.editing(!this.editing());
    }

  });

  // Create a new collection extending the base one
  var TaskList = KnockoutApp.Collection.extend({

    model: Task,

    sync: LocalStorageSync,

    initialize: function(){
      // The tasks to show ('all', 'done' or 'todo')
      this.show = ko.observable('all');

      // Change the tasks show based on *this.show()* value
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

      // The model being added
      this.current = ko.observable("");
    },

    // Add a model from the value of *this.current()*
    addInput: function() {
      var current = this.current().trim();
      if (current) {
        this.add({title: current});
        this.current('');
      }
    }

  });

  // Create a new collection
  var tasklist = new TaskList();

  // Set the localstorage store and fetch tasks
  tasklist.localStorageStore = new localStorageStore("knockout-app-todo-example");

  // Fetch the tasks from localStorage
  tasklist.fetch();

  $(function() {
    // Start the app
    ko.applyBindings(tasklist);
  });

})();

