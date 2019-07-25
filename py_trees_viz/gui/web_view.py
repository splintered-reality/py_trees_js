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
Launch a qt dashboard for the tutorials.
"""
##############################################################################
# Imports
##############################################################################

import PyQt5.QtWidgets as qt_widgets
import PyQt5.QtCore as qt_core

from . import web_view_ui

##############################################################################
# Helpers
##############################################################################


class WebViewGroupBox(qt_widgets.QGroupBox):
    """
    Convenience class that Designer can use to promote
    elements for layouts in applications.
    """

    change_battery_percentage = qt_core.pyqtSignal(float, name="changeBatteryPercentage")
    change_battery_charging_status = qt_core.pyqtSignal(bool, name="changeBatteryChargingStatus")
    change_safety_sensors_enabled = qt_core.pyqtSignal(bool, name="safetySensorsEnabled")

    def __init__(self, parent):
        super().__init__(parent)
        self.ui = web_view_ui.Ui_WebViewGroupBox()
        self.ui.setupUi(self)
        # Auto-loading from the url setting via Designer.
        # Note: if you wish to manually determine what is loaded from python,
        # you can refuse to load anything  by default (to avoid the
        # twice-loadfinished trigger issue) you can remove it as a dynamic
        # property via designer
        # self.ui.web_engine_view.load(qt_core.QUrl("qrc:/resources/html/index.html"))
        self.ui.web_engine_view.loadFinished.connect(self.on_load_finished)

    @qt_core.pyqtSlot()
    def on_load_finished(self):
        print("Post load setup")
        self.send_tree()

    def send_tree(self):
        print("Sending Tree to JS App")
        self.ui.web_engine_view.page().runJavaScript(
            "foo();",
            self.send_tree_response
        )

    def send_tree_response(self, reply):
        print("Reply: {}".format(reply))
