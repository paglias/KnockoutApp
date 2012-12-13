var localStorageStore = function(name){
	this.name = name || "knockout-app-localstorage";
	this.maxId = 0;
	this.data = {};
};

LocalStorageSync = function(method, model, options){

	if(typeof localStorage.setItem === 'undefined') throw "localStorage not avalaible";
	if(typeof model.localStorageStore === "undefined" && typeof model.collection.localStorageStore === "undefined") throw "Missing a localStorage Store";

	var store = model.localStorageStore || model.collection.localStorageStore;

	var save = function(){
		localStorage.setItem(store.name, ko.toJSON(store.data));
	};

	var response = false;

	switch(method){
		case 'fetch':
			if(typeof model.id === 'undefined'){
				var rawData = localStorage.getItem(store.name);
				if(rawData) store.data = JSON.parse(rawData);
				for(var item in store.data){
					if(item > store.maxId) store.maxId = item;
				}
				response = store.data;
			}else{
				response = store.data[model.id()]
			}
			break;
		case 'create':
			store.maxId++;
			model.id(store.maxId);
			store.data[model.id()] = model.toJSON();
			save();
			response = store.data[model.id()];
			break;
		case 'update':
			store.data[model.id()] = model.toJSON();
			save();
			response = true;
			break;
		case 'destroy':
			delete store.data[model.id()];
			save();
			response = true;			
			break;
	}

	if(response && options.success){
		options.success(response)
	}else if(!response && options.error){
		options.error(response);
	}

	return true;
};