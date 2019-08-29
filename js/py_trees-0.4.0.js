/*!
 * A library for rendering, with jointjs, a behaviour tree on a
 * html canvas.
 */
// *************************************************************************
// Joint Shapes (Models/Views)
//   Originally had these in py_trees.shapes, however that replaces
//   (doesn't combine with) joint.shapes, resulting in a few inconsistent
//   behaviours when I do call on joint.shapes components (ostensibly
//   because their views don't get found).
// *************************************************************************

var joint = joint
joint.shapes = joint.shapes || {}
joint.shapes.trees = joint.shapes.trees || {}

joint.shapes.trees.Node = joint.dia.Element.define(
    'trees.Node', {
        size: { width: 170, height: 50 },
        collapse_children: false,
        hidden: false,
        attrs: {
            box: {
                refX: '0%', refY: '0%',
                refWidth: '100%', refHeight: '100%',
                // stroke: none
                fill: '#333333', stroke: '#000000', 'stroke-width': 2,
                'pointer-events': 'visiblePainted', rx: 8, ry: 8,
            },
            type: {
                refX: '0%', refY: '0%',
                refWidth: '15%', refHeight: '100%',
                fill: '#00FF00', stroke: '#000000', 'stroke-width': 2,
                'pointer-events': 'visiblePainted', rx: 8, ry: 8,
            },
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'box'
        }, {
            tagName: 'rect',
            selector: 'type'
        }]
    }
);

joint.shapes.trees.NodeView = joint.dia.ElementView.extend({
      // events: {
    //   'dblclick': 'onDblClick',
    // },
    template: [
        '<div class="html-element">',
        '<span class="html-name"></span>',
        '<span class="html-detail"></span>',
        '<div class="html-tooltip"/>',
        '</div>'
    ].join(''),

    initialize: function() {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        // This is an example of reacting on the input change and storing the input data in the cell model.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: function() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.listenTo(this.paper, 'translate', this.updateBox)
        //this.listenTo(this.paper, 'translate', this.updateBox.bind(this, this.paper));
        this.listenTo(this.paper, 'scale', this.updateBox)
        // this.listenTo(this.paper, 'scale', this.updateBox.bind(this, this.paper));
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    // onDblClick: function() {
    //     console.log("***** Fading ******")
    //     this.model.prop('faded', !this.model.prop('faded'));
    // },
    updateBox: function() {
        if (!this.paper) return;

        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find('span.html-name')[0].innerHTML = this.model.get('name')
        this.$box.find('span.html-detail')[0].innerHTML = this.model.get('details')
        this.$box.find('div.html-tooltip')[0].innerHTML =
            "<div>#" +
            this.model.get('behaviour_id') +
            "</div>" +
            "<hr/>" +
            "<span><b>Name: </b>" +
            this.model.get('name') +
            "</span><br/>" +
            "<span><b>Status: </b>" +
            this.model.get('status') +
            "</span><br/>" +
            "<span><b>Visited: </b>" +
            this.model.get('visited') +
            "</span><br/>"
        data = this.model.get('data')
        for (var key in data) {
            this.$box.find('div.html-tooltip')[0].innerHTML +=
               "<span><b>" +
                key +
                ": </b>" +
                data[key] +
                "</span><br/>"
        }
        scale = this.paper.scale()       // sx, sy
        offset = this.paper.translate()  // tx, ty
        // Positioning
        this.$box.find('div.html-tooltip').css({
            width: '30em',
            left: 0.85*bbox.width*scale.sx,  // see below, parent is 0.8*bbox.wdith
        })
        this.$box.find('span.html-detail').css({
            'margin-top': 0.10*bbox.height*scale.sy,
            'margin-bottom': 0.15*bbox.height*scale.sy,
            'font-size': 10*scale.sy,
            'color': this.model.get('visited') ? '#F1F1F1' : '#AAAAAA',
        })
        this.$box.find('span.html-name').css({
            'margin-top': 0.10*bbox.height*scale.sy,
            'margin-bottom': 0.15*bbox.height*scale.sy,
            'font-size': 14*scale.sy,
            'color': this.model.get('visited') ? '#F1F1F1' : '#AAAAAA',
        })
        this.$box.css({
            // math says this should be 0.85/1.0, but not everything lining up correctly
            //   html-element top left corner is fine, but bottom-right corner is
            //   overhanging by some small delta in x and y directions
            width: 0.80*bbox.width*scale.sx,
            height: 0.95*bbox.height*scale.sy,
            left: offset.tx + bbox.x*scale.sx + 0.15*bbox.width*scale.sx,
            top: offset.ty + bbox.y*scale.sy,
            transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
        });
        if ( this.model.get('collapse_children') ) {
          this.model.attr({
            box: {
                    fill: {
                        type: 'linearGradient',
                        stops: [
                            { offset: '0%',  color: '#333333' },
                            { offset: '100%', color: '#555555' }
                        ],
                        attrs: {
                            x1: '0%',
                            y1: '0%',
                            x2: '0%',
                            y2: '100%'
                        },
                  },
            }
          })
        } else {
          this.model.attr({
            box: {
              fill: '#333333'
            }
            })
        }
        // Hiding
        if ( this.model.get('hidden') ) {
            this.model.attr('./visibility', 'hidden')
            this.$box.css({
                'visibility': 'hidden',
            })
        } else {
            this.model.attr('./visibility', 'visible')
            this.$box.css({
                'visibility': 'visible',
            })
        }
      },

      removeBox: function(evt) {
          this.$box.remove();
      }
  });

/**
 * Used to model the cached trees in the timeline bar as think
 * vertical slivers.
 */
joint.shapes.trees.EventMarker = joint.shapes.standard.Rectangle.define(
    'trees.EventMarker', {
        position: { x: 0, y: 0 },
        size: { width: 4, height: 30 },
        default_width: 4,
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                stroke: 'black',
                strokeWidth: 0,
                fill: '#FFFFFF',
                'pointer-events': 'auto',
            }
        }
    },
    {
      // inherit markup from joint.shapes.standard.Rectangle
    }
);

// *************************************************************************
// py_trees
// *************************************************************************

var py_trees = (function() {

    var _version = '0.4.0'

    /**
     * Introduce the user to the library and print relevant info about it's discovered
     * dependencies.
     */
    var _hello = function() {
        console.log("********************************************************************************")
        console.log("                                    Py Trees JS                                 ")
        console.log("")
        console.log("A javascript library for visualisation of executing behaviour trees.")
        console.log("")
        console.log("Version & Dependency Info:")
        console.log(" - py_trees: ", py_trees.version)
        console.log("   - jointjs : ", joint.version)
        console.log("      - backbone: ", Backbone.VERSION)
        console.log("      - dagre   : ", dagre.version)
        console.log("      - jquery  : ", jQuery.fn.jquery)
        console.log("      - lodash  : ", _.VERSION)
        console.log("********************************************************************************")
    }


  // *************************************************************************
  // py_trees.experimental
  // *************************************************************************
  /*
   * Create a serialised tree in javascript form. Useful for testing
   * a web app without wiring it up to an external source.
   */
  var _experimental_create_demo_tree_definition = function() {
    var tree = {
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
            '3': {
                id: '3',
                status: 'FAILURE',
                name: 'Parallel',
                details: 'SuccessOnOne',
                colour: '#FFFF00',
                data: {
                    Type: 'py_trees.composites.Parallel',
                    Feedback: 'Baked beans is good for your heart, baked beans makes you',
                },
            },
            '4': {
                id: '4',
                status: 'RUNNING',
                name: '&#x302; &#x302; Decorator',
                colour: '#DDDDDD',
                children: ['5'],
                data: {
                    Type: 'py_trees.composites.Decorator',
                    Feedback: 'Wearing the hats',
                },
            },
            '5': {
                id: '5',
                status: 'RUNNING',
                name: 'Decorated Beyond The Beliefs of an Agnostic Rhino',
                colour: '#555555',
                data: {
                    Type: 'py_trees.composites.Behaviour',
                    Feedback: "...."
                },
            },
            '6': {
                id: '6',
                status: 'INVALID',
                name: 'Behaviour',
                colour: '#555555',
                data: {
                    Type: 'py_trees.composites.Behaviour',
                    Feedback: "..."
                },
            },
            '7': {
                id: '7',
                status: 'SUCCESS',
                name: 'Worker A',
                colour: '#555555',
                data: {
                    Type: 'py_trees.composites.Behaviour',
                    Feedback: "..."
                },
            },
            '8': {
                id: '8',
                status: 'FAILURE',
                name: 'Worker B',
                colour: '#555555',
                data: {
                    Type: 'py_trees.composites.Behaviour',
                    Feedback: "..."
                },
            },
            '9': {
                id: '9',
                status: 'INVALID',
                name: 'Worker C',
                colour: '#555555',
                data: {
                    Type: 'py_trees.composites.Behaviour',
                    Feedback: "..."
                },
            },
        }
    }
    return tree
  }

  // *************************************************************************
  //  py_trees.canvas
  // *************************************************************************
  // Variables
  //
  //   graph
  //     scale_content_to_fit (bool, default: true) - always scale content to fit

  /**
   * Right now this is creating the graph. Will have to decide
   * in future whether new tree serialisations reset the graph
   * and completely recreate or just update the graph. The latter
   * may be imoprtant for efficiency concerns or to retain
   * interactivity information in the graph (e.g. collapsible points).
   */
  var _canvas_update_graph = function({graph, tree}) {

    // Log the tree for introspection
    console.log("_canvas_update_graph")
    console.log("  behaviours", tree.behaviours)
    console.log("  visited path: " + tree.visited_path)

    // extract interactive information
    var collapsed_nodes = []
    _.each(graph.getElements(), function(el) {
        behaviour_id = el.get('behaviour_id')
        if (el.get('collapse_children')) {
          collapsed_nodes.push(behaviour_id)
        }
    })

    // root level json checks
    // TODO: replace with a json specification verification later
    if (typeof tree.behaviours == 'undefined') {
      alert("Tree Parsing Error: tree.behaviours does not exist")
      return
    }
    if (typeof tree.timestamp == 'undefined') {
        alert("Tree Parsing Error: tree.timestamp does not exist")
        return
    }
    for (behaviour in tree.behaviours) {
        // at least id, name are required, all others are optional
        if (typeof tree.behaviours[behaviour].id == 'undefined') {
            alert("Tree Parsing Error: tree.behaviours[n].id does not exist")
            return
        }
        if (typeof tree.behaviours[behaviour].name == 'undefined') {
            alert("Tree Parsing Error: tree.behaviours[n].name does not exist")
            return
        }
    }

    // reset
    graph.clear()

    // repopulate
    var _nodes = {}
    for (behaviour in tree.behaviours) {
        node = _canvas_create_node({
            behaviour_id: tree.behaviours[behaviour].id,
            colour: tree.behaviours[behaviour].colour || '#555555',
            name: tree.behaviours[behaviour].name,
            status: tree.behaviours[behaviour].status || 'INVALID',
            details: tree.behaviours[behaviour].details || '...',
            visited: tree.visited_path.includes(tree.behaviours[behaviour].id) || false,
            data: tree.behaviours[behaviour].data || {},
        })
        _nodes[tree.behaviours[behaviour].id] = node
        node.addTo(graph)
    }
    for (behaviour in tree.behaviours) {
        if ( typeof tree.behaviours[behaviour].children !== 'undefined') {
            tree.behaviours[behaviour].children.forEach(function (child_id, index) {
                link = _canvas_create_link({
                    source: _nodes[tree.behaviours[behaviour].id],
                    target: _nodes[child_id],
                })
                link.addTo(graph)
            });
        }
    }

    // re-establish interactive properties
    _.each(graph.getElements(), function(el) {
        behaviour_id = el.get("behaviour_id")
        if (collapsed_nodes.includes(behaviour_id)) {
          _canvas_collapse_children(graph, el)
        }
    })
    console.log("_canvas_update_graph_done")
  }

  /**
   * Create elided details from a details (text) snippet.
   */
  var _canvas_create_elided_details = function(details) {
    elided_details = joint.util.breakText(
            details || '...',
            { width: 150, height:30 },
            {},
            { ellipsis: true }
        )
    return elided_details
  }

  var _canvas_create_node = function({behaviour_id, colour, name, details, status, visited, data}) {
    node = new joint.shapes.trees.Node({
      name: name,
      behaviour_id: behaviour_id,
      details: details,
      elided_details: _canvas_create_elided_details(details),
      status: status,
      visited: visited,
      data: data,
      attrs: {
          'box': {
              opacity: visited ? 1.0 : 0.3

          },
          'type': {
              fill: colour || '#555555',
              opacity: visited ? 1.0 : 0.3
          },

      }
    })
    var highlight_colours = {
        'FAILURE': 'red',
        'SUCCESS': 'green',
        'RUNNING': 'blue',
        'INVALID': 'gray'
    }
    // TODO: consider not showing any highlight if invalid
    if ( typeof status !== 'undefined') {
        node.attr({
          'box': {
            filter: {
                name: 'highlight',
                args: {
                    color: highlight_colours[status],
                    width: 3,
                    opacity: 0.8,
                    blur: 5
                }
            }
          },
        })
    }
    return node
  }

  /**
   * Create a link, styled for the py_trees rendering.
   */
  var _canvas_create_link = function({source, target}) {
      console.log("_canvas_create_link")
      var link = new joint.shapes.standard.Link();
      link.source(source)
      link.target(target)
      link.connector('smooth')
      console.log("_canvas_create_link_done")
      return link
  }
  
  /**
   * Create graph with initialised variables.
   */
  var _canvas_create_graph = function() {
      graph = new joint.dia.Graph({});
      graph.set('scale_content_to_fit', true)
      return graph
  }

  /**
   * Initialise the paper with default settings and
   * configure the interactive callbacks (mouse, clicks, etc).
   */
  var _canvas_create_paper = function({graph}) {
      console.log("_canvas_create_paper")
      var paper = new joint.dia.Paper({
          el: document.getElementById('canvas'),
          model: graph,
          width: '100%',
          height: '100%',
          interactive: false,  // disable dragging, but keep highlighting
          // defaultConnector: {  // doesn't seem to have any effect
          //     name: 'rounded',
          //     args: {
          //         radius: 20
          //     }
          // },
          background: { color: '#111111' },
          // gridSize: 15,     // doesn't work?
          // drawGrid: {
          //     name: 'doubleMesh',
          //     args: [
          //         { color: '#222222', thickness: 1 }, // settings for the primary mesh
          //         { color: '#333333', scaleFactor: 5, thickness: 5 } //settings for the secondary mesh
          // ]}
      });
      paper.on('element:mouseover', function(view, event) {
          if ( view.model.get('type') == "trees.Node" ) {
              // ugh, is there a better way than pulling [0]?
              //    note; the method used in the view with .find().css({ ... doesn't work
              view.$box.find('div.html-tooltip')[0].style.display = "block"
          }
      })
      paper.on('element:mouseout', function(view, event) {
          if ( view.model.get('type') == "trees.Node" ) {
              view.$box.find('div.html-tooltip')[0].style.display = "none"
          }
      })
      // cell:mousewheel gives strange scale values back (30.0!)
      paper.on('blank:mousewheel',
          _canvas_scale.bind(null, paper)
      )
       // pan canvas
      paper.on('blank:pointerdown',
          _canvas_pan_begin.bind(null, paper)
      )
      paper.on('blank:pointermove',
          _canvas_pan_move.bind(null, paper)
      )
      paper.on('blank:pointerup',
          _canvas_pan_move.bind(null, paper)
      )
      paper.on('blank:pointerdblclick', function(event, x, y) {
          canvas_graph.set('scale_content_to_fit', true)
          _canvas_scale_content_to_fit(paper)
      })
      paper.on('element:pointerdblclick',
        _canvas_collapse_children_handler.bind(null, graph)
      )
      dimensions = paper.getComputedSize()
      height = 0.8*dimensions.height
      // splash banner
      var splash = new joint.shapes.standard.Rectangle({
          position: { x: dimensions.width / 2.0 - 100, y: 0.1*dimensions.height},
          size: { width: 200, height: height },
          attrs: {
              body: {
                  fill: '#111111',
                  stroke: '#AAAAAA', 'stroke-width': 1,  // border
                  rx: 5, ry: 5,  // rounded corners
                  'pointer-events': 'none',
                  filter: {
                      name: 'highlight',
                      args: {
                          color: '#999999',
                          width: 2,
                          opacity: 0.8,
                          blur: 5
                      }
                  },
              },
              label: {
                  text: 'Shortcuts\n\n' +
                        '-------------------------\n\n' +
                        'Zoom In/Out ......... mousewheel\n\n' +
                        'Scale to Fit ...... double-click\n\n' +
                        'Collapse Node ..... single click',
                  fill: 'white',
                  'font-size': 10,
              }
          }
      });
      splash.addTo(graph)

      console.log("_canvas_create_paper_done")
      return paper
  }

  var _canvas_layout_graph = function({graph}) {
      console.log("_canvas_layout_graph")
      var graph_bounding_box = joint.layout.DirectedGraph.layout(graph, {
          marginX: 50,
          marginY: 50,
          nodeSep: 50,
          edgeSep: 80,
          rankDir: "TB"
      });
      console.log("  dot graph layout")
      console.log('    x:', graph_bounding_box.x, 'y:', graph_bounding_box.y)
      console.log('    width:', graph_bounding_box.width, 'height:', graph_bounding_box.height);
      console.log("_canvas_layout_graph_done")
  }
  /**
   * Callback for collapsing children on a click event
   */
  var _canvas_collapse_children_handler = function(graph, view, event, x, y) {
      _canvas_collapse_children(graph, view.model)
  }

  /**
   * Collapse children of the selected model. This merely
   * hides them from view, but doesn't remove them from the graph.
   */
  var _canvas_collapse_children = function(graph, model) {
      var successors = graph.getSuccessors(model)
      if ( !successors.length ) {
          return
      }
      model.set('collapse_children', !model.get('collapse_children'))
      collapse_children = model.get('collapse_children')
      _.each(successors, function(behaviour) {
          behaviour.set('hidden', collapse_children)
          var links = graph.getConnectedLinks(behaviour, { inbound: true })
          _.each(links, function(link) {
              // prefer to set a variable in the model and do this in a view,
              // but this will do till we have a custom link and link view
              link.attr('line/visibility', collapse_children ? 'hidden' : 'visible')
          })
      })
  }
  /**
   * Scale the canvas. Note that paper will automagically
   * re-render the models, but any html added via views
   * needs to listen to the paper.scale trigger and react
   * to that explicitly.
   */
  var _canvas_scale = function(paper, event, x, y, delta) {
      graph = paper.model
      graph.set('scale_content_to_fit', false)
      scale = paper.scale()
      sx = scale.sx
      sy = scale.sy
      sx = (sx < 0.2 && delta < 0 ? sx : sx + delta / 10.0)
      sy = (sy < 0.2 && delta < 0  ? sy : sy + delta / 10.0)
      paper.scale(sx, sy)
  }

  /**
   * Initialise data for a panning maneuvre.
   */
  var _canvas_pan_begin = function(paper, event, x, y) {
      console.log("_canvas_pan_begin")
      scale = paper.scale()
      // TODO: little dirty, monkeypatching paper on the fly
      paper.start_drag = {}
      paper.start_drag.x = x * scale.sx
      paper.start_drag.y = y * scale.sy
      console.log("_canvas_pan_begin_done")
  }
  /**
   * Pan the canvas, lookup the offset via paper.translate() later
   * (necessary when rendering the html views, but not the models).
   */
  var _canvas_pan_move = function(paper, event, x, y) {
      paper.translate(
          event.offsetX - paper.start_drag.x,
          event.offsetY - paper.start_drag.y
      )
  }
  /**
   * Fit the tree to the canvas if scale < 1.0,
   * otherwise just render it normally (scale: 1.0).
   */
  var _canvas_scale_content_to_fit = function(paper, event, x, y) {
      console.log("Scaling content to fit canvas...")
      paper.scaleContentToFit({
          padding: 50,
          minScale: 0.1,
          maxScale: 1.0,
          scaleGrid: 0.1,
      });
  }

  // *************************************************************************
  // py_trees.timeline
  // *************************************************************************
  // Variables
  //
  //   graph
  //     buttons ({string: jointjs model}) - keys are one of 'previous', 'next', 'resume'
  //     cache (jointjs models) - all jointjs objects for timeline events
  //     streaming (bool)
  //   cache
  //     selected (joint.shapes.trees.EventMarker) - model for the selected event
  //     trees ([dict]) - tree data (pure js structure, i.e. no jointjs)
  //     events ([joint.shapes.trees.EventMarker]) - models for the events

  /**
   * Create a graph for the timeline, allocating storage for the cache
   * to be bounded by the specified cache size.
   */
  var _timeline_create_graph = function({event_cache_limit}) {
      var graph = new joint.dia.Graph({});
      separation_width = 20
      height = 30
      timeline_width = 2400
      var cache = new joint.shapes.standard.Rectangle({
          position: { x: 0, y: 0},
          size: { width: timeline_width, height: height },
          attrs: {
              body: {
                  fill: '#111111',
                  stroke: '#AAAAAA', 'stroke-width': 1,  // border
                  rx: 5, ry: 5,  // rounded corners
                  filter: {
                      name: 'highlight',
                      args: {
                          color: '#999999',
                          width: 2,
                          opacity: 0.8,
                          blur: 5
                      }
                  },
              },
          }
      });
      cache.set('tree_cache_size', event_cache_limit)
      cache.set('trees', [])
      var previous = new joint.shapes.standard.Rectangle({
          position: { x: cache.get('size').width + separation_width, y: 0},
          size: { width: 70, height: height },
          attrs: {
              body: {
                  fill: '#111111',
                  stroke: '#AAAAAA', 'stroke-width': 1,  // border
                  rx: 5, ry: 5,  // rounded corners
                  'pointer-events': 'auto',
                  filter: {
                      name: 'highlight',
                      args: {
                          color: '#999999',
                          width: 2,
                          opacity: 0.8,
                          blur: 5
                      }
                  },
              },
              label: {
                  text: '<',
                  fill: 'white',
                  'font-size': height - 8,
              }
          }
      });
      next = previous.clone()
      next.translate(previous.get('size').width + separation_width, 0)
      next.attr({
          label: { text: '>' }
      })
      resume = next.clone()
      resume.translate(next.get('size').width + separation_width, 0)
      resume.attr({
          label: {
              text: '>>'
          }
      })
      // populate graph
      cache.addTo(graph);
      previous.addTo(graph)
      next.addTo(graph)
      resume.addTo(graph)
      graph.set('streaming', true)
      graph.set('cache', cache)
      graph.set('buttons', {'previous': previous, 'next': next, 'resume': resume})
      _timeline_toggle_buttons({graph: graph, enabled: false})
      return graph
  }

  /**
   * Create the timeline paper and a few mouseover events for event markers.
   */
  var _timeline_create_paper = function({timeline_graph, canvas_graph, canvas_paper}) {
      var paper = new joint.dia.Paper({
          el: document.getElementById('timeline'),
          model: timeline_graph,
          width: '100%',
          height: '35px',
          background: { color: '#111111' },
          interactive: false,
      });
      paper.on('element:mouseover', _timeline_zoom_event_marker_appearance)
      paper.on('element:mouseout', _timeline_restore_event_marker_appearance)
      paper.on(
          'element:pointerclick',
          _timeline_handle_element_pointerclicks.bind(null, timeline_graph, canvas_graph, canvas_paper)
      )
      paper.on(
          'element:pointermove', 
          _timeline_handle_dragging.bind(null, paper)
      )
      paper.on('element:pointerdown', _timeline_handle_button_pressed)
      paper.on('element:pointerup',_timeline_handle_button_pressed)
      _timeline_scale_content_to_fit(paper)
      return paper
  }


  /**
   * Currently only used to make sure event marker appearance's
   * are restored when moving out of their bounding box rather than
   * on a mouseout.
   */
  var _timeline_handle_dragging = function(paper, view, event, x, y) {
      console.log("_timeline_handle_dragging")
      if ( view.model.get('type') == "trees.EventMarker" ) {
          outside = true
          views = paper.findViewsFromPoint({x: x, y: y})
          for (var index = 0; index < views.length; index++) {
              if (views[index].model.id == view.model.id) {
                  outside = false
              }
          }
          if ( outside ) {
              _timeline_restore_event_marker_appearance(view)
          }
      }
  }
  /**
   * Checks to see if a button was pressed and animate it with the
   * appearance of being pushed in and out.
   */
  var _timeline_handle_button_pressed = function(view, event, x, y) {
      console.log("_timeline_handle_button_pressed (up || down)")
      console.log(event)
      pressed = event.type == "mousedown" ? true : false
      if ( ( view.model.id == timeline_graph.get('buttons')["previous"].id ) ||
           ( view.model.id == timeline_graph.get('buttons')["next"].id ) ||
           ( view.model.id == timeline_graph.get('buttons')["resume"].id ) ) {
          console.log("  button '%s'", event.type)
          view.model.attr({
              body: {
                  stroke: pressed ? '#777777' : '#AAAAAA',
                  filter: {
                      args: {
                          color: pressed ? '#333333' : '#999999',
                      }
                  },
              },
              label: {
                  fill: pressed ? '#555555' : 'white',
              }
          })
          multiplier = event.type == "mousedown" ? 1 : -1
          view.model.translate(2 * multiplier, 2 * multiplier)
      }
  }

  var _timeline_handle_element_pointerclicks = function(
      timeline_graph,
      canvas_graph,
      canvas_paper,
      view
  ) {
      console.log("_timeline_handle_element_pointerclicks")
      cache = timeline_graph.get('cache')
      trees = cache.get('trees')
      events = cache.get('events')

      if ( view.model.get('type') == "trees.EventMarker" ) {
          console.log("  clicked an event marker")
          _timeline_select_event(timeline_graph, canvas_graph, canvas_paper, view.model)
          _timeline_toggle_buttons({graph: timeline_graph, enabled: true})
          timeline_graph.set('streaming', false)
      } else { // buttons
          if ( view.model.id == timeline_graph.get('buttons')["resume"].id ) {
              console.log("  clicked 'resume'")
              timeline_graph.set('streaming', true)
              _timeline_toggle_buttons({graph: timeline_graph, enabled: false})
              // could alternatively find the last tree's event marker view via
              // _.each(cache_model.getEmbeddedCells(), function(embedded) {
              //    tree = embedded.get('tree')
              //    check timestamp with the trees' last element's timestamp
              //    pass that model's view to  _timeline_select_event
              _timeline_rebuild_cache_event_markers({graph: timeline_graph})
              _canvas_update_graph({graph: canvas_graph, tree: cache.get('selected').get('tree')})
              _canvas_layout_graph({graph: canvas_graph})
              canvas_graph.set('scale_content_to_fit', true)
              _canvas_scale_content_to_fit(canvas_paper)
          } else if ( view.model.id == timeline_graph.get('buttons')["next"].id ) {
              console.log("  clicked 'next'")
              console.log("    # trees: ", trees.length)
              console.log("    # events: ", events.length)
              tree_timestamps = [] 
              trees.forEach(function (tree, index) {
                  tree_timestamps.push(tree.timestamp)
              })
              event_timestamps = []
              events.forEach(function (model, index) {
                  event_timestamps.push(model.get('tree').timestamp)
              })
              console.log("    tree  timestamps: ", tree_timestamps)
              console.log("    event timestamps: ", event_timestamps)
              console.log("    selected timestamp: ", cache.get('selected').get('tree').timestamp)
              for (var index = 0; index < trees.length; index++) {
                  if ( trees[index].timestamp == cache.get('selected').get('tree').timestamp ) {
                      if ( index != trees.length - 1) {
                          console.log("    next  timestamp : ", events[index+1].get('tree').timestamp)
                          _timeline_select_event(timeline_graph, canvas_graph, canvas_paper, events[index+1])
                          break
                      }
                  }
              }
          } else if ( view.model.id == timeline_graph.get('buttons')["previous"].id ) {
              console.log("  clicked 'previous'")
              tree_timestamps = [] 
              trees.forEach(function (tree, index) {
                  tree_timestamps.push(tree.timestamp)
              })
              event_timestamps = []
              events.forEach(function (model, index) {
                  event_timestamps.push(model.get('tree').timestamp)
              })
              console.log("    tree  timestamps: ", tree_timestamps)
              console.log("    event timestamps: ", event_timestamps)
              console.log("    selected timestamp: ", cache.get('selected').get('tree').timestamp)
              trees.forEach(function (tree, index) {
                  if ( tree.timestamp == cache.get('selected').get('tree').timestamp ) {
                      if ( index != 0) {
                          console.log("    previous timestamp: ", events[index-1].get('tree').timestamp)
                          _timeline_select_event(timeline_graph, canvas_graph, canvas_paper, events[index-1])
                      }
                  }
              })
          } else {
              alert("Error: unknown element clicked")
          }
      }
  }
  var _timeline_select_event = function(
          timeline_graph,
          canvas_graph,
          canvas_paper,
          event  // joint.shapes.trees.EventMarker
  ) {
      console.log("Select timeline event")

      cache = timeline_graph.get('cache')
      tree = event.get('tree')

      // render
      _canvas_update_graph({graph: canvas_graph, tree: tree})
      _canvas_layout_graph({graph: canvas_graph})
      _canvas_scale_content_to_fit(canvas_paper)

      // update timeline highlight
      // TODO: optimise, i.e. cache the selected marker and update
      // it only
      _.each(cache.getEmbeddedCells(), function(embedded) {
          _timeline_highlight_event({event: embedded, highlight: false})
      })
      _timeline_highlight_event({event: event, highlight: true})
      cache.set('selected', event)
  }

  /**
   * Toggle the visual and checkable state of the buttons.
   */
  var _timeline_toggle_buttons = function({graph, enabled}) {
      buttons = graph.get('buttons')
      opacity = enabled ? 1.0 : 0.3
      for (var key in buttons) {
          buttons[key].attr({
              body: {
                  stroke: enabled ? '#AAAAAA' : '#777777',
                  'pointer-events': enabled ? 'auto' : 'none',
                  filter: {
                      args: {
                          color: enabled ? '#999999' : '#333333',
                      }
                  },
              },
              label: {
                  fill: enabled ? 'white' : '#555555',
              }
          })
      }
  }

  /**
   * Resize (enlargen) and re-position the timeline event marker
   * centred on it's current position.
   */
  var _timeline_zoom_event_marker_appearance = function(view) {
      mouse_over_zoom_scale = 3.0
      if ( view.model.get('type') == "trees.EventMarker") {
          console.log("_timeline_zoom_event_marker_appearance")
          size = view.model.get('size')
          view.model.translate(
              - (mouse_over_zoom_scale - 1) * size.width / 2.0,
              0.0
          )
          view.model.resize(mouse_over_zoom_scale * size.width, size.height)
          view.model.attr({
              body: {
                  strokeWidth: 0 // 2
              }
          })
      }
  }

  /**
   * Highlight the event marker, used to denote it's elevated status
   * with respect to other event markers.
   */
  var _timeline_highlight_event = function({event, highlight}) {
      if ( highlight ) {
          event.attr({
              body: {
                  fill: 'red'
              }
          })
      } else {
          event.attr({
              body: {
                  fill: 'white'
              }
          })
      }
  }

  /**
   * Resize (shrink) and re-position the event marker to it's original position.
   */
  var _timeline_restore_event_marker_appearance = function(view) {
      if ( view.model.get('type') == "trees.EventMarker") {
          console.log("_timeline_restore_event_marker_appearance")
          position = view.model.get('position')
          size = view.model.get('size')
          if ( size.width == view.model.get('default_width')) {
              return
          }
          mouse_over_zoom_scale = 3.0  // also used by _timeline_zoom_event_marker_appearance
          original_width = size.width / mouse_over_zoom_scale
          view.model.translate(
              - (mouse_over_zoom_scale - 1) * original_width / 2.0,
              0.0
          )
          view.model.resize(
               width=size.width / mouse_over_zoom_scale,
               height=size.height,
               opt={
                   direction: 'top-left'
               }
          )
          view.model.attr({
              body: {
                  strokeWidth: 0
              }
          })
      }
  }

  var _timeline_scale_content_to_fit = function(paper) {
      console.log("Scaling content to fit timeline...")
      paper.scaleContentToFit({
          padding: 10,
          minScale: 0.1,
          preserveAspectRatio: false,
          scaleGrid: 0.005,
      });
  }

  /**
   * Add the incoming tree to the cache (stored in
   * the specified graph).
   *
   * Also trigger any necessary actions post-update.
   * Alternatively, could setup listeners on the tree cache
   * variable to do similarly.
   */
  var _timeline_add_tree_to_cache = function({
          timeline_graph,
          canvas_graph,
          canvas_paper,
          tree
      }) {
      console.log("Update Timeline Cache")
      cache = timeline_graph.get('cache')
      trees = cache.get('trees')

      // update the tree cache
      if ( trees.length == cache.get('event_cache_limit')) {
          trees.shift() // pop first element
      }
      trees.push(tree)
      _timeline_rebuild_cache_event_markers({graph: timeline_graph})

      if ( timeline_graph.get('streaming') ) {
          _canvas_update_graph({graph: canvas_graph, tree: tree})
          _canvas_layout_graph({graph: canvas_graph})
          if ( graph.get('scale_content_to_fit') ) {
              _canvas_scale_content_to_fit(canvas_paper)
          }
      }
  }

  var _timeline_rebuild_cache_event_markers = function({graph}) {
    console.log("_timeline_rebuild_cache_event_markers")

    cache = graph.get('cache')
    trees = cache.get('trees')
    
    // clear the visual cache
    _.each(cache.getEmbeddedCells(), function(embedded) {
        cache.unembed(embedded)
        embedded.remove()  // from the graph
    })
    events = []
    min_timestamp = trees.length == 1 ? 0 : trees[0]['timestamp']
    max_timestamp = trees[trees.length - 1]['timestamp']
    delta = max_timestamp - min_timestamp
    // handle the case when only trees are the same timestamp (yes, can happen!)
    delta = delta == 0 ? max_timestamp : delta 
    dimensions = cache.getBBox()
    trees.forEach(function (tree, index) {
      // normalise between 0.05 and 0.95
      normalised_x = 0.05 + 0.9 * (tree['timestamp'] - min_timestamp) / delta
      var event_marker = new joint.shapes.trees.EventMarker()
      event_marker.translate(
          dimensions.x + normalised_x * dimensions.width - event_marker.get('default_width') / 2.0,
          0
      )
      event_marker.resize(event_marker.get('default_width'), dimensions.height)
      event_marker.set('tree', tree)
      if ( graph.get('streaming') ) {
          if (index == trees.length - 1) {
              _timeline_highlight_event({event: event_marker, highlight: true})
              cache.set('selected', event_marker)
          }
      } else {
          if ( trees[index].timestamp == cache.get('selected').get('tree').timestamp) {
              _timeline_highlight_event({event: event_marker, highlight: true})
          }
      }
      cache.embed(event_marker)
      events.push(event_marker)
      event_marker.addTo(graph)
    })
    cache.set('events', events)
  }

  // *************************************************************************
  // Public API
  // *************************************************************************

  return {
    // variables
    version: _version,
    // methods
    hello: _hello,
    canvas: {
        create_graph: _canvas_create_graph,
        create_link: _canvas_create_link,
        create_node: _canvas_create_node,
        create_paper: _canvas_create_paper,
        layout_graph: _canvas_layout_graph,
        scale_content_to_fit: _canvas_scale_content_to_fit,
        update_graph: _canvas_update_graph,
    },
    experimental: {
      create_demo_tree_definition: _experimental_create_demo_tree_definition,
    },
    timeline: {
      add_tree_to_cache: _timeline_add_tree_to_cache,
      create_graph: _timeline_create_graph,
      create_paper: _timeline_create_paper,
      scale_content_to_fit: _timeline_scale_content_to_fit,
    },
  };
})(); // namespace py_trees
