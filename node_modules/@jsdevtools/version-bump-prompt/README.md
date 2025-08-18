# Version Bump Prompt

[![Cross-Platform Compatibility](https://jstools.dev/img/badges/os-badges.svg)](https://github.com/JS-DevTools/version-bump-prompt/actions)
[![Build Status](https://github.com/JS-DevTools/version-bump-prompt/workflows/CI-CD/badge.svg)](https://github.com/JS-DevTools/version-bump-prompt/actions)

[![Coverage Status](https://coveralls.io/repos/github/JS-DevTools/version-bump-prompt/badge.svg?branch=master)](https://coveralls.io/github/JS-DevTools/version-bump-prompt)
[![Dependencies](https://david-dm.org/JS-DevTools/version-bump-prompt.svg)](https://david-dm.org/JS-DevTools/version-bump-prompt)

[![npm](https://img.shields.io/npm/v/@jsdevtools/version-bump-prompt.svg)](https://www.npmjs.com/package/@jsdevtools/version-bump-prompt)
[![License](https://img.shields.io/npm/l/@jsdevtools/version-bump-prompt.svg)](LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/JS-DevTools/version-bump-prompt)

![Screenshot](https://jstools.dev/version-bump-prompt/img/screenshot.gif)



### Automate your release process with a single command that can:

- Prompt for the type of version bump

- Bump the version number **any** file, including:
    -  `package.json`
    -  `package-lock.json`
    -  config files
    -  source code files
    -  ReadMe files
    -  license files

- Run your `preversion`, `version`, and `postversion` scripts

- Commit changes to git

- Tag the commit with the version number

- Push the commit to remote



Installation
--------------------------
You can install `version-bump-prompt` via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install -g @jsdevtools/version-bump-prompt
```



Usage
--------------------------

```
bump [release] [options] [files...]

Automatically (or with prompts) bump your version number, commit changes, tag, and push to Git

release:
  The release version or type.  Can be one of the following:
   - A semver version number (ex: 1.23.456)
   - prompt: Prompt for the version number (this is the default)
   - major: Increase major version
   - minor: Increase minor version
   - patch: Increase patch version
   - premajor: Increase major version, pre-release
   - preminor: Increase preminor version, pre-release
   - prepatch: Increase prepatch version, pre-release
   - prerelease: Increase prerelease version

options:
  --preid <name>            The identifier for prerelease versions.
                            Defaults to "beta".

  -c, --commit [message]    Commit changed files to Git.
                            Defaults to "release vX.X.X".

  -t, --tag [tag]           Tag the commit in Git.
                            The Default tag is "vX.X.X"

  -p, --push                Push the Git commit.

  -a, --all                 Commit/tag/push ALL pending files,
                            not just the ones that were bumped.
                            (same as "git commit -a")

  --no-verify               Bypass Git commit hooks
                            (same as "git commit --no-verify")

  -v, --version             Show the version number

  -q, --quiet               Suppress unnecessary output

  -h, --help                Show usage information

  --ignore-scripts          Bypass version scripts

files...
  One or more files and/or globs to bump (ex: README.md *.txt docs/**/*).
  Defaults to package.json and package-lock.json.
```



Examples
--------------------------

### Default Behavior (no arguments)

```
bump
```

When run without any arguments, the `bump` command will do the following:

- Prompt the user to select the bump type (major, minor, prerelease, etc.)
- Update the version number in `package.json` and `package-lock.json`
- Run any [npm version scripts](https://docs.npmjs.com/cli/version.html) (`preversion`, `version`, or `postversion`)
- It will **NOT** commit, tag, or push to git.


### Bump Without Prompting
You can specify an explicit version number:

```
bump 1.23.456
bump 1.23.456-beta.1
```

Or you can specify a release type:

```
bump major
bump patch
bump prerelease
```

For pre-releases, the default identifier is "beta".  You can change it using the `--preid` argument:

```
bump premajor --preid alpha
```

All of the above commands do the following:

- Update the version number in `package.json` and `package-lock.json`
- Run any [npm version scripts](https://docs.npmjs.com/cli/version.html) (`preversion`, `version`, or `postversion`)
- It will **NOT** commit, tag, or push to git.



### Git Commit
You can use the `--commit` argument by itself to prompt the user for the version number. If you don't specify a commit message, then it defaults to "**release vX.X.X**". If you _do_ specify a commit message, then the version number will be appended to it.  Or you can insert `%s` placeholders in the message, and they'll be replaced with the version number instead.

```
bump --commit
bump --commit "This is release v"
bump --commit "The v%s release"
```

You can also specify a release type instead of prompting the user:

```
bump major --commit
bump minor --commit "This is release v"
bump patch --commit "The v%s release"
```

The above commands do the following:

- Update the version number in `package.json` and `package-lock.json`
- Run any [npm version scripts](https://docs.npmjs.com/cli/version.html) (`preversion`, `version`, or `postversion`)
- Commit the `package.json` and `package-lock.json` files to git
- The commit will **NOT** be tagged
- The commit will **NOT** be pushed to the remote


### Git Tag
The `--commit` argument does not tag the commit by default. You can use the `--tag` argument to do that.  You can optionally specify a tag name, which can contain `%s` placeholders, just like the commit message.

You don't need to specify the `--commit` argument, since it's implied by `--tag`.  Unless you want to customize the commit message.

```
bump --tag
bump major --tag "v%s tag"
bump patch --commit "release v" --tag "v"
```

The above commands do the following:

- Update the version number in `package.json` and `package-lock.json`
- Run any [npm version scripts](https://docs.npmjs.com/cli/version.html) (`preversion`, `version`, or `postversion`)
- Commit the `package.json` and `package-lock.json` files to git
- Tag the commit
- The commit will **NOT** be pushed to the remote


### Git Push
The `--push` argument pushes the git commit and tags.

```
bump --commit --push
bump major --tag --push
bump patch --tag "v%s tag" --push
bump prerelease --commit "release v" --tag "v" --push
```


### Specifying Files to Update
All of the `bump` commands shown above operate on the `package.json` and `package-lock.json` files by default. You can specify a custom list of files and/or [glob patterns](https://www.npmjs.com/package/glob#glob-primer) to update instead.

> **Note:** If you specify your own file list, then the `package.json` and `package-lock.json` files will **not** be updated by default. You need to explicitly include them in your file list if you want them updated.

```
bump README.md
bump package.json package-lock.json README.md
bump *.json *.md
```



Version Scripts
--------------------------
`version-bump-prompt` will execute your `preversion`, `version`, and `postversion` scripts, just like [the `npm version` command](https://docs.npmjs.com/cli/version) does. If your `package.json` file contains any or all of these scripts, then they will be executed in the following order:

  - The `preversion` script runs before the version is updated (and before the version prompt is shown)
  - The `version` script runs after the version is updated, but _before_ `git commit` and `git tag`
  - The `postversion` script runs after `git commit` and `git tag`, but _before_ `git push`



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [Open an issue](https://github.com/JS-DevTools/version-bump-prompt/issues) on GitHub and [submit a pull request](https://github.com/JS-DevTools/version-bump-prompt/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/JS-DevTools/version-bump-prompt.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`



License
--------------------------
Version Bump Prompt is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.

This package is [Treeware](http://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/JS-DevTools/version-bump-prompt) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![GitHub](https://jstools.dev/img/badges/github.svg)](https://github.com/open-source)
[![NPM](https://jstools.dev/img/badges/npm.svg)](https://www.npmjs.com/)
[![Coveralls](https://jstools.dev/img/badges/coveralls.svg)](https://coveralls.io)
[![Travis CI](https://jstools.dev/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jstools.dev/img/badges/sauce-labs.svg)](https://saucelabs.com)
