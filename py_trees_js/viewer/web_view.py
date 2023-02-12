#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# License: BSD
#   https://github.com/splintered-reality/py_trees_js/raw/devel/LICENSE
#
##############################################################################
# Documentation
##############################################################################

"""Launch a qt dashboard for the tutorials."""

##############################################################################
# Imports
##############################################################################

import PyQt5.QtCore as qt_core
import PyQt5.QtWidgets as qt_widgets

# Import the javascript libraries (via qrc bundles)
import py_trees_js.resources  # noqa: F401

from . import web_view_ui

##############################################################################
# Helpers
##############################################################################


class WebViewGroupBox(qt_widgets.QGroupBox):
    """Promotable class (in Designer) for the web view group box."""

    change_battery_percentage = qt_core.pyqtSignal(
        float, name="changeBatteryPercentage"
    )
    change_battery_charging_status = qt_core.pyqtSignal(
        bool, name="changeBatteryChargingStatus"
    )
    change_safety_sensors_enabled = qt_core.pyqtSignal(
        bool, name="safetySensorsEnabled"
    )

    def __init__(self, parent):
        super().__init__(parent)
        self.ui = web_view_ui.Ui_WebViewGroupBox()
        self.ui.setupUi(self)
        # Currently auto-loading the web app (index.html) from the url setting
        # via Designer, so everything is self-contained in Ui_WebViewGroupBox setup.
        #
        # Alternatively, set the dynamic property for the
        # WebEngineView's URL to about:blank and load manually:
        #
        # self.ui.web_engine_view.load(qt_core.QUrl("qrc:/index.html"))
