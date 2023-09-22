import sys
import os
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import (QGridLayout, QPushButton, QLineEdit, QDialog, QApplication, QLabel, QFileDialog)
from PyQt5 import QtCore, QtWidgets
  
class NewProjectDialog(QDialog):
    def __init__(self, parent=None):
        super(NewProjectDialog, self).__init__(parent)
        self.info = {}
        self.initUI()

    def initUI(self):
        self.setMinimumSize(500, 200)

        layout = QGridLayout()

        layout.addWidget(QLabel('Project'), 0, 0)
        self.QLE_project_name = QLineEdit()
        self.QLE_project_name.editingFinished.connect(self.update_dataset)
        layout.addWidget(self.QLE_project_name, 0, 1, 1, 2)
        
        layout.addWidget(QLabel('Dataset'), 1, 0)
        self.QLE_dataset_name = QLineEdit()
        layout.addWidget(self.QLE_dataset_name, 1, 1, 1, 2)
        
        layout.addWidget(QLabel('Video File'), 2, 0)
        self.QLE_video_path = QLineEdit()
        layout.addWidget(self.QLE_video_path, 2, 1)
        self.btn = QPushButton("Browse")
        self.btn.clicked.connect(self.getfile)
        layout.addWidget(self.btn, 2, 2)

        self.btnCP = QPushButton("Create Project")
        self.btnCP.clicked.connect(self.createProject)
        layout.addWidget(self.btnCP, 3, 0, 1, 3)

        self.setLayout(layout)
        self.setWindowTitle("Create New Project")

    def update_dataset(self):
        if str(self.QLE_dataset_name.text()) == '':
            self.QLE_dataset_name.setText(self.QLE_project_name.text())

    def getfile(self):
       response = QFileDialog.getOpenFileName(self, 'Open file', os.path.expanduser('~'),"Image files (*.mp4 *.mov)")
       self.QLE_video_path.setText(response[0])

    @QtCore.pyqtSlot()
    def createProject(self):
        self.info['project_name'] = str(self.QLE_project_name.text())
        self.info['dataset_name'] = str(self.QLE_dataset_name.text())
        self.info['video_path'] = str(self.QLE_video_path.text())
        self.accept()


#########################################################################
# PySimpleGUI Method
#########################################################################
# import PySimpleGUI as sg
# import copy
# class file_manager:
#     def __init__(self):
#         sg.theme('Light Blue 2')

#         self.layout = [
#             [sg.Text('Project Name', size=(20, 1)), sg.Input()],
#             [sg.Text('Default Dataset', size=(20, 1)), sg.Input()],
#             [sg.Text('Video', size=(20, 1)), sg.Input(), sg.FileBrowse()],
#             [sg.Submit(), sg.Cancel()]]

#     def create_new_project(self):
#         current_layout = copy.deepcopy(self.layout)
#         window = sg.Window('Select Video').Layout(current_layout)
#         event, values = window.read()
#         window.hide()

#         print(event, values)

#         return values[0], values[1], values[2]