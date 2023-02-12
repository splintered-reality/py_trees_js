# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'main_window.ui'
#
# Created by: PyQt5 UI code generator 5.10.1
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets


class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(1645, 851)
        icon = QtGui.QIcon()
        icon.addPixmap(
            QtGui.QPixmap(":/images/tuxrobot.png"), QtGui.QIcon.Normal, QtGui.QIcon.Off
        )
        MainWindow.setWindowIcon(icon)
        self.central_display = QtWidgets.QWidget(MainWindow)
        self.central_display.setObjectName("central_display")
        self.central_horizontal_layout = QtWidgets.QHBoxLayout(self.central_display)
        self.central_horizontal_layout.setObjectName("central_horizontal_layout")
        self.web_view_group_box = WebViewGroupBox(self.central_display)
        self.web_view_group_box.setObjectName("web_view_group_box")
        self.central_horizontal_layout.addWidget(self.web_view_group_box)
        MainWindow.setCentralWidget(self.central_display)
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 1645, 29))
        self.menubar.setDefaultUp(False)
        self.menubar.setObjectName("menubar")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)
        self.dock_widget = QtWidgets.QDockWidget(MainWindow)
        self.dock_widget.setObjectName("dock_widget")
        self.dock_widget_contents = QtWidgets.QWidget()
        self.dock_widget_contents.setObjectName("dock_widget_contents")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.dock_widget_contents)
        self.verticalLayout.setObjectName("verticalLayout")
        self.send_button = QtWidgets.QPushButton(self.dock_widget_contents)
        self.send_button.setEnabled(False)
        self.send_button.setObjectName("send_button")
        self.verticalLayout.addWidget(self.send_button)
        self.screenshot_button = QtWidgets.QPushButton(self.dock_widget_contents)
        self.screenshot_button.setEnabled(False)
        self.screenshot_button.setObjectName("screenshot_button")
        self.verticalLayout.addWidget(self.screenshot_button)
        self.send_blackboard_data_checkbox = QtWidgets.QCheckBox(
            self.dock_widget_contents
        )
        self.send_blackboard_data_checkbox.setEnabled(False)
        self.send_blackboard_data_checkbox.setCheckable(True)
        self.send_blackboard_data_checkbox.setChecked(True)
        self.send_blackboard_data_checkbox.setObjectName(
            "send_blackboard_data_checkbox"
        )
        self.verticalLayout.addWidget(self.send_blackboard_data_checkbox)
        self.send_activity_stream_checkbox = QtWidgets.QCheckBox(
            self.dock_widget_contents
        )
        self.send_activity_stream_checkbox.setEnabled(False)
        self.send_activity_stream_checkbox.setChecked(False)
        self.send_activity_stream_checkbox.setObjectName(
            "send_activity_stream_checkbox"
        )
        self.verticalLayout.addWidget(self.send_activity_stream_checkbox)
        spacerItem = QtWidgets.QSpacerItem(
            20, 218, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding
        )
        self.verticalLayout.addItem(spacerItem)
        self.dock_widget.setWidget(self.dock_widget_contents)
        MainWindow.addDockWidget(QtCore.Qt.DockWidgetArea(1), self.dock_widget)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "PyTrees Viewer"))
        self.web_view_group_box.setTitle(_translate("MainWindow", "Tree View"))
        self.send_button.setText(_translate("MainWindow", "Send Tree"))
        self.screenshot_button.setText(_translate("MainWindow", "Screenshot"))
        self.send_blackboard_data_checkbox.setText(
            _translate("MainWindow", "Send Blackboard Data")
        )
        self.send_activity_stream_checkbox.setText(
            _translate("MainWindow", "Send Activity Stream")
        )


from py_trees_js.viewer.web_view import WebViewGroupBox
from . import images_rc
