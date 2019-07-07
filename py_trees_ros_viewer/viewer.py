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

import PyQt5.QtCore as qt_core
import PyQt5.QtWidgets as qt_widgets

# To use generated files instead of loading ui's directly
from . import console
from . import gui

##############################################################################
# Helpers
##############################################################################


##############################################################################
# Main
##############################################################################

def main():
    # logging
    console.log_level = console.LogLevel.DEBUG

    # the players
    app = qt_widgets.QApplication(sys.argv)
    main_window = gui.main_window.MainWindow()

    # sig interrupt handling
    #   use a timer to get out of the gui thread and
    #   permit python a chance to catch the signal
    #   https://stackoverflow.com/questions/4938723/what-is-the-correct-way-to-make-my-pyqt-application-quit-when-killed-from-the-co
    def on_shutdown(unused_signal, unused_frame):
        console.logdebug("shutting down [viewer]")
        main_window.close()

    signal.signal(signal.SIGINT, on_shutdown)
    timer = qt_core.QTimer()
    timer.timeout.connect(lambda: None)
    timer.start(250)

    # qt bringup
    main_window.show()
    result = app.exec_()

    # shutdown
    sys.exit(result)
