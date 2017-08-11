cytoscape-compound-collapse
================================================================================


## Description

Collapse&#x2F;expand functionality for compound nodes in Cytoscape.js.

Based on the paper:

```
U. Dogrusoz and B. Genc, "A Multi-Graph Approach to Complexity Management in Interactive Graph Visualization", Computers & Graphics, 30(1), pp. 86-97, 2006.

```


## Dependencies

 * Cytoscape.js ^3.0.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-compound-collapse`,
 * via bower: `bower install cytoscape-compound-collapse`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import compoundCollapse from 'cytoscape-compound-collapse';

cytoscape.use( compoundCollapse );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let compoundCollapse = require('cytoscape-compound-collapse');

cytoscape.use( compoundCollapse ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-compound-collapse'], function( cytoscape, compoundCollapse ){
  compoundCollapse( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.

## Meta edges
Let N be the node to collapse.

Let NB be the set of nodes that is not a descendant of N

When a compound node N is collapsed, each edge connecting a descendant of N to a node in NB will be replaced with a ```meta edge```.  Edges that connect {NB, Descendant of N} will now point to {NB, N}.


## Classes

* ```compoundcollapse-meta-edge```: meta edges will have this class

## Events
Node to expand fires events before/after the expand operation:

* compoundCollapse.beforeExpand
* compoundCollapse.afterExpand

Node to collapse fires events before/after the collapse operation:

* compoundCollapse.beforeCollapse
* compoundCollapse.afterCollapse


## Collection API
This extension adds the following methods to cytoscape.js elements

### Expand

* ```node.expand()```: Expand the given node, remove applicable meta edges, restore original endpoints.
* ```node.collapse()```: Collapse the given node, replace original edges with meta edges.
* ```node.isCollapsed()```: Check if a node is collapsed.
* ```node.isExpanded()```: Check if a node is expanded.
* ```edges.metaEdges()```: Return the meta edges from the collection of edges.


## Build targets

* `npm run test` : Run Mocha tests in `./test`
* `npm run build` : Build `./src/**` into `cytoscape-compound-collapse.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-compound-collapse https://github.com/d2fong&#x2F;cytoscape.js-compound-collapse.git`
