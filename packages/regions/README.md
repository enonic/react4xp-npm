# react4xp-regions

**React4xp components for handling XP regions, and bare-bone page/layout entries with regions supported/included**

Contains raw JSX files meant to be _automatically detected and compiled_ in a standard Enonic XP project with React4xp (such as [the React4xp starter](https://developer.enonic.com/templates/react4xp)).

**Prerequisites** for auto-detecting and -compilation are these package versions in the parent project:
* **react4xp-buildconstants**: version 0.8.0 or above,
* **react4xp-build-components**: version 0.6.0 or above.


[The React4xp library](https://github.com/enonic/lib-react4xp) (version **0.5.1** and above) has functions for using these directly, for example rendering a page controller with regions, with minimal boilerplate.

Current versions of XP (6.x, 7.0, 7.1 and probably 7.2) require the regions (that is, the entry containing them) to be rendered on the server side (so, don't activate `clientRender: true`), and the rendered result of that to be part of the `body` field in the controller's returned response (so, don't insert the rendered result into a different React4xp entry that is rendered with `clientRender: true`).  


## Install

```bash
npm add --save-dev react4xp-regions
```

Also check your project's `package.json`: if `react4xp-buildconstants` or `react4xp-build-components` versions are too low, they need to be upgraded similar to this.

## Usage

After adding this package and building the project, these templates are compiled _as if they were located in the React4xp project_ under `src/main/resources/react4xp`. This means:

* JSX files under `entries` in this package become React4xp entries with jsxPaths relative to this package's `entries` directory:
  - `Page.jsx` has the jsxPath `react4xp-regions/Page`, etc.
* and the rest become `import`-able from `react4xp-regions` in ES6 and JSX, relative to this package's `src` directory:
  - `Region.jsx` is importable as `react4xp-regions/Region`, etc.


In a page controller:

```javascript
const React4xp = require('/lib/enonic/react4xp');
const portal = require('/lib/xp/portal');

exports.get = request => {
	const content = portal.getContent();
	return React4xp.render(
	    'react4xp-regions/Page', {		// <-- jsxPath 
		    content,
		    regions: "main" 
		}, request
	);
}
```

In an entry (before compilation):

```javascript
import React from 'react';
import Region from 'react4xp-templates/Region';	 // <-- regular webpack import path (not jsxPath)

return (props) => <Region {...{props}} />;
```
