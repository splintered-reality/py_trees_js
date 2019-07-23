# Py Trees ROS Viewer

Qt-Javascript hybrid application for viewing or replaying executing py_trees.

![Status Highlights](images/screenshot.png?raw=true "Rendering a Tree")

## Roadmap

This is a work-in-progress. See the [Projects](https://github.com/splintered-reality/py_trees_ros_viewer/projects?query=is%3Aopen+sort%3Acreated-asc) page for progress and planned milestones.

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

