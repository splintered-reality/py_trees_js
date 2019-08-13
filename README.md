# PyTrees Js

[[About](#about)] [[Roadmap](#roadmap)]

## About

Javascript libraries for visualisation and monitoring of behaviour trees at runtime or when replaying a log.

* Visualise runtime snapshots of behaviour trees
* Collapse subtrees
* Zoom and scale contents to fit
* Timeline rewind & resume

Despite primarily catering for use cases with py_trees, these libraries
can be used for behaviour trees in general since it requires only properties
common to most behaviour tree implementations and flexibly opts into implementation
specific data via passing of a key-value dictionary that is appropriately
formatted in an implemenation-agnostic manner inside the web application.

This repository also includes a hybrid Qt-JS application used for development and demonstration purposes.

For a quick preview of it's capabilities:


```
git clone https://github.com/splintered-reality/py_trees_js
cd py_trees_js
. ./virtualenv.bash
# launch the demo viewer
py-trees-demo-viewer
# OR launch the demo viewer with a js console for debugging
./scripts/py-trees-devel-viewer
```

<img src="images/splash.png" style="display: block; margin-left: auto; margin-right: auto; width: 50%;">
<img src="images/screenshot.png" style="display: block; margin-left: auto; margin-right: auto; width: 80%;">

## Roadmap

See the [Projects](https://github.com/splintered-reality/py_trees_js/projects?query=is%3Aopen+sort%3Acreated-asc) page for progress and planned milestones.

## Building a Web App

Building a complete web application that can render a behaviour tree stream is an effort that can be decomposed into two tasks:

1. Creating the html canvas that can be used to render trees and construct a timeline
2. Wrapping the application in the framework of your choice and connecting it to an external stream

The first stage is purely an exercise with html, css and javascript. The latter will depend on your use case - it could
be a qt-js hybrid application (as exercised here) for developers, an electron application for cross-platform and mobile
deployment or a cloud based service.

### The HTML Canvas

Let's start with a basic html page with two divs, one for the tree canvas and one for the timeline:

```xhtml
<html>
<head>
  <meta charset="utf-8">
  <title>PyTrees Viewer</title>
</head>
<style>
  body {
    margin: 0;
  }
</style>
<body>
  <div id="window">
    <div id="canvas"></div>
    <div id="timeline"></div>
  </div>
</body>
</html>
```

Next, bring in the javascript libraries. For exemplar purposes, it is assumed here that the libraries
have been made available alongside the html page - how is an integration detail depending on the mode
of deployment (see next section for an example).

Note that the `py_trees-<version>.js` library has only one dependency, [jointjs](https://resources.jointjs.com/docs/jointjs/v3.0/joint.html),
but that in turn has a few dependencies of it's own. The bundled libraries in the `js/jointjs` folder
of this repository correspond to the requirements for a specific version of jointjs and
have been tested to work with the accompany `py_trees-<version>.js` library.  

You can verify that the libraries have been properly imported by calling `py_trees.hello()` which
will print version information of the loaded javascript libraries (if found) to the javascript console.

```xhtml
<html>
<head>
  <meta charset="utf-8">
  <title>PyTrees Viewer</title>
</head>
<script src="js/jointjs/dagre-0.8.4.min.js"></script>
<script src="js/jointjs/graphlib-2.1.7.min.js"></script>
<script src="js/jointjs/jquery-3.4.1.min.js"></script>
<script src="js/jointjs/lodash-4.17.11.min.js"></script>
<script src="js/jointjs/backbone-1.4.0.js"></script>
<script src="js/jointjs/joint-3.0.2.min.js"></script>
<script src="js/py_trees-0.3.1.js"></script>
<link rel="stylesheet" href="js/py_trees-0.3.1.css">
<link rel="stylesheet" type="text/css" href="js/jointjs/joint-3.0.2.min.css"/>
<style>
  body {
    margin: 0;
  }
</style>
<body>
  <script type="text/javascript">
    py_trees.hello()
  </script>
  <div id="window">
    <div id="canvas"></div>
    <div id="timeline"></div>
  </div>
</body>
</html>
```

In the next iteration, the canvas is initialised and a callback for
accepting incoming trees from an external source is prepared. To test it,
pass it the demo tree provided by the library.

```xhtml
<html>
<head>
  <meta charset="utf-8">
  <title>PyTrees Viewer</title>
</head>
<script src="js/jointjs/dagre-0.8.4.min.js"></script>
<script src="js/jointjs/graphlib-2.1.7.min.js"></script>
<script src="js/jointjs/jquery-3.4.1.min.js"></script>
<script src="js/jointjs/lodash-4.17.11.min.js"></script>
<script src="js/jointjs/backbone-1.4.0.js"></script>
<script src="js/jointjs/joint-3.0.2.min.js"></script>
<script src="js/py_trees-0.3.1.js"></script>
<link rel="stylesheet" href="js/py_trees-0.3.1.css">
<link rel="stylesheet" type="text/css" href="js/jointjs/joint-3.0.2.min.css"/>
<style>
  body {
    margin: 0;
  }
</style>
<body>
  <script type="text/javascript">
    py_trees.hello()
  </script>
  <div id="window">
    <div id="canvas"></div>
    <div id="timeline"></div>
  </div>
  <script type="text/javascript">
    // rendering canvas
    canvas_graph = py_trees.canvas.create_graph()
    canvas_paper = py_trees.canvas.create_paper({graph: canvas_graph})
    
    render_tree = function({tree}) {
      py_trees.canvas.update_graph({graph: canvas_graph, tree: tree})
      py_trees.canvas.layout_graph({graph: canvas_graph})
      if ( canvas_graph.get('scale_content_to_fit') ) {
        py_trees.canvas.scale_content_to_fit(canvas_paper)
      }
      return "rendered"
    }
    render_tree({tree: py_trees.experimental.create_demo_tree_definition()})
  </script>
</body>
</html>
```

At this point, your web app should be visualising a single tree and
zoom/collapse/scale to fit interactions functional. I'm happy, you should be too!

Adding a timeline to the application is optional, but the code does not
change significantly and is a very useful feature to have. The built-in demo
app's [index.html](py_trees_js/viewer/html/index.html) does exactly this. The code is reproduced below for convenience.

```xhtml
<html>
<head>
  <meta charset="utf-8">
  <title>PyTrees Viewer</title>
</head>
<script src="js/jointjs/dagre-0.8.4.min.js"></script>
<script src="js/jointjs/graphlib-2.1.7.min.js"></script>
<script src="js/jointjs/jquery-3.4.1.min.js"></script>
<script src="js/jointjs/lodash-4.17.11.min.js"></script>
<script src="js/jointjs/backbone-1.4.0.js"></script>
<script src="js/jointjs/joint-3.0.2.min.js"></script>
<script src="js/py_trees-0.3.1.js"></script>
<link rel="stylesheet" href="js/py_trees-0.3.1.css">
<link rel="stylesheet" type="text/css" href="js/jointjs/joint-3.0.2.min.css"/>
<style>
  body {
    margin: 0;
  }
</style>
<body>
  <script type="text/javascript">
    py_trees.hello()
  </script>
  <div id="window">
    <div id="canvas"></div>
    <div id="timeline"></div>
  </div>
  <script type="text/javascript">
    // rendering canvas
    canvas_graph = py_trees.canvas.create_graph()
    canvas_paper = py_trees.canvas.create_paper({graph: canvas_graph})

    // event timeline
    timeline_graph = py_trees.timeline.create_graph({event_cache_limit: 100});
    timeline_paper = py_trees.timeline.create_paper({
        timeline_graph: timeline_graph,
        canvas_graph: canvas_graph,
        canvas_paper: canvas_paper,
    })
    
    // react to window resizing events
    $(window).resize(function() {
      py_trees.timeline.scale_content_to_fit(timeline_paper)
    })

    render_tree = function({tree}) {
      // if there is no timeline
      //   py_trees.canvas.update_graph({graph: canvas_graph, tree: tree})
      //   py_trees.canvas.layout_graph({graph: canvas_graph})
      //   if ( canvas_graph.get('scale_content_to_fit') ) {
      //       py_trees.canvas.scale_content_to_fit(canvas_paper)
      //   }

      // if there is a timeline
      py_trees.timeline.add_tree_to_cache({
          timeline_graph: timeline_graph,
          canvas_graph: canvas_graph,
          canvas_paper: canvas_paper,
          tree: tree
      })
      return "rendered"
    }
  </script>
</body>
</html>
```

