# PyTrees Viz

A javascript library for visualisation and monitoring of behaviour trees.

It is not an editor and is also not restricted to a py_tree flavoured behaviour tree either.

The incoming serialisation of a tree and it's state requires only elements common to behaviour trees. Any implementation specific data can be encapsulated in a key-value dictionary that is appropriately formatted in an agnostic way inside the web application.

While the actual functionality is provided via `py_trees.js` and `py_trees.css`, a hybrid Qt-JS application is used for the purposes of development and demonstration.

![Status Highlights](images/screenshot.png?raw=true "Rendering a Tree")

## Roadmap

This is a work-in-progress. See the [Projects](https://github.com/splintered-reality/py_trees_viz/projects?query=is%3Aopen+sort%3Acreated-asc) page for progress and planned milestones.

## Development

For the moment, there are no dependencies other than PyQt5 so a simple
virtualenv suffices (note: using the system's PyQt5 since that is easier
than compiling it inside the virtualenv):

```
. ./virtualenv.bash
```

Currently launching the qt-js application will fire up the app with a demo tree
supplied by the `py_trees.js` library itself:

```
$ py-trees-viewer
```

To launch with a js console, the qt webengine requires an environment
variable to be configured and a browser window to tune into the application.
None of that is necessary to know though, just run the script:

```
$ ./scripts/py-trees-viewer-devel
```

