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
        # self.ui.web_engine_view.load(qt_core.QUrl("https://stackoverflow.com/"))
        self.ui.web_engine_view.load(qt_core.QUrl("qrc:/resources/html/index.html"))
