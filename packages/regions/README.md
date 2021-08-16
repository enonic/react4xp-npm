# react4xp-regions

Supplies standard opt-in JSX components, utility entries and subcomponents for allowing react4xp to render XP parts,
pages and layouts containing regular XP regions.

These are opt-in: developers must refer to them in code. See below.

Supplied uncompiled as raw source files, expected to be (automatically) handled by the React4xp package when used.

## Usage

**Not really intended for separate installation or use outside of React4xp.** Part of
the [react4xp NPM bundle](https://www.npmjs.com/package/react4xp). Better start with
the [React4xp introduction](https://developer.enonic.com/templates/react4xp).

### Two kinds of components

#### 1. Nest-able react components

`ComponentTag`, `Region` and `Regions` are react components intended to be imported in react4xp entries or nested in
other react components:

- `ComponentTag`: Renders an HTML tag inside a Region, that will refer to an added XP component (part, layout or
  anything that may be put inside an XP region). This tag will be picked up by XP _on the server side_ and be replaced
  with the inserted XP component. This probably can't be used meaningfully outside of a Region component like the
  supplied one described below.

  Props:
  - `component` (mandatory object): The component data object (e.g. an item in the XP
    array `content.page.regions.main.components`). Must contain a `path` string attribute referring to the component
    path in XP.

- `Region`: A single react-rendered XP region where XP components can be dragged and dropped in content studio. In
  current react4xp version: must be **server-side-rendered** for all contained components to appear and be correctly
  activated.

  Props:
  - `name` (mandatory string): Region name, as defined in an XP XML definition,
  - `regionData` (mandatory object): data object for this specific region, from part or page or layout data. E.g. for
    the `main` region in a page, regionData could be: `content.page.regions.main` from an XP controller.
  - `tag` (optional string): Sets the containing HTML tag for the region, without `<` or  `>`. If omitted, `"div"` is
    the default.
  - `addClass` (optional string): If set, adds an HTML class for the region, after the `"xp-region"` class.

- `Regions`: Shorthand component for defining an array of `Region` components at once. In current react4xp version: must
  be **server-side-rendered** for all contained components to appear and be correctly activated.

  Props:
  - `regionsData` (mandatory object): regions data object containing multiple regions, e.g. `content.page.regions` from
    an XP controller. Keys are region names, values are region data (see `regionData` above).
  - `names` (optional string or array of strings): selects to display only one, or some specific, of the available
    regions in the `regionsData`. The array _defines a sequence_, so this can also be used to display the regions
    in `regionsData` in a specific order. If omitted, all regions are displayed in the order
    of `Object.keys(regionsData)`.
  - `tags` (optional string or object): HTML tag for the region elements, see `Region.tag` above. If string, all regions
    get that tag. If object: keys are region names, values are an HTML tag string for that region.
  - `classes` (optional boolean, string or object): HTML class for each region element, added after "xp-region".
    See `Region.addClass` above. If boolean, and it's true: adds a class that is _the same as the name of the region_.
    If string, all regions get that same class. If object: keys are region names, values are the class name string for
    that region.

**Usage:** import and use these in JSX source files, e.g:

```jsx harmony
import Region from 'react4xp-regions';

return props => <Region regionsData={props.regionsData}/>;
```

#### 2. React4xp entries

In `entries/react4xp-regions` you'll find two react4xp entries: `Layout` and `Page`. These contain Regions (that can
contain any XP component that you'd normally put into an XP region - as long as you render them _server-side_!). They
are ready to use for simple purposes (prototyping etc), or serve as usage examples for you to expand from.

- `Layout`: bare-bone generic XP layout with regions. Should be rendered server-side. Can be used as a wrapping
  component, nesting regular react children: `<Layout><h2>A layout!</h2></Layout>`

  Props:
  - `regionsData` (optional object, although layouts make little sense without regions): regions data object (
    e.g. `component.regions`). Keys are region names, values are region data. Same as `Regions.regionsData` above.
  - `regionNames` (optional string or array of strings): selects to display only one, or some specific, of the available
    regions in the regions data, in that order. Same as  `Regions.names` above.
  - `regionClasses` (optional boolean, string or object): HTML class for the region elements, added after "xp-region".
    Same as `Regions.classes` above.
  - `containerTag`: (optional string): the HTML tag of the layout's outer container element, without `<` or `>`.
    Default: `'div'`.
  - `containerClass` (optional string): added HTML class of the layout's outer container element. No default.
  - `children` (optional React component(s)):
    regular [nested react components](http://buildwithreact.com/article/component-children).
  - `childrenAfterRegions` (optional boolean): if false or omitted, children will be rendered first in the layout's
    body, before the regions. If true, they will be rendered after the regions.

- `Page`: bare-bone generic XP page view with regions. Should be rendered server-side. Can be used as a wrapping
  component, neating regular react children: `<Page title="Page title"><h1>A heading!</h1></Page>`. **Important:**
  Renders a `<head>...</head>` and a `<body>...</body>` section, NOT the containing `<html>` element or leading
  meta-tags, because of restrictions in react. Add them yourself to use this properly!

  Props:
  - `title` (optional string) Page title string.
  - `regionsData` (optional object): regions data object (e.g. `content.page.regions` from the page controller). Keys
    are region names, values are region data. Same as `Regions.regionsData` above.
  - `regionNames` (optional string or array of strings): selects to display only one, or some specific, of the available
    regions in the regions data, in that order. Same as  `Regions.names` above.
  - `regionClasses` (optional boolean, string or object): HTML class for the region elements, added after "xp-region".
    Same as `Regions.classes` above.
  - `children` (optional React component(s)):
    regular [nested react components](http://buildwithreact.com/article/component-children).
  - `childrenAfterRegions` (optional boolean): if false or omitted, children will be rendered first in the layout's
    body, before the regions. If true, they will be rendered after the regions.

**Usage:** both are used as react4xp-rendered views for an XP layout or page, called from an XP controller with their
jsxPaths: `react4xp-regions/Layout` or  `react4xp-regions/Page`.

```ecmascript 6
import React4xp from 'lib/enonic/react4xp';

module.exports.get = req => {

  // (...)

  return React4xp.render('react4xp-regions/Page', props, request);
}
```
