# PyTrees Js

Javascript libraries for visualisation and monitoring of behaviour trees.

Despite primarily catering for use cases with py_trees, these libraries
can be used for behaviour trees in general since it requires only properties
common to most behaviour tree implementations and flexibly opts into implementation
specific data via passing of a key-value dictionary that is appropriately
formatted in an implemenation-agnostic manner inside the web application.

This repository also includes a hybrid Qt-JS application used for development and demonstration purposes.

![Splash Screen](images/splash.png?raw=true "Splash Screen")
![Rendering a Tree](images/screenshot.png?raw=true "Rendering a Tree")

## Roadmap

This is a work-in-progress. See the [Projects](https://github.com/splintered-reality/py_trees_js/projects?query=is%3Aopen+sort%3Acreated-asc) page for progress and planned milestones.

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
$ py-trees-demo-viewer
```

To launch with a js console, the qt webengine requires an environment
variable to be configured and a browser window to tune into the application.
None of that is necessary to know though, just run the script:

```
$ ./scripts/py-trees-devel-viewer
```

