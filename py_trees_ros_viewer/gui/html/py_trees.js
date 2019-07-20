/*!
 * py_trees.js - 0.1.0
 */
var py_trees = (function() {

  var _parallel = function({name, message}) {
    var headered_rectangle = new joint.shapes.standard.HeaderedRectangle();
    headered_rectangle.resize(150, 100);
    headered_rectangle.attr('root/title', 'joint.shapes.standard.HeaderedRectangle');
    headered_rectangle.attr('header/fill', 'maroon');
    headered_rectangle.attr('headerText/text', 'Name');
    headered_rectangle.attr('headerText/fill', 'lightgray');
    headered_rectangle.attr('body/fill', 'orange');
    headered_rectangle.attr('bodyText/text', 'Message');
    return headered_rectangle
  }

  var _Selector = joint.shapes.standard.Rectangle.define(
      'Selector',
      {
        attrs: {
          body: {
            // rx: 10, // add a corner radius
            // ry: 10,
            // strokeWidth: 1,
            fill: 'blue'
          },
          label: {
            //textAnchor: 'left', // align text to left
            //refX: 10, // offset text from right edge of model bbox
            text: 'Hello',
            fill: 'white',
            //fontSize: 18
          }
        }
      }, {
        // inherit joint.shapes.standard.Rectangle.markup
      }, {
        // no new methods
      }
  )

  // *************************************************************************
  // Tabbed Boxes - https://jsfiddle.net/kumilingus/Lznzjqmk/
  // *************************************************************************
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
  var _create_tabbed_tree = function({graph}) {
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
      _create_link({source: tabbed_root, target: custom_element})
    });
  }
  
  // *************************************************************************
  // Base Node Class
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
  // PyTree Classes
  // *************************************************************************

  var _create_sequence = function({name, details}) {
    node = new _Node({
          attrs: {
              'type': { fill: '#FFA500' },
              'name': { text: name || 'Sequence' },
              'details': { text: details || '...' }
          }
      });
    return node
  }
  var _create_selector = function({name, details}) {
      node = new _Node({
            attrs: {
                'type': { fill: '#00FFFF' },
                'name': { text: name || 'Selector' },
                'details': { text: details || '...' }
            }
        });
      return node
    }
  var _create_parallel = function({name, details}) {
    elided_details = joint.util.breakText(
        details || '...',
        { width: 150, height:30 },
        {},
        { ellipsis: true }
    )
    node = new _Node({
            attrs: {
                'type': { fill: '#FFFF00' },
                'name': { text: name || 'Parallel'},
                'details': { text: elided_details }
            }
        });
      return node
    }
  var _create_decorator = function({name, details}) {
      node = new _Node({
              attrs: {
                  'type': { fill: '#DDDDDD' },
                  'name': { text: name || 'Decorator'},
                  'details': { text: details || '...' }
              }
          });
        return node
      }
  var _create_behaviour = function({name, details}) {
      node = new _Node({
              attrs: {
                  'type': { fill: '#555555' },
                  'name': { text: name || 'Behaviour'},
                  'details': { text: details || '...' }
              }
          });
        return node
      }

  var _links = []

  var _create_link = function({source, target}) {
      var link = new joint.shapes.standard.Link();
      link.source(source)
      link.target(target)
      link.connector('smooth');
      link.addTo(graph)
      _links.push(link)
  }


  return {
    shapes: {
      parallel: _parallel,
      Selector: _Selector,
      TabbedRectangle: _TabbedRectangle,
      TabbedRectangleView: _TabbedRectangleView,
      // Node: _Node,
      create_sequence: _create_sequence,
      create_selector: _create_selector,
      create_parallel: _create_parallel,
      create_decorator: _create_decorator,
      create_behaviour: _create_behaviour,
      create_link: _create_link,
    },
    experiments: {
      create_tabbed_tree: _create_tabbed_tree,
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

