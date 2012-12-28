(function(){

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

    },

    edit: function(){
      this.editing(!this.editing());
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

      this.current = ko.observable("");
    },

    addInput: function() {
      var current = this.current().trim();
      if (current) {
        this.add({title: current});
        this.current('');
      }
    }

  });

  //Create a new collection
  var tasklist = new TaskList(Task);

  //Set the localstorage store and fetch tasks
  tasklist.localStorageStore = new localStorageStore("knockout-app-todo-example");
  tasklist.fetch();

  $(function() {
    ko.applyBindings(tasklist);
  });

})();

