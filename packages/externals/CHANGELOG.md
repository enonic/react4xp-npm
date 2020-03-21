# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.2](https://github.com/enonic/react4xp-npm/compare/react4xp-runtime-externals@0.5.1...react4xp-runtime-externals@0.5.2) (2020-03-21)

**Note:** Version bump only for package react4xp-runtime-externals





# 0.5.0 (2020-03-21)


### Bug Fixes

* Option to run externals/webpack.config.js with an --env.ROOT cli arg (fullpath root project path), resolving the root's node_modules. Result: externals doesn't need to ship its own react / react-dom copy. ([408269e](https://github.com/enonic/react4xp-npm/commit/408269ecbd2806ebe948c6a9dbc3835f5319dd4f))


### Features

* Added env.ROOT cli argument for externals and client too. Moved excessive logging (confirmed that multiple instances of react is not the problem causing the hooks issue). Added externals for client (hardcoded - should really come from buildconstants). ([232a963](https://github.com/enonic/react4xp-npm/commit/232a963d6afe7bd354ef6ee448102830a9863bc6))
