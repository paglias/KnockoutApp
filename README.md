**KnockoutApp** is a framework for building apps using [KnockoutJS](http://knockoutjs.com/).

It's heavily inspired to [BackboneJS](http://backbonejs.org) and it's licensed under the MIT license.

If you find any bug, please report it (here [here](https://github.com/paglias/KnockoutApp/issues)).

#Getting Started

The last stable version is 0.1.1, which you can get [here](https://github.com/paglias/KnockoutApp/tree/0.1.1), the development happensa on the **master**.

Just include *knockout.app.min.js* in your html page to start using it (remember that KnockoutJS in necessary).

You can find documentation [here](https://github.com/paglias/KnockoutApp/blob/master/documentation.md).

Give a look to the [annotated source code](http://paglias.net/KnockoutApp/annotated-source-code/knockout.app.html) and to the [example](http://paglias.net/KnockoutApp/example/).

#Contributing

KnockoutApp uses [Grunt](http://gruntjs.com) as the build tool and [Docco](http://jashkenas.github.com/docco/) for generating annotated source code.

Contributions are welcome, just send a pull request targetting the **master** branch, to get older version use tags.

For general discussion, features request and bugs report use [Github Issues](https://github.com/paglias/KnockoutApp/issues)

#History

### 0.1.1:
 - fixes various bugs in KnockoutApp.Sync

 - now you can set a *modelName* property in the model so that the model properties sent via Ajax will be wrapped in an object which name is the
 value of *model.modelName* (useful for Ruby on Rails which expects parameters to be wrapped in an object es. task: {id: 1, name: "a task"})

 - KnockoutApp.Utils.unwrapValue now uses the code of Underscore.js's *result*

 - Added *package.json* to handle dependencies

 - Upgraded to Grunt 0.4

 - grunt-docco is incompatible with grunt 0.4 so the annotated source code has to be generated manually using *docco* from the command line, I hope to fix that in the next version.

### 0.1:
Initial release

#Credits

A big thank to [BackboneJS](http://backbonejs.org) for the inspiration given to that project (and also for the *extendClass* method that has been taken from it)!

Thank also to [Underscore.js](http://underscorejs.org/) to which all the credits for KnockoutApp.Utils.unwrapValue are due.

#License

KnockoutApp is licensed under the MIT License.