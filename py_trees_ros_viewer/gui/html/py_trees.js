/*!
 * py_trees.js - 0.1.0
 */
var py_trees = (function() {

  return {
    /****************************************
     * Behaviour Types
     ***************************************/
    parallel: function({name, message}) {
      var headered_rectangle = new joint.shapes.standard.HeaderedRectangle();
      headered_rectangle.resize(150, 100);
      headered_rectangle.attr('root/title', 'joint.shapes.standard.HeaderedRectangle');
      headered_rectangle.attr('header/fill', 'maroon');
      headered_rectangle.attr('headerText/text', 'Name');
      headered_rectangle.attr('headerText/fill', 'lightgray');
      headered_rectangle.attr('body/fill', 'orange');
      headered_rectangle.attr('bodyText/text', 'Message');
      return headered_rectangle
    },

    sequence: function({name, message}) {
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
  };
})();


