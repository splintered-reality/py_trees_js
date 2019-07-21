/*!
 * py_trees.js - 0.1.0
 */
var py_trees = (function() {

  // *************************************************************************
  // Experiments
  // *************************************************************************
  // ****************************************
  // Demo Tree
  // ****************************************
  var _create_demo_tree_definition = function() {
    var     tree = {
        behaviours: {
            '1': {
                id: '1',
                status: 'INVALID',
                name: 'Selector',
                colour: '#00FFFF',
                children: ['2', '3', '4', '6'],
                data: {
                    type: 'py_trees.composites.Selector',
                    feedback: "Decision maker",
                },
            },
            '2': {
                id: '2',
                status: 'INVALID',
                name: 'Sequence',
                colour: '#FFA500',
                data: {
                    type: 'py_trees.composites.Sequence',
                    feedback: "Worker"
                },
            },
            '3': {
                id: '3',
                status: 'INVALID',
                name: 'Parallel',
                colour: '#FFFF00',
                data: {
                    type: 'py_trees.composites.Parallel',
                    feedback: 'Bob is da best ....',
                },
            },
            '4': {
                id: '4',
                status: 'INVALID',
                name: 'Decorator',
                colour: '#DDDDDD',
                children: ['5'],
                data: {
                    type: 'py_trees.composites.Decorator',
                    feedback: 'Wearing the hats',
                },
            },
            '5': {
                id: '5',
                status: 'INVALID',
                name: 'Decorated',
                colour: '#555555',
                data: {
                    type: 'py_trees.composites.Behaviour',
                    feedback: "...."
                },
            },
            '6': {
                id: '6',
                status: 'INVALID',
                name: 'Behaviour',
                colour: '#555555',
                data: {
                    type: 'py_trees.composites.Behaviour',
                    feedback: "..."
                },
            },
        }
    }
    return tree  
  }

  // ****************************************
  // Tabbed Rectangles
  // ****************************************
  // https://jsfiddle.net/kumilingus/Lznzjqmk/

  _TabbedRectangle = joint.dia.Element.extend({
    defaults: _.defaultsDeep({
      type: 'TabbedRectangle',
      fillColor: 'red',
      outlineColor: 'black',
      activeTab: 0,
      numberOfTabs: 1,
      faded: false
    })
  });

  _TabbedRectangleView = joint.dia.ElementView.extend({

    events: {
      'dblclick': 'onDblClick',
      'click .tab': 'onTabClick'
    },

    init: function() {
      var model = this.model;
      this.listenTo(model, [
        'change:activeTab',
        'change:fillColor',
        'change:outlineColor',
        ].join(' '), this.update);
      this.listenTo(model, 'change:faded', this.toggleFade);
      this.listenTo(model, 'change:numberOfTabs', this.render);
    },

    render: function() {
      var markup = this.constructor.markup;
      var body = this.vBody = markup.body.clone();
      var tabs = this.vTabs = [];
      var texts = this.vTexts = [];
      for (var i = 0, n = this.model.prop('numberOfTabs'); i < n; i++) {
        tabs.push(markup.tab.clone());
        texts.push(markup.text.clone().text('Tab ' + (i + 1)));
      }
      this.vel.empty().append(
          _.flatten([
            body,
            tabs
            ])
      );
      this.translate();
      this.update();
    },

    update: function() {
      this.updateBody();
      this.updateText();
      this.updateTabs();
      this.toggleFade();
    },

    updateBody: function() {
      var model = this.model;
      var bodyAttributes = {
          width: model.prop('size/width'),
          height: model.prop('size/height'),
          fill: model.prop('fillColor'),
          stroke: model.prop('outlineColor')
      };
      this.vBody.attr(bodyAttributes);
    },

    updateTabs: function() {
      var model = this.model;
      var numberOfTabs = model.prop('numberOfTabs');
      var length = model.prop('size/width') / numberOfTabs;
      var activeTab = model.prop('activeTab');
      var vTabs = this.vTabs;
      for (var i = 0; i < numberOfTabs; i++) {
        var isActive = (activeTab === i);
        var offset = +isActive;
        vTabs[i].attr({
          width: length - 2 * offset,
          x: i * length + offset,
          y: offset,
          height: 20,
          stroke: (isActive) ? 'none' : model.prop('outlineColor'),
              fill: (isActive) ? model.prop('fillColor') : 'gray',
                  'data-index': i
        });
      }
    },

    updateText: function() {
      var model = this.model;
      var activeTab = model.prop('activeTab');
      var numberOfTabs = model.prop('numberOfTabs');
      var vTexts = this.vTexts;
      for (var i = 0; i < numberOfTabs; i++) {
        var vText = vTexts[i];
        if (i === activeTab) {
          var tx = model.prop('size/width') / 2;
          vText.attr({
            transform: 'translate(' + tx + ',30)',
            'text-anchor': 'middle'
          });
          this.vel.append(vText);
        } else {
          vText.remove();
        }
      }
    },

    toggleFade: function() {
      this.vel.attr('opacity', this.model.prop('faded') ? 0.2 : 1);
    },

    onTabClick: function(evt) {
      var index = +V(evt.target).attr('data-index');
      this.model.prop('activeTab', index);
    },

    onDblClick: function() {
      this.model.prop('faded', !this.model.prop('faded'));
    }

  }, {

    markup: {
      body: V('rect').addClass('body'),
      tab: V('rect').addClass('tab'),
      text: V('text').addClass('text')
    }

  });
  var _add_tabbed_tree_to_graph = function({graph}) {
    tabbed_root = new py_trees.shapes.TabbedRectangle;
    tabbed_root.prop('numberOfTabs', 4).position(50, 50).resize(100,100).addTo(graph)
    _.times(4, function(i) {
      var custom_element = new py_trees.shapes.TabbedRectangle;
      custom_element
        .prop('numberOfTabs', i)
        .resize(100, 100)
        .position(50 + (i % 2) * 150, 50 + (i < 2) * 150)
        .prop('fillColor', ['salmon', 'lightgreen', 'lightblue', 'lightgray'][i])
        .prop('faded', i === 1)
        .addTo(graph);
      link = _create_link({source: tabbed_root, target: custom_element})
      _links.push(link)
      link.addTo(graph)
    });
  }
  
  // *************************************************************************
  // Shapes (Models/Views)
  // *************************************************************************

  var _Node = joint.dia.Element.define(
      'Node', {
        size: { width: 180, height: 70 },
        attrs: {
          box: {
            width: 150, height: 60,
            // stroke: none
            fill: '#333333', stroke: '#000000', 'stroke-width': 2,
            'pointer-events': 'visiblePainted', rx: 10, ry: 10
          },
          type: {
            ref: 'box',
            refWidth: '20%', refHeight: '100%',
            fill: '#00FF00', stroke: '#000000', 'stroke-width': 2,
            'pointer-events': 'visiblePainted', rx: 10, ry: 10
          },

          name: {
             // 'font-weight': '800',
            'text-decoration': 'underline',
            fill: '#f1f1f1',
            ref: 'box', refX: 0.9, refY: 0.2,
            'font-family': 'Courier New', 'font-size': 14,
            'text-anchor': 'end'
          },

          details: {
            fill: '#f1f1f1',
            ref: 'box', 'ref-x': 0.9, 'ref-y': 0.6,
            'font-family': 'Arial', 'font-size': 10,
            'text-anchor': 'end',
          }
        }
      }, {
          markup: [{
              tagName: 'rect',
              selector: 'box'
          }, {
              tagName: 'rect',
              selector: 'type'
          }, {
              tagName: 'text',
              selector: 'name'
          }, {
              tagName: 'text',
              selector: 'details'
          }]
      });

  // *************************************************************************
  // PyTrees
  // *************************************************************************

  var _links = []
  var _nodes = {}

  var _update_graph = function({graph, tree}) {
    console.log("Adding tree to the graph")
    _nodes = {}
    _links = []
    for (behaviour in tree.behaviours) {
        node = _create_node({
            colour: tree.behaviours[behaviour].colour,
            name: tree.behaviours[behaviour].name,
            details: tree.behaviours[behaviour].data.feedback
        })
        _nodes[tree.behaviours[behaviour].id] = node
        node.addTo(graph)
    }
    for (behaviour in tree.behaviours) {
        console.log("  Name: " + tree.behaviours[behaviour].name)
        if ( typeof tree.behaviours[behaviour].children !== 'undefined') {
            console.log("    Children: " + tree.behaviours[behaviour].children)
            tree.behaviours[behaviour].children.forEach(function (child_id, index) {
                link = py_trees.create_link({
                    source: _nodes[tree.behaviours[behaviour].id],
                    target: _nodes[child_id],
                })
                _links.push(link)
                link.addTo(graph)
            });
        }
    }
  }
  var _layout_graph = function({graph}) {
    var graph_bounding_box = joint.layout.DirectedGraph.layout(graph, {
        marginX: 50,
        marginY: 50,
        nodeSep: 50,
        edgeSep: 80,
        rankDir: "TB"
    });
    console.log("Dot Graph Layout")
    console.log('  x:', graph_bounding_box.x, 'y:', graph_bounding_box.y)
    console.log('  width:', graph_bounding_box.width, 'height:', graph_bounding_box.height);
  }

  var _create_node = function({colour, name, details}) {
    node = new py_trees.shapes.Node({
      attrs: {
          'type': { fill: colour },
          'name': { text: name || 'Behaviour'},
          'details': { text: details || '...' }
      }
    })
    return node
  }

  var _create_link = function({source, target}) {
      var link = new joint.shapes.standard.Link();
      link.source(source)
      link.target(target)
      link.connector('smooth');
      return link
  }

  return {
    create_link: _create_link,
    create_node: _create_node,
    update_graph: _update_graph,
    layout_graph: _layout_graph,
    shapes: {
      Node: _Node,
    },
    experiments: {
      create_demo_tree_definition: _create_demo_tree_definition, 
      add_tabbed_tree_to_graph: _add_tabbed_tree_to_graph,
    },
  };
})(); // namespace py_trees

//          Rectangle: joint.shapes.standard.Rectangle,
//          Circle: joint.shapes.standard.Circle,
//          Ellipse: joint.shapes.standard.Ellipse,
//          Path: joint.shapes.standard.Path,
//          Polygon: joint.shapes.standard.Polygon,
//          Polyline: joint.shapes.standard.Polyline,
//          Image: joint.shapes.standard.Image,
//          BorderedImage: joint.shapes.standard.BorderedImage,
//          EmbeddedImage: joint.shapes.standard.EmbeddedImage,
//          InscribedImage: joint.shapes.standard.InscribedImage,
//          HeaderedRectangle: joint.shapes.standard.HeaderedRectangle,
//          Cylinder: joint.shapes.standard.Cylinder,
//          TextBlock: joint.shapes.standard.TextBlock,
//          Link: joint.shapes.standard.Link,
//          DoubleLink: joint.shapes.standard.DoubleLink,
//          ShadowLink: joint.shapes.standard.ShadowLink

