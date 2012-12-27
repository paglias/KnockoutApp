module("Utils");

test( "isObservableArray", function(){
  var oA = ko.observableArray([]);
  var o = ko.observable("");
  equal( KnockoutApp.Utils.isObservableArray(oA) , true );
  equal( KnockoutApp.Utils.isObservableArray(o) , false );
});

test( "extendObjKnockout", function(){
  var destination = {
    firstName: ko.observable("firstName"),
    lastName: ko.observable("lastName"),
    list: ko.observableArray([1, 2]),
    sub1: {
      a: "sub1 a",
      b: "sub1 b"
    },
    sub2: {
      a: "sub2 a",
      b: "sub2 b"
    }
  };

  var params = {
    firstName: "Matteo",
    list: 3,
    sub1: {
      a: "changed",
      c: "added"
    },
    sub2: "a string"
  };

  KnockoutApp.Utils.extendObjKnockout(destination, params);

  equal( destination.firstName(), "Matteo" );
  equal( destination.lastName(), "lastName" );
  equal( destination.list().toString(), [1, 2, 3] );
  equal( destination.sub1.a, "changed" );
  equal( destination.sub1.b, "sub1 b" );
  equal( destination.sub1.c, "added" );
  equal( destination.sub2, "a string" );

});

test( "cloneObjKnockout", function(){
  var original = {
    a: ko.observable("a"),
    b: "b"
  };

  var cloned = KnockoutApp.Utils.cloneObjKnockout(original);

  cloned.a("a cloned");
  equal(original.a(), "a");

  cloned.b = "cloned b";
  equal(original.b, "b");

  original.a("a original");
  equal(cloned.a(), "a cloned");

  original.b = "original b";
  equal(cloned.b, "cloned b");
});

test( "extendClass", function(){
  var Class = function(){
    this.constructorProp = "Class' constructorProp";
  };

  Class.prototype.protoProp = "Class' protoProp";
  Class.staticProp = "Class' staticProp";

  Class.extend = KnockoutApp.Utils.extendClass;

  var subClass = Class.extend({
    constructor: function(){
      this.constructorProp = "subClass' constructorProp";
    },
    subProtoProp: function(){
      return this.protoProp + " called by subClass' subProtoProp";
    }
  },
  {
    staticProp: "subClass staticProp that override Class.staticProp"
  });

  var subClassInstance = new subClass();
  var superProtoProp = subClass.__super__.protoProp;
  var superStaticProp = subClass.__super__.constructor.staticProp;

  equal( subClass.staticProp, "subClass staticProp that override Class.staticProp" );
  equal( subClassInstance.constructorProp, "subClass' constructorProp" );
  equal( subClassInstance.subProtoProp(), "Class' protoProp called by subClass' subProtoProp" );
  equal( superProtoProp, "Class' protoProp" );
  equal( superStaticProp, "Class' staticProp" );
});

test( "unwrapValue", function(){
  var func = function(){
    this.a = "a property...";
    this.b = function(){
      return this.a;
    };
  };

  var instance = new func();

  equal( KnockoutApp.Utils.unwrapValue(instance, 'a'), "a property..." );
  equal( KnockoutApp.Utils.unwrapValue(instance, 'b'), "a property..." );
});
