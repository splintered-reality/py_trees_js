#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_ros_viewer/raw/devel/LICENSE
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

import signal
import sys

import PyQt5.QtWidgets as qt_widgets

# To use generated files instead of loading ui's directly
from . import gui

##############################################################################
# Helpers
##############################################################################


##############################################################################
# Main
##############################################################################

def main():
    # the players
    app = qt_widgets.QApplication(sys.argv)
    main_window = gui.main_window.MainWindow()

    # sig interrupt handling
    def on_shutdown(unused_signal, unused_frame):
        print("[viewer] shutting down!")
        main_window.close()
        print("[viewer] window closed")

    signal.signal(signal.SIGINT, on_shutdown)

    # qt ... up
    main_window.show()
    result = app.exec_()

    # shutdown
    sys.exit(result)
