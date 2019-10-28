# Timings

0.001 : execute command from qt
0.000 : check pop and push tree to cache dictionary
0.008 : _timeline_rebuild_event_cache_markers
0.495 : _canvas_update_graph
  0.000 : set graph splash
  0.000 : extract interactive info
  0.000 : json verification
  0.002 : clear graph
  0.078 : create nodes
  0.384 : create links    <---------------- SLOW
  0.000 : re-establish interactivity
0.490 : _canvas_layout_graph        <---------------- SLOW
0.025 : _canvas_scale_content_to_fit
0.001 : return result to qt