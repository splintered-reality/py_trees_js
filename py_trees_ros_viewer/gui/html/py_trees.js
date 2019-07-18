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

  return {
    shapes: {
      parallel: _parallel,
      Selector: _Selector,
      TabbedRectangle: _TabbedRectangle,
      TabbedRectangleView: _TabbedRectangleView,

//      Rectangle: joint.shapes.standard.Rectangle,
//      Circle: joint.shapes.standard.Circle,
//      Ellipse: joint.shapes.standard.Ellipse,
//      Path: joint.shapes.standard.Path,
//      Polygon: joint.shapes.standard.Polygon,
//      Polyline: joint.shapes.standard.Polyline,
//      Image: joint.shapes.standard.Image,
//      BorderedImage: joint.shapes.standard.BorderedImage,
//      EmbeddedImage: joint.shapes.standard.EmbeddedImage,
//      InscribedImage: joint.shapes.standard.InscribedImage,
//      HeaderedRectangle: joint.shapes.standard.HeaderedRectangle,
//      Cylinder: joint.shapes.standard.Cylinder,
//      TextBlock: joint.shapes.standard.TextBlock,
//      Link: joint.shapes.standard.Link,
//      DoubleLink: joint.shapes.standard.DoubleLink,
//      ShadowLink: joint.shapes.standard.ShadowLink
    },
  };
})(); // namespace py_trees


