# Changelog

## Version 2.1.0

* Adds support for mixins that take blocks. Adds `calledWithBlock` and `calledWithBlockAndArgs` functions to set this up.
* Deprecates `calledWith` in favor of `calledWithArgs`.
* Adds `called` for calls without arguments.
* Adds `imports` and `doesNotImport` assertions at the file level for testing entry point files.
* Adds `createFontFace` and `doesNotCreateFontFace` for standalone mixins to test creation of a `@font-face` rule.
* Adds `createsMediaQuery` and `doesNotCreateMediaQuery` for standalone mixins to test creation of a `@media` directive.
* Fixes bug for standalone mixins which may not create a selector (for example `@font-face` rules).

## Version 2.0.0

* Performance upgrades
* Decoupled mixin/function call from arguments. Arguments are now added with the `calledWith` function. Now it is easier to test different arguments of the same mixin/function and is clear when SASS compilation happens (easier to optimize your tests for speed).
* Each sassaby test file is now an instance of the Sassaby class. This fixes a bug that was persisting test state between files in the suite.

## Version 1.0.2
Initial Release


