#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_js/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################

"""
Launch a qt dashboard for the tutorials.
"""
##############################################################################
# Imports
##############################################################################

import functools
import json
import time

import PyQt5.QtCore as qt_core
import PyQt5.QtWidgets as qt_widgets

from . import main_window_ui
from . import console

##############################################################################
# Helpers
##############################################################################


class Parameters(object):

    def __init__(self):
        self.send_blackboard_data = False
        self.send_activity_stream = False


##############################################################################
# Main Window
##############################################################################

class MainWindow(qt_widgets.QMainWindow):

    request_shutdown = qt_core.pyqtSignal(name="requestShutdown")

    def __init__(self):
        super().__init__()
        self.ui = main_window_ui.Ui_MainWindow()
        self.ui.setupUi(self)
        self.readSettings()
        self.ui.web_view_group_box.ui.web_engine_view.loadFinished.connect(
            self.on_load_finished
        )
        self.parameters = Parameters()
        self.ui.send_blackboard_data_checkbox.stateChanged.connect(self.on_blackboard_data_checked)
        self.ui.send_activity_stream_checkbox.stateChanged.connect(self.on_activity_stream_checked)

    @qt_core.pyqtSlot()
    def on_load_finished(self):
        console.logdebug("web page loaded [main window]")
        self.ui.send_button.setEnabled(True)
        self.ui.screenshot_button.setEnabled(True)
        self.ui.send_blackboard_data_checkbox.setEnabled(True)
        self.parameters.send_blackboard_data = True if self.ui.send_blackboard_data_checkbox.checkState() == qt_core.Qt.Checked else False
        self.ui.send_activity_stream_checkbox.setEnabled(True)
        self.parameters.send_activity_stream = True if self.ui.send_activity_stream_checkbox.checkState() == qt_core.Qt.Checked else False

    def on_blackboard_data_checked(self, state):
        self.parameters.send_blackboard_data = True if state == qt_core.Qt.Checked else False
        console.logdebug(
            "received blackboard data parameter change signal [send_blackboard_data: {}]".format(
                self.parameters.send_blackboard_data
            )
        )

    def on_activity_stream_checked(self, state):
        self.parameters.send_activity_stream = True if state == qt_core.Qt.Checked else False
        console.logdebug(
            "received blackboard activity parameter change signal [send_activity_stream: {}]".format(
                self.parameters.send_activity_stream
            )
        )

    def closeEvent(self, event):
        console.logdebug("received close event [main_window]")
        self.request_shutdown.emit()
        self.writeSettings()
        super().closeEvent(event)

    def readSettings(self):
        console.logdebug("read settings [main_window]")
        settings = qt_core.QSettings("Splintered Reality", "PyTrees Viewer")
        geometry = settings.value("geometry")
        if geometry is not None:
            self.restoreGeometry(geometry)
        window_state = settings.value("window_state")  # full size, maximised, minimised, no state
        if window_state is not None:
            self.restoreState(window_state)
        self.ui.send_blackboard_data_checkbox.setChecked(
            settings.value("send_blackboard_data", defaultValue=True, type=bool)
        )
        self.ui.send_activity_stream_checkbox.setChecked(
            settings.value("send_activity_stream", defaultValue=False, type=bool)
        )

    def writeSettings(self):
        console.logdebug("write settings [main_window]")
        settings = qt_core.QSettings("Splintered Reality", "PyTrees Viewer")
        settings.setValue("geometry", self.saveGeometry())
        settings.setValue("window_state", self.saveState())  # full size, maximised, minimised, no state
        settings.setValue(
            "send_blackboard_data",
            self.ui.send_blackboard_data_checkbox.isChecked()
        )
        settings.setValue(
            "send_activity_stream",
            self.ui.send_activity_stream_checkbox.isChecked()
        )
