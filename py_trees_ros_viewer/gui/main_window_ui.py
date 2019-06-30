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
        MainWindow.resize(551, 356)
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(":/images/tuxrobot.png"), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        MainWindow.setWindowIcon(icon)
        self.central_layout = QtWidgets.QWidget(MainWindow)
        self.central_layout.setObjectName("central_layout")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.central_layout)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.dashboard_group_box = DashboardGroupBox(self.central_layout)
        self.dashboard_group_box.setTitle("Dashboard")
        self.dashboard_group_box.setObjectName("dashboard_group_box")
        self.horizontalLayout.addWidget(self.dashboard_group_box)
        self.configuration_group_box = ConfigurationGroupBox(self.central_layout)
        self.configuration_group_box.setObjectName("configuration_group_box")
        self.horizontalLayout.addWidget(self.configuration_group_box)
        MainWindow.setCentralWidget(self.central_layout)
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 551, 29))
        self.menubar.setDefaultUp(False)
        self.menubar.setObjectName("menubar")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "Robot Mock"))
        self.configuration_group_box.setTitle(_translate("MainWindow", "Configuration"))

from py_trees_ros_tutorials.mock.gui.configuration_group_box import ConfigurationGroupBox
from py_trees_ros_tutorials.mock.gui.dashboard_group_box import DashboardGroupBox
from . import main_window_rc
