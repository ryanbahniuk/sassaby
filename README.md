# Sassafras
A Unit Testing Library for SASS

Sassafras is a unit testing library for SASS mixins and functions. It is written in Node to provide a consistent interface with other front-end tests in your system and for easy integration into a build system. It provides an interface for testing these SASS features and can be used with any Node testing library (Mocha, Jasmine, etc.).

## Installation

Install via npm:

 ```sh
npm install --save-dev sassafras
 ```

## Setup

Setting up Sassafras is simple with easy integration into your existing Javascript testing library. After installation, simply require it at the top of the file, extract the assert object, and set the .sass or .scss file that you want to include. Here is a sample file using Mocha.

```js
var sassafras = require('sassafras');
var assert = sassafras.assert;

describe('sample.scss', function() {
  sassafras.setFile(__dirname + '/sample.scss');

  describe('#appearance', function() {
    it('should have a webkit prefixed declaration', function() {
      assert.includedMixin("appearance(button)").declares("-webkit-appearance", "button");
    });
  });
});
```

Note that `sassafras.setFile` takes the absolute path to the SASS file. We recommend using Node's `__direname` plus the remaining path here. Also, note that this file must *ONLY* include SASS function and mixin declarations. Any code that compiles to CSS in this file will cause Sassafras' parsers to give inconsistent results.

## Features

Sassafras breaks down testable features into three categories:

* Functions
* Standalone Mixins
* Included Mixins

Functions are your typical SASS functions, defined like this:

```scss
@function rems($pxsize, $rembase) {
  @return ($pxsize/$rembase)+rem;
}
```

Standalone Mixins are mixins that define new rules, like this:

```scss
@mixin align-right($label) {
  .align-right-#{$label} {
    justify-content: flex-end;
  }
}
```

Included Mixins are mixins that do not define new rules, just declarations that should be placed into existing rules. For example:

```scss
@mixin appearance($value) {
  -webkit-appearance: $value;
  -moz-appearance: $value;
  appearance: $value;
}
```

## Rules

Each of these types has their own set of functions, or rules, that assert certain conditions on the result of the function or mixin.

### Function Rules

#### equals
Asserts that the function output equals a certain value.
```js
assert.func('rems(32px, 16px)').equals('2rem');
```

#### doesNotEqual
Assert that the function output does not equal a certain value.
```js
assert.func('rems(32px, 16px)').doesNotEqual('3rem');
```

#### isTrue
Assert that the function output equals true.
```js
assert.func('returns-true(true)').isTrue();
```

#### isFalse
Assert that the function output equals false.
```js
assert.func('returns-false(false)').isFalse();
```

#### isTruthy
Assert that the function output is a truthy value in SASS.
```js
assert.func('returns-truthy("string")').isTruthy();
```

#### isFalsy
Assert that the function output is a falsy value in SASS.
```js
assert.func('returns-falsy(null)').isFalsy();
```


### Standalone Mixin Rules

#### createsSelector
Assert that the mixin creates the given selector.
```js
assert.standaloneMixin('align-right(md)').createsSelector('.align-right-md');
```

#### doesNotCreateSelector
Assert that the mixin does not create the given selector.
```js
assert.standaloneMixin('align-right(md)').doesNotCreateSelector('.align-right-lg');
```

#### hasNumDeclarations
Assert that the mixin creates the given number of declarations.
```js
assert.standaloneMixin('align-right(md)').hasNumDeclarations(1);
```

#### declares
Assert that the mixin makes a declaration of the given rule-property pair.
```js
assert.standaloneMixin('align-right(md)').declares('justify-content', 'flex-end');
```

#### doesNotDeclare
Assert that the mixin does not make a declaration of the given rule-property pair.
```js
assert.standaloneMixin('align-right(md)').doesNotDeclare('text-align', 'right');
```

#### equals
Assert that the mixin output equals the given string.
```js
assert.standaloneMixin('align-right(md)').equals('.align-right-md { justify-content: flex-end; }');
```

#### doesNotEqual
Assert that the mixin output does not equal the given string.
```js
assert.standaloneMixin('align-right(md)').doesNotEqual('.align-right-lg { justify-content: flex-end; }');
```

#### calls
Assert that the mixin calls another mixin.
```js
assert.standaloneMixin('build-alignments(md)').calls('align-right(md)');
```

#### doesNotCall
Assert that the mixin does not call another mixin.
```js
assert.standaloneMixin('build-alignments(md)').doesNotCall('align-right(lg)');
```


### Included Mixin Rules

#### hasNumDeclarations
Assert that the mixin creates the given number of declarations.
```js
assert.includedMixin('appearance(button)').hasNumDeclarations(3);
```

#### declares
Assert that the mixin makes a declaration of the given rule-property pair.
```js
assert.includedMixin('appearance(button)').declares('-webkit-appearance', 'button');
```

#### doesNotDeclare
Assert that the mixin does not make a declaration of the given rule-property pair.
```js
assert.includedMixin('appearance(button)').doesNotDeclare('-o-appearance', 'button');
```

#### equals
Assert that the mixin output equals the given string.
```js
assert.includedMixin('appearance(button)').equals('-webkit-appearance: button; -moz-appearance: button; appearance: button;');
```

#### doesNotEqual
Assert that the mixin output does not equal the given string.
```js
assert.includedMixin('appearance(button)').doesNotEqual('appearance: button;');
```

#### calls
Assert that the mixin calls another mixin.
```js
assert.includedMixin('appearance(button)').calls('prefixer(button)');
```

#### doesNotCall
Assert that the mixin does not call another mixin.
```js
assert.includedMixin('appearance(button)').doesNotCall('prefixer(-webkit-button)');
```

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it. Continuous Integration is handled by [Travis](https://travis-ci.org/ryanbahniuk/sassafras "Travis")

## License

MIT © Ryan Bahniuk

[ci]:      https://travis-ci.org/ryanbahniuk/sassafras
[npm]:     https://www.npmjs.com/package/sassafras