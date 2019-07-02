/*!
 * py_trees.js - 0.1.0
 */
/*****************************************************************************
 * Shapes
 ****************************************************************************/

var draw = (function() {

    return {
   
        /****************************************
         * Shapes
         ***************************************/
        rectangle: function({graphics, x, y, w, h, radius, bg_color, border_width, border_color}) {
            graphics.beginFill(bg_color);
            graphics.lineStyle(border_width, 0x0000FF);
            // graphics.beginStroke(border_color);
            graphics.drawRoundedRect(x-w/2, y-h/2, w, h, radius);
            // graphics.endStroke();
            graphics.endFill();
        }
    };
})();

