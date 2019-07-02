/*!
 * py_trees.js - 0.1.0
 */
var py_trees = (function() {
	
/*****************************************************************************
 * Shapes
 ****************************************************************************/
var makeRect = function(graphics, w, h, radius, bg_color, border_width, border_color) {
    graphics.beginFill(bg_color);
    graphics.setStrokeStyle(border_width, 'round');
    graphics.beginStroke(border_color);
    graphics.drawRoundRect(-w/2, -h/2, w, h, radius);
    graphics.endStroke();
    graphics.endFill();
};

/*****************************************************************************
 * Behaviour Types
 ****************************************************************************/

