# Developing

# Indirectly via the Qt App

...

# Directly from a Browser

## Chrome

### Debugging

To get to the javascript console, `CTRL-SHIFT-J`.

### Problems

Will block you from rendering images on the local filesystem:

```
Access to image at 'file:///mnt/mervin/workspaces/dashing/py_trees/src/py_trees_ros_viewer/py_trees_ros_viewer/gui/html/images/tuxrobot.png' from origin 'null' has been blocked by CORS policy: The response is invalid.
```

Use `--args --allow-file-access-from-files` to workaround that while developing (will require a
new instance of chrome to be running), but you'll need to serve those files for shipping.

## Firefox

### Debugging

1. In `about:config` set `devtools.chrome.enabled` to true
2. Redirect the chrome manifest, `sudo ln -s /usr/lib/firefox/browser/chrome.manifest /usr/lib/firefox/chrome.manifest`

In your application, to get to the javascript console, `CTRL-SHIFT-J`.

### Problems

The javascript console doesn't show the pixi logging.
