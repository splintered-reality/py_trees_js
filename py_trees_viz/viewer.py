#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_viz/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################
"""
A qt-javascript application for viewing executing or replaying py_trees
"""
##############################################################################
# Imports
##############################################################################

import functools
import json
import signal
import sys

import PyQt5.QtCore as qt_core
import PyQt5.QtWidgets as qt_widgets

# To use generated files instead of loading ui's directly
from . import console
from . import gui
from . import trees

##############################################################################
# Helpers
##############################################################################


def send_tree_response(reply):
    console.logdebug("reply: '{}' [viewer]".format(reply))


@qt_core.pyqtSlot()
def send_tree(web_view_page, unused_checked):
    send_tree.index = 0 if send_tree.index == 2 else send_tree.index + 1
    console.logdebug("send: tree '{}' [viewer]".format(send_tree.index))
    json_trees = trees.create_demo_tree_json_list()
    web_view_page.runJavaScript(
        "render_tree({tree: '%s'});" % json_trees[send_tree.index],
        send_tree_response
    )


send_tree.index = 0

##############################################################################
# Main
##############################################################################


def main():
    # logging
    console.log_level = console.LogLevel.DEBUG

    # the players
    app = qt_widgets.QApplication(sys.argv)
    main_window = gui.main_window.MainWindow(
        default_tree=trees.create_demo_tree_json_list()[0]
    )

    # sig interrupt handling
    #   use a timer to get out of the gui thread and
    #   permit python a chance to catch the signal
    #   https://stackoverflow.com/questions/4938723/what-is-the-correct-way-to-make-my-pyqt-application-quit-when-killed-from-the-co
    def on_shutdown(unused_signal, unused_frame):
        console.logdebug("received interrupt signal [viewer]")
        main_window.close()

    signal.signal(signal.SIGINT, on_shutdown)
    timer = qt_core.QTimer()
    timer.timeout.connect(lambda: None)
    timer.start(250)

    # sigslots
    main_window.ui.send_button.clicked.connect(
        functools.partial(
             send_tree,
             main_window.ui.web_view_group_box.ui.web_engine_view.page()
        )
    )
    # qt bringup
    main_window.show()
    result = app.exec_()

    # shutdown
    sys.exit(result)
