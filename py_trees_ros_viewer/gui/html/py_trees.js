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

  return {
    shapes: {
      parallel: _parallel,
      Selector: _Selector,
    },
  };
})(); // namespace py_trees


