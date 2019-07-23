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
        size: { width: 170, height: 50 },
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
      });

  _NodeView = joint.dia.ElementView.extend({
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
          console.log("NodeView::render")
          joint.dia.ElementView.prototype.render.apply(this, arguments);
          this.listenTo(this.paper, 'scale', this.updateBox);
          this.listenTo(this.paper, 'translate', this.updateBox);
          this.paper.$el.prepend(this.$box);
          this.updateBox();
          return this;
      },
      // onDblClick: function() {
      //     console.log("***** Fading ******")
      //     this.model.prop('faded', !this.model.prop('faded'));
      // },
      updateBox: function() {
          // Set the position and dimension of the box so that it covers the JointJS element.
          var bbox = this.model.getBBox();
          // Example of updating the HTML with a data stored in the cell model.
          this.$box.find('span.html-name')[0].innerHTML = this.model.get('name')
          this.$box.find('span.html-detail')[0].innerHTML = this.model.get('details')
          // This sets both innerHTML and innerText..similar method for html?
          // this.$box.find('div.html-tooltip').text("Wahoooooooooooooooo")
          this.$box.find('div.html-tooltip')[0].innerHTML =
              "<div>#" +
              this.model.get('behaviour_id') +
              "</div>" +
              "<hr/>" +
              "<span><b>Name: </b>" +
              this.model.get('name') +
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
          // surprisingly, paper.scale() is available,
          // and ... this.paper is listed, but not available
          scale = paper.scale()
          // CSS
          this.$box.find('div.html-tooltip').css({
              width: '30em',
              left: 0.9*bbox.width*scale.sx,  // see below, parent is 0.8*bbox.wdith
          })
          this.$box.find('span.html-detail').css({
              'margin-top': 0.10*bbox.height*scale.sy,
              'margin-bottom': 0.15*bbox.height*scale.sy,
              'font-size': 10*scale.sy,
          })
          this.$box.find('span.html-name').css({
              'margin-top': 0.10*bbox.height*scale.sy,
              'margin-bottom': 0.15*bbox.height*scale.sy,
              'font-size': 14*scale.sy,
          })
          this.$box.css({
              // math says this should be 0.85/1.0, but not everything lining up correctly
              //   html-element top left corner is fine, but bottom-right corner is
              //   overhanging by some small delta in x and y directions
              width: 0.80*bbox.width*scale.sx,
              height: 0.95*bbox.height*scale.sy,
              left: bbox.x*scale.sx + 0.15*bbox.width*scale.sx,
              top: bbox.y*scale.sy,
              transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
          });
      },
      removeBox: function(evt) {
          this.$box.remove();
      }
  });

  // *************************************************************************
  // PyTrees
  // *************************************************************************

  var _links = []
  var _nodes = {}
  var _text_blocks = []

  var _create_name_text_block = function({name}) {
    var text_block = new joint.shapes.standard.TextBlock();
    text_block.resize(100, 100);
    text_block.position(250, 610);
    text_block.attr('root/title', 'joint.shapes.standard.TextBlock');
    text_block.attr('body/fill', 'lightgray');
    text_block.attr('label/text', 'Hyper Text Markup Language');
    // Styling of the label via `style` presentation attribute (i.e. CSS).
    text_block.attr('label/style/color', 'red');
    return text_block;
  }

  var _update_graph = function({graph, tree}) {
    console.log("Adding tree to the graph")
    _nodes = {}
    _links = []
    for (behaviour in tree.behaviours) {
        // at least name should go through, all others are optional
        node = _create_node({
            behaviour_id: tree.behaviours[behaviour].id,
            colour: tree.behaviours[behaviour].colour || '#555555',
            name: tree.behaviours[behaviour].name,
            status: tree.behaviours[behaviour].status || 'INVALID',
            details: tree.behaviours[behaviour].details || '...',
            data: tree.behaviours[behaviour].data || {},
        })
        _nodes[tree.behaviours[behaviour].id] = node
        node.addTo(graph)
    }
    for (behaviour in tree.behaviours) {
        console.log("  Name: " + tree.behaviours[behaviour].name)
        console.log("    Colour: " + tree.behaviours[behaviour].colour)
        console.log("    Details: " + tree.behaviours[behaviour].data.feedback)
        console.log("    Status: " + tree.behaviours[behaviour].status)

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

  var _create_node = function({behaviour_id, colour, name, details, status, data}) {
    elided_details = joint.util.breakText(
        details || '...',
        { width: 150, height:30 },
        {},
        { ellipsis: true }
    )
    node = new py_trees.shapes.Node({
      name: name,
      behaviour_id: behaviour_id,
      details: details,
      elided_details: elided_details,
      status: status,
      data: data,
      attrs: {
          'type': { fill: colour || '#555555' },
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
                    width: 2,
                    opacity: 0.5,
                    blur: 5
                }
            }
          },
        })
    }
    return node
  }

  var _create_link = function({source, target}) {
      var link = new joint.shapes.standard.Link();
      link.source(source)
      link.target(target)
      link.connector('smooth');
      return link
  }

  var _scale_canvas = function(paper, event, x, y, delta) {
      // TODO: how is it this function gets a handle to paper?
      scale = paper.scale()
      sx = scale.sx
      sy = scale.sy
      sx = (sx < 0.2 && delta < 0 ? sx : sx + delta / 10.0)
      sy = (sy < 0.2 && delta < 0  ? sy : sy + delta / 10.0)
      console.log("Scale: " + sx)
      paper.scale(sx, sy)
      // paper.render()  / why does this produce a black screen?
  }

  return {
    create_link: _create_link,
    create_node: _create_node,
    layout_graph: _layout_graph,
    scale_canvas: _scale_canvas,
    update_graph: _update_graph,
    shapes: {
      Node: _Node,
      NodeView: _NodeView,
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

