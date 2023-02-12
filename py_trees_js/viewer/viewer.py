#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_js/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################

"""A qt-javascript application for viewing executing or replaying py_trees."""

##############################################################################
# Imports
##############################################################################

import copy
import datetime
import functools
import os
import signal
import sys
import time

import PyQt5.QtCore as qt_core
import PyQt5.QtWidgets as qt_widgets

from . import console, main_window, trees

##############################################################################
# Helpers
##############################################################################


def send_tree_response(reply):
    """Confirm receipt of the tree by the js library."""
    console.logdebug("[{}] reply: '{}' [viewer]".format(time.monotonic(), reply))


@qt_core.pyqtSlot()
def send_tree(parameters, web_view_page, demo_trees, unused_checked):
    """Send a tree snapshot to the tree library."""
    number_of_trees = len(demo_trees)
    tree = copy.deepcopy(demo_trees[send_tree.index])
    tree["timestamp"] = time.time()
    # demo_trees[send_tree.index]['timestamp'] = time.time()
    console.logdebug(
        "[{}] send: tree '{}' [{}][viewer]".format(
            time.monotonic(), send_tree.index, tree["timestamp"]
        )
    )
    if not parameters.send_blackboard_data:
        del tree["blackboard"]["data"]
    if not parameters.send_activity_stream:
        del tree["activity"]
    javascript_command = "render_tree({{tree: {}}})".format(tree)
    web_view_page.runJavaScript(javascript_command, send_tree_response)
    send_tree.index = (
        0 if send_tree.index == (number_of_trees - 1) else send_tree.index + 1
    )


send_tree.index = 0


@qt_core.pyqtSlot()
def capture_screenshot(parent, web_engine_view, unused_checked):
    """Capture a screenshot."""
    console.logdebug("captured screenshot [viewer]")
    file_dialog = qt_widgets.QFileDialog(parent)
    file_dialog.setNameFilters(
        ["BMP Files (*.bmp)", "JPEG Files (*.jpeg)", "PNG Files (*.png)"]
    )
    file_dialog.selectNameFilter("PNG Files (*.png)")
    file_dialog.setDefaultSuffix((".png"))
    file_dialog.setAcceptMode(qt_widgets.QFileDialog.AcceptSave)
    # unfortunately creates a fair amount of spam on stdout
    #   'kf5.kio.core: Invalid URL: QUrl("screenshot.jpeg")'
    #   'kf5.kio.core: Invalid URL: QUrl("screenshot.png")'
    # but...it ain't broke
    file_dialog.selectFile(
        "screenshot_{}.png".format(datetime.datetime.now().strftime("%S%M%H%d%m%y"))
    )
    _ = file_dialog.exec()
    # should be able to restrict it to one file?
    for filename in file_dialog.selectedFiles():
        console.logdebug("capturing screenshot: {}".format(filename))
        # This would be simpler, but you can't specify a default filename, nor suffix on linux...
        #     filename, _ = qt_widgets.QFileDialog.getSaveFileName(
        #         parent=parent,
        #         caption="Export to Png",
        #         directory="screenshot_{}.png".format(datetime.datetime.now().strftime("%S%M%H%d%m%y")),
        #         # For multiple options, use ;;, e.g.
        #         #   'All Files (*);;BMP Files (*.bmp);;JPEG Files (*.jpeg);;PNG Files (*.png)'
        #         filter="BMP Files (*.bmp);;JPEG Files (*.jpeg);;PNG Files (*.png)",
        #         initialFilter="PNG Files (*.png)",
        #         options=options
        #     )
        #     if filename:
        #         console.loginfo("capturing screenshot: {}".format(filename))
        extension = os.path.splitext(filename)[-1].upper()
        if filename.endswith(".png"):
            extension = b"PNG"
        elif filename.endswith(".bmp"):
            extension = b"BMP"
        elif filename.endswith(".jpeg"):
            extension = b"JPEG"
        else:
            extension = b"PNG"
        web_engine_view.grab().save(filename, extension)


##############################################################################
# Main
##############################################################################


def main():
    """Entrypoint."""
    # logging
    console.log_level = console.LogLevel.DEBUG

    # the players
    app = qt_widgets.QApplication(sys.argv)
    window = main_window.MainWindow()

    # sig interrupt handling
    #   use a timer to get out of the gui thread and
    #   permit python a chance to catch the signal
    #   https://stackoverflow.com/questions/4938723/what-is-the-correct-way-to-make-my-pyqt-application-quit-when-killed-from-the-co
    def on_shutdown(unused_signal, unused_frame):
        console.logdebug("received interrupt signal [viewer]")
        window.close()

    signal.signal(signal.SIGINT, on_shutdown)
    timer = qt_core.QTimer()
    timer.timeout.connect(lambda: None)
    timer.start(250)

    # sigslots
    window.ui.send_button.clicked.connect(
        functools.partial(
            send_tree,
            window.parameters,
            window.ui.web_view_group_box.ui.web_engine_view.page(),
            trees.create_demo_tree_list(),
        )
    )
    window.ui.screenshot_button.clicked.connect(
        functools.partial(
            capture_screenshot,
            window,
            window.ui.web_view_group_box.ui.web_engine_view,
        )
    )

    # qt bringup
    window.show()
    result = app.exec_()

    # shutdown
    sys.exit(result)
