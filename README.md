# PyTrees Js

[[About](#about)] [[Roadmap](#roadmap)] [[Building a Web App](#building-a-web-app)] [[The HTML Canvas](#the-html-canvas)] [[Qt-Js Integration](#qt-js-integration)] [[JSON Specification](#json-specification)]

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
formatted in an implementation-agnostic manner inside the web application.

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
<p align="center">
  <img src="images/splash.png" width="80%"/>
  <img src="images/screenshot.png" width="100%"/>
</p>

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

Output from `py_trees.hello()`:

```
********************************************************************************
                               Py Trees JS                                 

 A javascript library for visualisation of executing behaviour trees.
 
 Version & Dependency Info:
  - py_trees:  0.3.1
    - jointjs :  3.0.2
       - backbone:  1.4.0
       - dagre   :  0.8.4
       - jquery  :  3.4.1
       - lodash  :  4.17.11
********************************************************************************
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

### Qt-Js Integration

The demonstration application contained herein is a qt-js hybrid application. This is especially useful, for example, in robotics teams that lack a dedicated web team to help build and serve web applications. The usual problem being that they need visual and interactive applications in their
typical development workflow, but the product at the end of the line also needs similar
applications that can migrate to the cloud or handheld devices. 

The Qt side of the application should endeavour to merely wrap the web application, providing
a server (QtWebEngine - which internally embeds a chromium webkit), bridges to the ecosystem the application must communicate with and any interactive
widgets specific for development. The core functionality resides in the web application. If
designed in this manner, migration to the cloud or handheld applications later merely requires
rewriting the wrapper to fit the framework of choice.

Step-by-step, how does this work?

#### The JS Libraries

The JS libraries can be treated separately and even deployed separately (with the
obvious advantage that multiple applications can then take advantage of them without
vendoring them into each and every application that uses them).

1. Bundle the javascript resources into a `.qrc` file
2. Generate the resources as a c++ library / python module
3. Deploy the c++ library/python module in your development environment

#### The Web App

Make the HTML/CSS pages available

1. Bundle the `.html`/`.css` pages into a `.qrc` file
2. Import into designer or generate the resources as a c++ library / python module

#### The Qt Application

The Qt application can be designed in whatever way you're most comfortable with - via
Designer, pure C++ or python. The demonstration application in this repo starts with
designer `.ui` files, generates python modules and finally glues the application together
via customisation of the generated artifacts using PyQt5. Feel free to use the files
in [py_trees_js/viewer](py_trees_js/viewer) as a starting point.

Key elements:

1. Build your Qt application around a QWebEngineView widget
2. Link/import the javascript module in the web engine view class
3. Load the html page into the QWebEngineView view

Do not use the QWebView widget - this is deprecating in favour of the QWebEngineView widget. The most notable difference is that QWebView uses Qt's old webkit, while QWebEngineView makes use of Chromium's webkit. 

The second step automagically makes available the javascript resources to the application
when it's loaded. It's not terribly fussy about where it gets loaded, see [py_trees_js/viewer/web_view.py](py_trees_js/viewer/web_view.py) for an example:

```
# This is the module generated by running pyrcc5 on the js libraries .qrc
# It could have been equivalently deployed in a completely different python package 
import py_trees_js.resources
```

Loading the web page can be accomplished in designer. Simply point it at your qresource file
and set the dynamic URL property on the QWebEngineView widget. Alternatively you can import
the resource module and load it via QWebEngineView's `load` api.

#### Qt-Js Interactions

Qt and JS can interact directly over snippets of javascript code (via `runJavaScript()`
or over QWebChannel (a mechanism similar to sigslots) where more complexity is needed.
The example application here calls on the `render_tree()` method we created earlier in
the web application to send trees to the app. Example code from [py_trees_js/viewer/viewer.py](py_trees_js/viewer/viewer.py) which handles button clicks to cycle through a list of
demonstration trees:

```
def send_tree_response(reply):
    console.logdebug("reply: '{}' [viewer]".format(reply))


@qt_core.pyqtSlot()
def send_tree(web_view_page, demo_trees, unused_checked):
    demo_trees[send_tree.index]['timestamp'] = time.time()
    console.logdebug("send: tree '{}' [{}][viewer]".format(
        send_tree.index, demo_trees[send_tree.index]['timestamp'])
    )
    javascript_command = "render_tree({{tree: {}}})".format(demo_trees[send_tree.index])
    web_view_page.runJavaScript(javascript_command, send_tree_response)
    send_tree.index = 0 if send_tree.index == 2 else send_tree.index + 1

send_tree.index = 0
```

## JSON Specification

TODO: A JSon schema

Roughly, the specification expects json objects of the form:

* timestamp: int
* behaviours: dict[str, dict] 
* (optional) visited_path: list[str]

where each behaviour in the dict has specification:

* id: str
* status: Union[`INVALID`,`FAILURE`, `RUNNING`, `SUCCESS`]
* name: str
* colour: <html style hex code>
* (optional) children: List[str] 
* (optional) data: <generic key-value dictionary>

Identification strings (id's) must be unique and are used as both keys for the
behaviours dictionary, children and visited_path variables.

An example (extracted from `py_trees.experimental.create_demo_tree_definition()`):

```
{
    timestamp: 1563938995,
    visited_path: ['1', '2', '3', '4', '5', '7', '8'],
    behaviours: {
        '1': {
            id: '1',
            status: 'RUNNING',
            name: 'Selector',
            colour: '#00FFFF',
            children: ['2', '3', '4', '6'],
            data: {
                Type: 'py_trees.composites.Selector',
                Feedback: "Decision maker",
            },
        },
        '2': {
            id: '2',
            status: 'FAILURE',
            name: 'Sequence',
            colour: '#FFA500',
            children: ['7', '8', '9'],
            data: {
                Type: 'py_trees.composites.Sequence',
                Feedback: "Worker"
            },
        },
    }
}
