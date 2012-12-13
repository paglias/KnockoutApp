// A simple dirty flag to track changes in an object
// Based on Ryan Niemeyer's one http://www.knockmeout.net/2011/05/creating-smart-dirty-flag-in-knockoutjs.html
// The model is initially set to dirty if if this.isNew() returns true
// To check wheter the item is changed use this.status.isChanged(), which is an observable so you can subscribe to it.
// To reset this.status.isChanged() use this.status.reset()
		
KnockoutApp.Utils.dirtyFlag = function(root, isInitiallyDirty){
	var self = this,
			initialState = ko.toJSON(root);

	this.isChanged = ko.observable(isInitiallyDirty);

	var observe = ko.computed(function(){
		if(initialState !== ko.toJSON(root) || (isInitiallyDirty === true)){
			this.isChanged(true);
		}else{
			this.isChanged(false);
		}
	}, this);

	this.reset = function(){
		initialState = ko.toJSON(root);
		self.isChanged(false);
	};
};