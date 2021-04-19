# react4xp-npm

<img src="media/react4xp.svg" alt="React4xp logo" title="React4xp logo" width="160px">

[React4xp](https://developer.enonic.com/templates/react4xp) monorepo for all the NPM dependency packages required by both [lib-react4xp](https://github.com/enonic/lib-react4xp/) and parent projects running react4xp (for example the [react4xp starter](https://market.enonic.com/vendors/enonic/react4xp-starter) and anything derived from it).

These packages (with this project's package names in _italics_) are:

- [react4xp-buildconstants](https://www.npmjs.com/package/react4xp-buildconstants) (_constants_)
- [react4xp-build-components](https://www.npmjs.com/package/react4xp-build-components) (_buildcomponents_)
- [react4xp-regions](https://www.npmjs.com/package/react4xp-regions) (_regions_)
- [react4xp-runtime-client](https://www.npmjs.com/package/react4xp-runtime-client) (_client_)
- [react4xp-runtime-externals](https://www.npmjs.com/package/react4xp-runtime-externals) (_externals_)
- [react4xp-runtime-nashornpolyfills](https://www.npmjs.com/package/react4xp-runtime-nashornpolyfills) (_nashornpolyfills_)

These packages don't need separate installation, they are bundled as dependencies of the main [react4xp package](https://www.npmjs.com/package/react4xp) (_react4xp_).

<br/><br/>

## Usage

**Not intended for standalone installation or use.** See the docs of each unique package, in the links above.

<br/><br/>

## Development

You'll need Gradle 5+ (a 6.2.1 gradle wrapper is included), Java JDK 11, Enonic XP 7+, and Node.

Use **Node 10** for development in this project _and in all projects when using `npm link` for linking to these packages locally_. Usually, that's when developing lib-react4xp.

NOTE: The commands `npm i` is meant to never be run in this project, should be avoided if possibl. The same goes for manually deleting _node_modules_ folders. Instead, package.json and build.gradle define scripts and tasks that handle NPM setup and interlinking with [CLI commands](#terminal-commands) that should always be **run from root**.

### Internal package dependencies

All the sub-packages mentioned above are dependencies of this main react4xp package. In addition, _react4xp-regions_ and _react4xp-buildconstants_ are dependencies of _react4xp-build-components_, and  _react4xp-buildconstants_ is a dependency of _react4xp-runtime-nashornpolyfills_:

<img src="media/react4xp-internal-dependencies.png" alt="React4xp internal package dependencies" title="React4xp internal package dependencies" width="1000px">

### Important: git

When committing to git, please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) pattern in your messages, at least use `feat:` and `BREAKING CHANGE`. Also leave tags and all versioning to [lerna](https://github.com/lerna/lerna) with the _version_ NPM script (see below) - which depends on using git this way.

### Terminal commands

#### NPM setup

**From the project root**, handles the entire file structure: triggers the same tasks in subprojects under /packages/, where needed. Only sets up NPM basis, ready for [actual project building](#project-building).

  - `npm run setup`: initial NPM install, run this first. When this is done, _node_modules_ have been installed across all subprojects, and interlinked.

  - `npm run npmInstall` (or `gradlew npmInstall`): When `npm run setup` has been run once and _node_modules_ exists in the project root, using the `npmInstall` script updates and re-links the NPM packages but skips initial boilerplate setup to save a little time.

  - `npm run clean`: NPM cleanup. Removes links and node_modules across all subprojects, including the project root. Does not clean up any files from the actual [project build](#project-building).

<a name="npm-structure"></a>
#### NPM structure

After the NPM script `npmInstall` (and `setup`, which runs it after installing boilerplate), the state is ready for local development of this project _and_ for local development of lib-react4xp which uses all these projects - and usually downloads them from NPM but can now use `npm link react4xp` etc for using these packages without having to publish them to NPM before seeing them in action.

Thins ready state should be:

  - All NPM packages for both main project setup _and all subprojects_ are found in _(project root)/node_modules_.
  - _node_modules_ in all subpackages ar symlinked to _(project root)/node_modules_ (using [symlink-dir](https://www.npmjs.com/package/symlink-dir) for cross-platform symlinking).
  - Each of the subprojects have their own symlink under _(project root)/node_modules_ - taking care of cross-dependencies.
  - A marker file, _npmLinked.marker_, is created under _packages/react4xp_. This only serves to speed up the NPM istall: gradle skips this step if this marker exists.
  - NOTE: this creates a **circular symlink graph**. So far this has not been a problem as long as these CLI commands are used. But be aware of it.


<a name="project-building"></a>
#### Building

Again, these commands are only used **from the project root**:

  - `gradlew build`: main build command: builds file structure ready for testing and publishing to NPM

  - `gradlew test`: main test command

  - `gradlew clean`: deletes everything built by gradle (but leaves the [NPM structure](#npm-structure) alone).


#### Publishing

  - `gradlew versionAndPublish [ -Pdry ] [ -Pmessage='...' ]`: Auto-versions all changed packages, and publishes to NPM, after updating internal cross-dependency references. After committing your changes, run this to let [lerna](https://github.com/lerna/lerna) handle independent versioning in the packages, by tracking changes across them (use **[conventional-commit](https://www.conventionalcommits.org/en/v1.0.0/) flags** from your commit messages to track major:minor:patch versions), tagging the commit and auto-updating version tags everywhere. IMPORTANT: before running `version`, you should have run the `test` task. And after `versionAndPublish`, verify that the react4xp-* references in all packages/*/package-lock.json files are up-to-date (i.e. don't still refer to the previous versions for their dependencies). Further description in comments in [versionAndPublish.gradle](https://github.com/enonic/react4xp-npm/blob/master/versionAndPublish.gradle). Optional parameters:
    - `-Pdry`: dry-run
    - `-Pmessage='...'`: Common description of the entire release for all changed packages, will be used in commit messages to clarify and group the multiple commits that will occur during the process.

