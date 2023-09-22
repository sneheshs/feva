import os
import time
import json
import shutil
import logging
from enum import IntEnum

'''
    ENUM for save data history formatting
'''


class DATA_CHANGE_TYPE(IntEnum):
    TEXT = 0
    TYPE = 1
    TIME = 2
    ADD_DELETE = 3


'''
    MESSAGES for responses
'''


class RESPONSE_MESSAGES():
    SAVE_SUCCESS = 'Save Successful'
    SAVE_FAIL = 'Save Failed'
    SAVE_AS_SUCCESS = 'Save As Successful'
    SAVE_AS_FAIL = 'Save As Failed'


ROOT_FOLDER = 'static/data/'

'''
    Dataset class handles all dataset related functionalities
    Dataset format version 2.0 (No backward compatibility included in this)
'''


class dataset:
    def __init__(self, project_name, dataset_name):
        # TODO: Throw exception if project_name or dataset_name is blank

        self.parent = None          # To store parent project handler
        self.name = dataset_name

        # old label_reference -- defaults
        # self.tracks = { 'event': [1, '#874DA1'], 'action': [2, '#AB092A'], 'speech': [3, '#D44A00'], 'emotion': [4, '#0965AB'] }
        self.tracks = {}

        now = self.get_current_date_time()
        self.header = {
            'date_created': now,
            'date_modified': now,
            'project': project_name,
            'schema_version': '2.0',
            'version': 0,
            'labels': self.tracks
        }

        self.labels = {}

        self.raw_data = {}
        self.raw_data['header'] = self.header
        self.raw_data['data'] = self.labels

    def update_dataset(self):
        self.header['date_modified'] = self.get_current_date_time()

        if 'version' in self.header:
            self.header['version'] = self.header['version'] + 1
        else:
            self.header['version'] = 0

        self.header['labels'] = self.tracks

        self.raw_data['header'] = self.header

    def get_current_date_time(self):
        return int(time.time() * 1000000)

    def load_dataset(self):
        self.raw_data = json.load(
            open(ROOT_FOLDER + self.header['project'] + '/' + self.name + '.dat'))

        if 'header' in self.raw_data:
            self.header = self.raw_data['header']

            if 'project' not in self.header:
                self.header['project'] = self.parent.name

            if 'labels' in self.header:
                self.tracks = self.header['labels']
            else:
                self.tracks = {}

            if 'data' in self.raw_data:
                self.labels = self.raw_data['data']
            else:
                self.labels = {}
        else:
            # Throw error for old version file
            self.labels = self.raw_data

    def save_dataset(self, changedData=None, force=False):
        #logging.info('Changed Data %s', changedData)

        if not force:
            if changedData == None or changedData == '':
                return False, RESPONSE_MESSAGES.SAVE_FAIL

            if changedData == '{}':
                logging.info('Nothing to save! %s', changedData)
                return False, RESPONSE_MESSAGES.SAVE_FAIL

            changes = json.loads(changedData)
            logging.info('changes:')

            # # ## NEW METHOD
            for indx in changes:
                logging.info('%s: %s', indx, changes[indx])

                newLabel = [changes[indx]['type'], changes[indx]
                            ['start'], changes[indx]['end'], changes[indx]['text']]

                if changes[indx]['deleted']:
                    if changes[indx]['id'] in self.labels:
                        logging.info(
                            'Deleting %s', self.labels[changes[indx]['id']])
                        del self.labels[changes[indx]['id']]
                    else:
                        # Nothing to do -- probably a new label created and then deleted
                        logging.info('No need to delete %s', newLabel)

                else:
                    if changes[indx]['id'] in self.labels:
                        logging.info(
                            'Updating %s', self.labels[changes[indx]['id']])
                    else:
                        logging.info('Adding %s', newLabel)

                    self.labels[changes[indx]['id']] = newLabel

        # Update header
        self.update_dataset()

        logging.info('header project %s, dataset name %s',
                     self.header['project'], self.name)

        new_save = open(
            ROOT_FOLDER + self.header['project'] + '/' + self.name + '.dat', 'w')
        new_save.write(json.dumps(self.raw_data, indent=4, sort_keys=True))
        new_save.close()

        return True, RESPONSE_MESSAGES.SAVE_SUCCESS

    def save_as_dataset(self, new_name, changedData=None):
        # Check if already exists, if not, set and save
        if os.path.exists(ROOT_FOLDER + self.header['project'] + '/' + new_name + '.dat'):
            # str({ 'status': RESPONSE_MESSAGES.SAVE_AS_FAIL })
            return False, RESPONSE_MESSAGES.SAVE_AS_FAIL
        else:
            self.name = new_name

            if changedData is None or changedData is '' or changedData == '{}':
                success, message = self.save_dataset(changedData, force=True)
            else:
                success, message = self.save_dataset(changedData)

            if not success:
                # str({ 'status': RESPONSE_MESSAGES.SAVE_AS_FAIL })
                return success, RESPONSE_MESSAGES.SAVE_AS_FAIL
            else:
                # str({ 'status': RESPONSE_MESSAGES.SAVE_AS_SUCCESS, 'data': self.parent.get_dataset_list() })
                return success, RESPONSE_MESSAGES.SAVE_AS_SUCCESS

    # HEADER
    # --------------------------------------------------

    # TRACKS
    # --------------------------------------------------

    def track_get_list(self):
        return self.tracks

    def track_add_new(self, name, number, color):
        for cur_track in self.tracks:
            if str(number) == str(self.tracks[cur_track][0]):
                message = "New Track NOT Added: "+ str(number) + " "  + str(self.tracks[cur_track])
                logging.debug(message)
                return False, message

        if not color[0] == '#':
            color = '#' + color

        self.tracks[name] = [number, color]
        message = "New Track Added: "+ str(number) + " "  + str(self.tracks[name])
        logging.debug(message)
        return True, message

    def track_rename(self, old_name, new_name):
        # Check name already exists
        if new_name not in self.tracks:
            self.tracks[new_name] = self.tracks.pop(old_name)
            return True, "Track Renamed"
        else:
            return False, "Track Name Already Exists. Track Name Must be Unique."

    def track_change_color(self, track_name, new_color):
        if track_name in self.tracks:
            self.tracks[track_name][1] = new_color
            return True, "Track Color Changed"
        else:
            return False, "Track Name Not Found"

    def track_change_number(self, track_name, new_number):
        # check name track name exists
        if track_name not in self.tracks:
            message = "Track Name Not Found: " + track_name
            logging.debug(message)
            return False, message

        # check number conflict, if yes, return false or generate a new number
        for tn in self.tracks:
            if self.tracks[tn][0] == new_number:
                message = "New Track ID already exists: " + str(new_number)
                logging.debug(message)
                return False, "Track number changed"

        # Change trak name
        old_number = self.tracks[track_name][0]
        self.tracks[track_name][0] = new_number

        # Change all the label numbers also
        for label_id in self.labels:
            if str(self.labels[label_id][0]) == str(old_number):
                self.label_change_type(label_id, new_number)

        return True, "Track number changed"

    # TODO: Need mechanism to be able to undo this -- when track is removed all associated labels are removed
    def track_detele(self, track_name, remove_associated_labels=True):

        # Remove label from the header
        for type_name in self.tracks:
            if str(self.tracks[type_name][0]) == str(track_name):
                logging.info('deleteTrack %s', self.tracks[type_name])
                could_store_to_history = self.tracks[type_name].pop()
                break

        # Remove all associated labels
        if remove_associated_labels:
            labels_to_remove = []
            for label_id in self.labels:
                if str(self.labels[label_id][0]) == str(self.tracks[track_name][0]):
                    labels_to_remove.append(label_id)

            for label_id in labels_to_remove:
                self.label_delete(label_id)

        return True, "Track updated"

    # LABELS
    # --------------------------------------------------

    def label_get_list(self):
        return self.labels

    # TODO: Check for validity and fix time format etc
    def label_create_new(self, id, label_type, text, start_time, end_time):
        self.labels[id] = [label_type, start_time, end_time, text]

    def label_change_text(self, id, new_text):
        self.labels[id][3] = new_text

    # Basically change track
    def label_change_type(self, id, new_type):
        # Check if track exists
        self.labels[id][0] = new_type

    def label_change_start_time(self, id, new_start_time):
        # TODO: Check if start time <= end time
        self.labels[id][1] = new_start_time

    def label_change_end_time(self, new_end_time):
        # TODO: Check if end time >= start time
        self.labels[id][2] = new_end_time

    def label_delete(self, id):
        could_store_to_history = self.labels[id].pop()


'''
    Project Class handles all project related functionalities
'''


class project:
    def __init__(self):
        self.name = ''
        self.datasets = []
        self.default_dataset = ''
        self.current_dataset = None
        self.user_config = None

    def create_new_project(self, name):
        # Check if folder already exists, if not create new
        if os.path.exists(ROOT_FOLDER + name):
            # TODO: Throw error
            logging.warning('create_new_project %s already exists!', name)
            return False, "Project Name Already Exists"
        else:
            self.name = name
            os.mkdir(ROOT_FOLDER + name)
            
            return True, "Project Created"

            # TODO:
            # video file setup?
            # dataset setup
            # defaults

    def copy_video_to_project(self, video_full_path):
        if os.path.exists(video_full_path):
            shutil.copyfile(video_full_path, ROOT_FOLDER + self.name + '/' +
                            self.name + video_full_path[video_full_path.rfind('.'):])
            return True, "Video copied"
        else:
            return False, "Video not found"

    def move_video_to_project(self, video_full_path):
        if os.path.exists(video_full_path):
            shutil.move(video_full_path, ROOT_FOLDER + self.name + '/' +
                        self.name + video_full_path[video_full_path.rfind('.'):])
            return True, "Video Moved"
        else:
            return False, "Video not found"

    def load_project(self, name):
        # Check if folder exists
        if os.path.exists(ROOT_FOLDER + name):
            # if exists set name and load datasets
            self.name = name
            self.get_dataset_list()
            self.current_dataset = None

            return True, "Project Loaded"

            # TODO: If default already set from userconfig.json only do this
            # get user_config handle from PM and get default dataset name for this project
            # if exists load, if not do nothing
            # self.load_dataset()
            # Since front-end decides if the default dataset is loaded or not, we'll let the front end make the call
            # so clean this up next time

        else:
            return False, "Project not found"

    # DATASET
    # ----------------------------------------------------------------

    def get_dataset_list(self):
        project_files = sorted(os.listdir(ROOT_FOLDER + self.name))

        self.datasets.clear()
        for dataset_file in project_files:
            if os.path.isfile(ROOT_FOLDER + self.name + '/' + dataset_file):
                if dataset_file[dataset_file.rfind('.'):] == '.dat':
                    # avoid duplicates
                    if dataset_file[:-4] not in self.datasets:
                        self.datasets.append(dataset_file[:-4])

        return sorted(self.datasets)

    def load_dataset(self, dataset_name):
        # do_load = False
        if dataset_name in self.datasets:
            # if self.current_dataset == None:
            #     do_load = True
            # elif not dataset_name == self.current_dataset.name:  # If not already loaded
            #     do_load = True
            # if do_load:
            # If there is a request -- load the data (re-load the data if loaded)
            self.current_dataset = dataset(self.name, dataset_name)
            self.current_dataset.parent = self
            self.current_dataset.load_dataset()
            self.set_default_dataset(dataset_name)
            return True, "Dataset loaded"

        else:
            return False, "Dataset not found"

    def create_dataset(self, name):
        if name not in self.datasets:
            self.datasets.append(name)
            self.current_dataset = dataset(self.name, name)
            self.current_dataset.save_dataset(force=True)
            self.set_default_dataset(name)
            return True, 'New Dataset ' + name + ' created!'
        else:
            return False, 'Dataset ' + name + ' already exists!'

    def set_default_dataset(self, name):
        if name in self.datasets:
            self.default_dataset = name
            self.user_config.save_default_dataset(self.name, name)
            return True, "Dataset set to default"
        else:
            return False, 'Dataset ' + name + ' not found!'

    def delete_dataset(self, name):
        dataset_filename = ROOT_FOLDER + self.name + '/' + name + '.dat'
        if os.path.exists(dataset_filename):
            os.remove(dataset_filename)

            if self.default_dataset == name:
                self.default_dataset = ''

            return True, "Dataset deleted"
        else:
            return False, "Dataset not found"

    def rename_dataset(self, new_name):
        # Check if already exists, if not, set and save
        if os.path.exists(ROOT_FOLDER + self.name + '/' + new_name + '.dat'):
            return False, "New Dataset already exists. Please try a new name."

        else:
            shutil.move(
                ROOT_FOLDER + self.name + '/' + self.current_dataset.name + '.dat',
                ROOT_FOLDER + self.name + '/' + new_name + '.dat')

            self.current_dataset.name = new_name
            self.current_dataset.save_dataset()
            self.set_default_dataset(new_name)

            return True, "Dataset Renamed"

    # TODO
    def merge_datasets(self, input_dataset1, input_dataset2, output_dataset):
        pass

    # TODO
    def create_filtered_dataset(self, dataset_name, criteria):
        pass


'''
    Project Manager handles all projects and their datasets
'''


class project_manager:

    projects = []
    current_project = None

    def __init__(self):

        # If data folder doesn't exist, create it -- support first time users
        if not os.path.isdir(ROOT_FOLDER):
            os.mkdir(ROOT_FOLDER)

        self.get_project_list()

        # Init user config
        self.user_config = user_config()
        self.user_config.load_config()

        # Init project -- empty project placeholder
        self.current_project = project()
        self.current_project.user_config = self.user_config

    def load_project(self, name):
        if name in self.projects:
            return self.current_project.load_project(name)
        else:
            return False, "Project not found"

    def get_project_list(self):
        all_folders = sorted(os.listdir(ROOT_FOLDER))

        self.projects.clear()
        for project_folder in all_folders:

            # Check if folder or not
            if os.path.isdir(ROOT_FOLDER + project_folder):

                # Check folder is valid project or not
                if self.checkValidProject(project_folder):
                    self.projects.append(project_folder)

    def create_project(self, name, dataset_name):
        if not name in self.projects:
            # Set up project and user config
            self.new_project = project()
            self.new_project.user_config = self.user_config

            # Create a project folder
            self.new_project.create_new_project(name)
            
            # Create a default dataset
            self.new_project.create_dataset(dataset_name)
            
            # Copy or Symlink video file -- Upload method will do it
            # self.new_project.copy_video_to_project(video_path)

            # Add this new project to the project list
            self.projects.append(name)

            # Set default dataset
            self.new_project.user_config.save_default_dataset(name, dataset_name)

            # Set default camera angle to 1
            self.new_project.user_config.save_default_camera(name, 1)
            
            return True, "New Project Created"
        else:
            return False, "Project Name Already Exists. Try a different name."

    def delete_project_by_name(self, name):
        if name in self.projects:
            self.projects.remove(name)
        else:
            logging.warning(
                'delete_project_by_name %s project not found!', name)

    def rename_project(self, old_name, new_name):
        # TODO: Rename the project to a new name ie rename project folder only (Dataset header project field needs to be changed too)
        pass

    def checkValidProject(self, folder):
        return os.path.exists(ROOT_FOLDER + folder + '/' + folder + '.mp4')


'''
    User-Config Class handles all user/ session config
    Follows Dataset format version 2.0 (No backward compatibility included in this)
'''


class user_config:
    def __init__(self):
        self.name = 'user-config.json'
        self.full_path_name = 'static/' + self.name
        self.config = {}
        self.load_config()

    def create_user_config(self):
        return self.save_config()

    def load_config(self):
        self.config = json.load(open(self.full_path_name))
        return True, "Config loaded"

    def save_config(self):
        json.dump(self.config, open(self.full_path_name, "w+"),
                  indent=4, sort_keys=True)
        return True, "Config Saved"

    def save_default_dataset(self, project_name, dataset_name):
        logging.info("Saving default dataset %s %s",
                     project_name, dataset_name)

        if 'PROJECT_LIST' not in self.config:
            self.config['PROJECT_LIST'] = {}

        if project_name in self.config['PROJECT_LIST']:
            self.config['PROJECT_LIST'][project_name]["default_dataset"] = dataset_name
        else:
            self.config['PROJECT_LIST'][project_name] = {}
            self.config['PROJECT_LIST'][project_name]["default_dataset"] = dataset_name
        return self.save_config()

    def save_default_camera(self, project_name, camera_index):
        logging.info("Saving default camera %s %s", project_name, camera_index)

        if 'PROJECT_LIST' not in self.config:
            self.config['PROJECT_LIST'] = {}

        if project_name in self.config['PROJECT_LIST']:
            self.config['PROJECT_LIST'][project_name]["default_angle"] = camera_index
        else:
            self.config['PROJECT_LIST'][project_name] = {}
            self.config['PROJECT_LIST'][project_name]["default_angle"] = camera_index
        return self.save_config()

    def update_config(self, change, value):
        if change in self.config:
            logging.info("Updating config %s %s-->%s",
                         change, self.config[change], value)
            self.config[change] = int(value)
            return self.save_config()
        else:
            # TODO: If not found, what should be done? Add or just log warning.
            message = 'Config not saved. Update config "' + change + '" NOT found in config.'
            logging.warn(message)
            return False, message
