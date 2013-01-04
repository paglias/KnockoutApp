<h2 class="page-header">extendClass <small>KnockoutApp.Utils.extendClass( prototype properties, class properties )</small></h2>

Extend a class by providing `prototype properties` and `class properties`.

The class constructor can be overriden passing a `constructor` method in the `prototype properties`.

You can access the parent prototype with `Class.__super__`.

An extended class can be further extended.

This method is used for `KnockoutApp.Model.extend` and `KnockoutApp.Collection.extend`.