# Built-in
import time
import os
import json
import subprocess
import shlex
import platform
import threading
import logging
import argparse

# Dependency Libraries
from flask import Flask, render_template
from flask import jsonify
from flask import request

# FEVA Libraries
from modules.project_manager import *
from modules.xhr_response import xhr_response
from modules.ELAN import *

# For Uploader
from werkzeug.utils import secure_filename

# CLI arguement parser
parser = argparse.ArgumentParser()
parser.add_argument("--port", "-p", help="Specify port number (Default 8000)")
parser.add_argument("--loglevel", "-l", help="Verbosity of the logging screen prints [D=Debug, I=Info, W=Warning, E=Error, and C=Critical (Default)]")
args = parser.parse_args()

# Logging Levels Reference
# Level       When it’s used
# --------------------------------------------------------
# DEBUG       Detailed information, typically of interest only when diagnosing problems.
# INFO        Confirmation that things are working as expected.
# WARNING     An indication that something unexpected happened, or indicative of some problem in the near future (e.g. ‘disk space low’). The software is still working as expected.
# ERROR       Due to a more serious problem, the software has not been able to perform some function.
# CRITICAL    A serious error, indicating that the program itself may be unable to continue running.
if args.loglevel:
    if args.loglevel.upper()=='D':
        logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.DEBUG)
    elif args.loglevel.upper()=='I':
        logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.INFO)
    elif args.loglevel.upper()=='W':
        logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.WARNING)
    elif args.loglevel.upper()=='E':
        logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.ERROR)
    elif args.loglevel.upper()=='C':
        logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.CRITICAL)
        logging.getLogger('werkzeug').disabled = True
    else:
        logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.CRITICAL)
        logging.getLogger('werkzeug').disabled = True
else:
    logging.basicConfig(format='[%(filename)s:%(lineno)d] - %(message)s', level=logging.CRITICAL)
    logging.getLogger('werkzeug').disabled = True
    
port_number = 8000
if args.port:
    port_number = int(args.port)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024 * 1024
root_path = 'static/'
root_data_path = 'static/data/'
PM = project_manager()

#create ELAN class [remove directory from ELAN class constructor]
elan = ELAN()
# NEED TO HANDLE MEDIA DESCRIPTORS
# --------------------------------------------------------------------
# EXPORT / IMPORT ELAN - DAT
# --------------------------------------------------------------------

# add support for export location using tkinter
@app.route('/exportDattoELAN/<file_name>')
def exportDattoELAN(file_name):
    cur_proj = PM.current_project
    file_dir = os.getcwd() + '/static/data/' + cur_proj.name +'/'+ cur_proj.current_dataset.name +'.dat'
    media_desc = os.getcwd() + 'static/data/' + cur_proj.name + '.mp4'
    elan.exportToELAN(file_dir, media_desc, file_name)
    return 'exported DAT to EAF'
# --------------------------------------------------------------------
# APPLICATION
# --------------------------------------------------------------------
@app.route('/')
def feva():
    file_versions = get_file_versions(root_path, {})

    try:
        #logging.debug('%s', file_versions)
        temp = render_template('index.html',
                               initial=None,
                               version=file_versions)
    except Exception as e:
        logging.error('FAVE ERROR: %s', e)
        temp = render_template('error.html', initial=None)

    return temp

# Recusively get file versions
def get_file_versions(dir, file_versions):
    ignore_dir = ['assets', 'data']
    
    if not dir[-1]=='/':
        dir += '/'

    all_contents = os.listdir(dir)
    for item in all_contents:
        if os.path.isdir(dir + item):
            if item not in ignore_dir:
                file_versions = get_file_versions(dir + item, file_versions)

        if os.path.isfile(dir + item):
            if item[-4:] == '.jsx' or item[-4:] == '.css':
                file_versions[item] = '?' + str(
                    os.path.getmtime(dir + item))
            elif item[-3:] == '.js':
                file_versions[item] = '?' + str(
                    os.path.getmtime(dir + item))

    return file_versions

def launch_chrome():
    # TODO: Support Other OS as well
    if platform.system() == "Linux":
        logging.info('Lauching the Chrome App...')
        time.sleep(0.5)
        os.system('google-chrome http:localhost:8000')
        logging.info('Done launching...')

# Shutdown
@app.route('/shutdown')
def shutdown():
    # TODO: Do any shutdown needed house keeping
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    
    return 'Shutting down!'

# --------------------------------------------------------------------
# PROJECTS
# --------------------------------------------------------------------
# Get list of all projects
@app.route('/fetchProjects')
def fetchProjects():
    PM.get_project_list()

    response = xhr_response('fetchProjects')
    response.status = 1
    response.data['projects'] = sorted(PM.projects)

    return jsonify(response.getResponse())

# Load a specified project
@app.route('/loadProject/<project_name>')
def loadProject(project_name):
    PM.load_project(project_name)

    response = xhr_response('loadProject')
    response.status = 1
    response.data['message'] = 'Project Loaded'
    
    # Create Thumbnail and Preview in a different thread
    x = threading.Thread(target=create_thumbnail_and_preview, args=(project_name, "mp4",))
    x.daemon = False
    x.start()
    
    return jsonify(response.getResponse())

def create_thumbnail_and_preview(project_name, extension):
    if not os.path.exists(root_data_path + project_name + '/' + project_name + '_generator.' + extension):
        cmd = "ffprobe -v quiet -print_format json -show_streams " + os.getcwd() + "/static/data/" + project_name + "/" + project_name + '.' + extension
        results = os.popen(cmd).read()
        metadata = json.loads(results)
        print(metadata)
        md = {}
        for st in metadata['streams']:
            md[st['codec_type']] = st['index']
        stream_index_video = md['video']
        width = metadata['streams'][stream_index_video]['width']
        height = metadata['streams'][stream_index_video]['height']
    
        # Create Thumbnails
        # PORTRAIT
        if height>width:
            cmd = 'ffmpeg -i ' + root_data_path + project_name + '/' + project_name + '.' + extension + ' -filter:v scale=200:-1 ' + root_data_path + project_name + '/temp_' + project_name + '.' + extension
        
        # LANDSACPE
        else:
            cmd = 'ffmpeg -i ' + root_data_path + project_name + '/' + project_name + '.' + extension + ' -filter:v scale=202:-1 ' + root_data_path + project_name + '/temp_' + project_name + '.' + extension
        
        results = os.popen(cmd).read()
        # TODO: Check if the file was created successfully
        
        if os.path.exists(root_data_path + project_name + '/temp_' + project_name + '.' + extension and not os.path.exists(root_data_path + project_name + '/' + project_name + '_generator.' + extension)):
            os.rename(  root_data_path + project_name + '/temp_' + project_name + '.' + extension,
                        root_data_path + project_name + '/' + project_name + '_generator.' + extension)  
    
    if not os.path.exists(root_data_path + project_name + '/' + project_name + '_thumbnail.gif'):
        # Create Preview Gifs
        # -v quiet -print_format json
        cmd = 'ffmpeg -i ' + root_data_path + project_name + '/' + project_name + '.' + extension + ' -vf "setpts=N/TB/1000" -r 2 -loop 0 ' + root_data_path + project_name + '/temp_' + project_name + '_thumbnail.gif'
        results = os.popen(cmd).read()
    
        if os.path.exists(root_data_path + project_name + '/temp_' + project_name + '_thumbnail.gif'):
            os.rename(  root_data_path + project_name + '/temp_' + project_name + '_thumbnail.gif',
                        root_data_path + project_name + '/' + project_name + '_thumbnail.gif')

# Create a brand new project
@app.route('/createNewProject/<project_name>/<dataset_name>', methods = ['POST'])
def createNewProject(project_name, dataset_name):
    response = xhr_response('createNewProject')

    # Check duplicte before uploading data
    if project_name in PM.projects:
        response.status = 0
        response.data['message'] = 'ERROR: Project Name Already Exists'

    else:
        if request.method == 'POST':
            f = request.files['file']
        
            #Debugging only
            logging.debug('Project Creation Request: ' + project_name + ' - ' + dataset_name + ' - ' + f.filename)

            if project_name == '':
                response.status = 0
                response.data['message'] = 'ERROR: Blank project name'

            elif dataset_name == '':
                # response.status = 0
                # response.data['message'] = 'ERROR: Blank Dataset Name'
                response.data['message'] = 'Auto Filled Default Dataset Name'
                dataset_name = project_name

            elif f.filename == '':
                response.status = 0
                response.data['message'] = 'ERROR: Blank Video'

            if not response.status == 0:
                if PM.create_project(project_name, dataset_name):
                    vidfile = secure_filename(f.filename)
                    f.save(root_data_path + project_name + '/' + vidfile)

                    # Rename video to project name
                    os.rename(
                        root_data_path + project_name + '/' + vidfile, 
                        root_data_path + project_name + '/' + project_name + vidfile[-4:])
                    
                    # Create Thumbnail and Preview in a different thread
                    x = threading.Thread(target=create_thumbnail_and_preview, args=(project_name, vidfile[-3:],))
                    x.daemon = False
                    x.start()

                    response.status = 1
                    response.data['projects'] = sorted(PM.projects)
                    response.data['project_name'] = project_name
                    response.data['dataset_name'] = dataset_name
                    response.data['message'] = 'SUCCESS: Project Created'

                else:
                    response.status = 0
                    response.data['message'] = 'ERROR: Project Name Already Exists'

            else:
                response.status = 0
                response.data['message'] = 'FAIL: Project Creation Cancelled'
        else:
            response.status = 0
            response.data['message'] = 'FAIL: Request is not XHR POST Type'

    return jsonify(response.getResponse())


    # app = QtWidgets.QApplication(sys.argv)
    # ex = NewProjectDialog()
    # ex.setAttribute(QtCore.Qt.WA_DeleteOnClose)
    # if ex.exec_() == QtWidgets.QDialog.Accepted:
    #     project_name = ex.info['project_name'].strip()
    #     dataset_name = ex.info['dataset_name'].strip()
    #     video_path = ex.info['video_path'].strip()

    #     if project_name == '':
    #         response.status = 0
    #         response.data['message'] = 'ERROR: Blank project name'

    #     elif dataset_name == '':
    #         # response.status = 0
    #         # response.data['message'] = 'ERROR: Blank Dataset Name'
    #         response.data['message'] = 'Auto Filled Default Dataset Name'
    #         dataset_name = project_name

    #     elif video_path == '' or not os.path.exists(ex.info['video_path'].strip()):
    #         response.status = 0
    #         response.data['message'] = 'ERROR: Blank Path Name or File Not Found'


    #     if not response.status == 0:
    #         if PM.create_project(project_name, dataset_name, video_path):
    #             response.status = 1
    #             response.data['projects'] = sorted(PM.projects)
    #             response.data['project_name'] = project_name
    #             response.data['dataset_name'] = dataset_name
    #             response.data['message'] = 'SUCCESS: Project Created'

    #         else:
    #             response.status = 0
    #             response.data['message'] = 'ERROR: Project Name Already Exists'

    # else:
    #     response.status = 0
    #     response.data['message'] = 'FAIL: Project Creation Cancelled'
        
    # return jsonify(response.getResponse())

# Check if video has audio or not -- Prefeq ffmpeg/ ffprobe
@app.route('/checkAudioExist/<video_name>')
def checkAudioExist(video_name):
    cmd = "ffprobe -show_streams " + os.getcwd() + "/static/" + video_name
    # args = shlex.split(cmd)
    # args.append(os.getcwd() + "/static/" + video_name)
    # print(args)
    # ffprobe_output = subprocess.check_output(args).decode('utf-8')
    vid_data = os.popen(cmd).read()
    return str(vid_data.find("codec_type=audio") != -1)

# USE getVideoMetaData includes FPS
# @app.route('/getFPS/<video_name>')
# def getFPS(video_name):
#     cmd = "ffprobe -v quiet -print_format json -show_streams " + os.getcwd() + "/static/data/" + video_name + "/" + video_name + '.mp4'
#     results = os.popen(cmd).read()
#     metadata = json.loads(results)
#     fps = eval(metadata['streams'][0]['r_frame_rate'])
#     return str(fps)

@app.route('/getVideoMetadata/<video_name>')
def getVideoMetadata(video_name):
    cmd = "ffprobe -v quiet -print_format json -show_streams " + os.getcwd() + "/static/data/" + video_name + "/" + video_name + '.mp4'
    results = os.popen(cmd).read()
    metadata = json.loads(results)
    # print(results)
    
    md = {}
    md['streams'] = {}
    for st in metadata['streams']:
        md['streams'][st['codec_type']] = st['index']

    stream_index_video = md['streams']['video']
    stream_index_audio = md['streams']['audio']

    md['width'] = metadata['streams'][stream_index_video]['width']
    md['height'] = metadata['streams'][stream_index_video]['height']
    md['ratio'] = md['height']/ md['width']
    md['fps'] = eval(metadata['streams'][stream_index_video]['r_frame_rate'])

    return jsonify(md)

# --------------------------------------------------------------------
# USER CONFIG
# --------------------------------------------------------------------
# Write to user config default dataset for a specific project
@app.route('/writeDefaultDataset/<folder>/<name>')
def writeDefaultDataset(folder, name):
    success, message = PM.user_config.save_default_dataset(folder, name)
    
    response = xhr_response('writeDefaultDataset', int(success))
    response.data['message'] = message

    return jsonify(response.getResponse())
    # return "Default written"

# Write default camera angle in user config
@app.route('/writeDefaultAngle/<angle>')
def writeDefaultAngle(angle):
    success, message = PM.user_config.save_default_camera(PM.current_project.name, angle)
    
    response = xhr_response('writeDefaultDataset', int(success))
    response.data['message'] = message

    return jsonify(response.getResponse())
    # return "Default written"

# Update user config values
@app.route('/updateConfig/<changes>/<value>')
def updateConfig(changes, value):
    success, message = PM.user_config.update_config(changes, value)
    response = xhr_response('writeDefaultDataset', int(success))
    response.data['message'] = message

    return jsonify(response.getResponse())
    # return "Config Updated"

# --------------------------------------------------------------------
# TRACKS
# --------------------------------------------------------------------
# Change track name the current project and current dataset
@app.route('/changeTrackName/<old_name>/<new_name>')
def changeTrackName(old_name, new_name):
    success1, message1 = PM.current_project.current_dataset.track_rename(old_name, new_name)
    
    # TODO: Should only save when dataset is saved
    success2, message2 = PM.current_project.current_dataset.save_dataset(force=True)

    response = xhr_response('changeTrackName', int(success1 and success2))
    
    if not success2:
        response.data['message'] = message2
    else:
        response.data['message'] = message1

    return jsonify(response.getResponse())
    # return "Track updated"

@app.route('/changeTrackColor/<track_name>/<new_color>')
def changeTrackColor(track_name, new_color):
    success1, message1 = PM.current_project.current_dataset.track_change_color(track_name, new_color)

    # TODO: Should only save when dataset is saved
    success2, message2 = PM.current_project.current_dataset.save_dataset(force=True)
    
    response = xhr_response('changeTrackColor', int(success1 and success2))
    
    if not success2:
        response.data['message'] = message2
    else:
        response.data['message'] = message1

    return jsonify(response.getResponse())
    # return "Track updated"

@app.route('/changeTrackNumber/<track_name>/<new_number>')
def changeTrackNumber(track_name, new_number):
    success1, message1 = PM.current_project.current_dataset.track_change_number(track_name, new_number)

    # TODO: Should only save when dataset is saved
    success2, message2 = PM.current_project.current_dataset.save_dataset(force=True)

    response = xhr_response('changeTrackNumber', int(success1 and success2))
    
    if not success2:
        response.data['message'] = message2
    else:
        response.data['message'] = message1

    return jsonify(response.getResponse())
    # return "Track updated"


# Create new track in the current project and dataset
# @app.route('/writeNewTrack/<folder>/<dataset>/<new_type>/<type_name>/<type_color>') #
@app.route('/writeNewTrack/<track_name>/<track_number>/<track_color>') #
def writeNewTrack(track_name, track_number, track_color):
    logging.info('writeNewTrack %s %s %s', track_name, track_number, track_color)
    success1, message1 = PM.current_project.current_dataset.track_add_new(track_name, track_number, track_color)
    
    # TODO: Should only save when dataset is saved
    success2, message2 = PM.current_project.current_dataset.save_dataset(force=True)
    
    response = xhr_response('writeNewTrack', int(success1 and success2))
    
    if not success2:
        response.data['message'] = message2
    else:
        response.data['message'] = message1

    return jsonify(response.getResponse())
    # return "Track updated"

# Delete a particular track in the current dataset
@app.route('/deleteTrack/<track_name>')
def deleteTrack(type_name):
    success1, message1 = PM.current_project.current_dataset.track_detele(type_name, False)
    
    # TODO: Should only save when dataset is saved
    success2, message2 = PM.current_project.current_dataset.save_dataset(force=True)

    response = xhr_response('deleteTrack', int(success1 and success2))
    
    if not success2:
        response.data['message'] = message2
    else:
        response.data['message'] = message1

    return jsonify(response.getResponse())
    # return "Track updated"

# --------------------------------------------------------------------
# DATASETS
# --------------------------------------------------------------------
# Get list of all datasets in the specified project or loaded default project
@app.route('/fetchDatasets/<project_name>')
def fetchDatasets(project_name):
    # Empty project_name call mean use current_project
    if project_name is not None and not project_name.strip() == '':
        
        if PM.checkValidProject(project_name):
            
            # TODO: Need to figure out if loading project is necessry or not
            # If not, fetch datasets should not be loading the project
            success, message = PM.load_project(project_name)
            
            dslist = PM.current_project.get_dataset_list()

            files = {}
            count = 0
            logging.info('All Datasets %s', dslist)
            for ds in dslist:
                files[count] = ds
                count += 1

            response = xhr_response('fetchDatasets', int(success))
            response.data['datasets'] = files
            response.data['message'] = "Datasets fetched"

        # TODO: Should not happen, but if it does, then need to handle it
        else:
            response = xhr_response('fetchDatasets', 0)
            response.data['message'] = "Invalid Project"    
    else:
        response = xhr_response('fetchDatasets', 0)
        response.data['message'] = "Invalid Project"

    return jsonify(response.getResponse())

# Assumes current project ie loadProject already called
@app.route('/loadDataset/<dataset_name>')
def loadDataset(dataset_name):
    success, message = PM.current_project.load_dataset(dataset_name)

    response = xhr_response('loadDataset', int(success))
    response.data['dataset_name'] = dataset_name
    response.data['message'] = message

    return jsonify(response.getResponse())

    # PM.current_project.load_dataset(dataset_name)
    # return 'Dataset Loaded'

# Create a brand new dataset in the current project
@app.route('/createNewDataset/<dataset_name>')
def createNewDataset(dataset_name):
    success, message = PM.current_project.create_dataset(dataset_name)
    response = xhr_response('createNewDataset', int(success))
    response.data['dataset_name'] = dataset_name
    response.data['message'] = message

    return jsonify(response.getResponse())
    # return "file-created"

# Save dataset
@app.route('/saveData/<all_data>')
def saveData(all_data):
    logging.debug('TYPE %s', type(all_data))

    success, message = PM.current_project.current_dataset.save_dataset(all_data)
    response = xhr_response('saveData', int(success))
    response.data['message'] = message

    return jsonify(response.getResponse())

# Save Dataset into a new file
@app.route('/saveAsData/<name>/<all_data>')
def saveAsData(name, all_data):
    # TODO: Need to send the history only
    
    success, message = PM.current_project.current_dataset.save_as_dataset(name, all_data)
    response = xhr_response('saveAsData', int(success))
    response.data['message'] = message

    return jsonify(response.getResponse()) 


if __name__ == '__main__':
    # x = threading.Thread(target=launch_chrome)
    # x.start()
    app.run(threaded=True, port=port_number)
