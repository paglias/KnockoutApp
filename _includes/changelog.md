<h1 class="page-header">Changelog</h1>

## 0.2.1, 0.2.2, 0.2.3, 0.2.4

- new build process

- integration with Travis CI

- tests updated to work with jQuery 1.9

- `collection.fetch` uses `collection.reset`

## 0.2.0

- `collection.find`

- `collection.where`

- `collection.reset`

- `model.idAttribute`

- `model.destroy` now doesn't wait for a server response until `wait: true` is passed as an option

- model support passing a more generic `options` (where you can set `collection`) instead of `collection` as the second parameter

- removed `Utils.wrapError`, plan to make something better in the next release

- added **tests**

- can be loaded as an **AMD** or **CommonJS** module

- `collection.model` isn't defined anymore by passing it as a parameter when creating

- error if missing `url` when using `KnockoutApp.Sync`

- `defaultAttributes` renamed to `defaults` and doesn't need to be a function anymore

- added `Utils.cloneObjKnockout`

- npm module published

## 0.1.1

- fixes various bugs in KnockoutApp.Sync

- now you can set a modelName property in the model so that the model properties sent via Ajax will be wrapped in an object which name is the value of   model.modelName (useful for Ruby on Rails which expects parameters to be wrapped in an object es. task: {id: 1, name: "a task"})

- KnockoutApp.Utils.unwrapValue now uses the code of Underscore.js's result

- Added package.json to handle dependencies

- Upgraded to Grunt 0.4

- grunt-docco is incompatible with grunt 0.4 so the annotated source code has to be generated manually using docco from the command line, I hope to fix that in the next version.

## 0.1.0

- Initial release