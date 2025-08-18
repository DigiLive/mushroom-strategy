Change Log
====================================================================================================
All notable changes will be documented in this file.
`version-bump-prompt` adheres to [Semantic Versioning](http://semver.org/).



[v6.1.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v6.1.0) (2020-08-29)
----------------------------------------------------------------------------------------------------

- Merged [PR #40](https://github.com/JS-DevTools/version-bump-prompt/pull/40), which adds an `--ignore-scripts` argument. Just like the same argument in NPM, it skips running the `preversion`, `version`, and `postversion` scripts in your package.json

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v6.0.6...v6.1.0)



[v6.0.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v6.0.0) (2020-01-28)
----------------------------------------------------------------------------------------------------

### Breaking Changes

- Dropped support for Node 8.  Now requires Node 10+

### Other Changes

- The "version-bump-prompt" package is now just a wrapper around the scoped "@jsdevtools/version-bump-prompt" package

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v5.0.7...v6.0.0)



[v5.0.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v5.0.0) (2019-03-10)
----------------------------------------------------------------------------------------------------

### Breaking Changes

- Completely rewritten CLI with new argument syntax.  See [the docs](https://jstools.dev/ez-spawn/) for details.

- Arguments like `--major` and `--minor` have been replaced with a positional argument.  So `bump --major` becomes `bump major`.

- The `--prompt` argument is no longer needed.  It's now the default.  If you want, you can explicitly specify it as a positional argument (e.g. `bump prompt`)

- The `--lock` argument is no longer needed.  The `package-lock.json` file is now updated by default.

- The `--grep` argument is no longer needed. Just provide a list of file names and/or globs for version-bump-prompt to update. So `bump --grep ReadMe.md` becomes `bump ReadMe.md`.

- Previously, version-bump-prompt _always_ updated `package.json`, `bower.json`, and `component.json` if they existed. Now it updates `package.json` and `package-lock.json` by default if they exist. You can override the default by explicitly specifying the files (e.g. `bump bower.json package.json ReadMe.md`)

### Other Changes

- Completely rewritten in TypeScript

- Version-Bump-Prompt now includes a Node.js API, so you can use it programmatically instead of just as a CLI

- You now have full control over the git commit message and tag name. The `--commit` and `--tag` arguments accept an optional string with `%s` placeholders, which will be replaced with the version number. This matches the behavior of the [npm version command](https://docs.npmjs.com/cli/version.html).

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v4.2.2...v5.0.0)



[v4.2.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v4.2.0) (2018-09-30)
----------------------------------------------------------------------------------------------------

- Output of [npm version scripts](https://docs.npmjs.com/cli/version) is now shown.  Thanks to [@didoo](https://github.com/didoo) for [the PR](https://github.com/JS-DevTools/version-bump-prompt/pull/27)!

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v4.1.0...v4.2.0)



[v4.1.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v4.1.0) (2017-11-15)
----------------------------------------------------------------------------------------------------

- Added `--lock` option to update the `package-json.lock` file in addition to manifest files.  See [issue #20](https://github.com/JS-DevTools/version-bump-prompt/issues/20) for details.  Thanks to [@browniebroke](https://github.com/browniebroke) for [the PR](https://github.com/JS-DevTools/version-bump-prompt/pull/23/files)!

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v4.0.0...v4.1.0)



[v4.0.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v4.0.0) (2017-11-15)
----------------------------------------------------------------------------------------------------

- Dropped support for Node v4.x since it's no longer supported by [`inquirer`](https://www.npmjs.com/package/inquirer). As a result, Version-Bump-Prompt now only supports Node v6+.  You can continue using Version-Bump-Prompt v3.x on Node 4.

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v3.0.0...v4.0.0)



[v3.0.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v3.0.0) (2016-12-25)
----------------------------------------------------------------------------------------------------

Two big changes in this version:

- Dropped support for Node v0.x
- The `--prompt` option now allows you to manually enter a version, rather than only selecting from the listed options
- Added support for [npm version scripts](https://docs.npmjs.com/cli/version). (big thanks to [szarouski](https://github.com/szarouski) for his [PR](https://github.com/JS-DevTools/version-bump-prompt/pull/17))<br> The scripts are run the same order as the `npm version` command:
  - The `preversion` script runs before the version is updated (and before the version prompt is shown)
  - The `version` script runs after the version is updated, but _before_ `git commit` and `git tag`
  - The `postversion` script runs after `git commit` and `git tag`, but _before_ `git push`

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v2.0.0...v3.0.0)



[v2.0.0](https://github.com/JS-DevTools/version-bump-prompt/tree/v2.0.0) (2016-11-29)
----------------------------------------------------------------------------------------------------

A couple of changes to make `version-bump-prompt` behave more like the `npm version` command:

- The `--tag` option now creates an [annotated git tag rather than a lightweight tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Creating-Tags).

- The `--tag` option now follows the same naming convention as the `npm version` command. The tag name is `vX.X.X` (same as before), and the commit message is `X.X.X` (no "v" prefix).

[Full Changelog](https://github.com/JS-DevTools/version-bump-prompt/compare/v1.7.2...v2.0.0)
