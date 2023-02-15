/**
 * Manager for processes.
 */
class ProcessManager {
    /**
     * Constructor.
     */
    constructor() {
        // this.currentProject = {
        //     angle: -1,
        //     dataset: {
        //         name: '',
        //         path: ''
        //     },
        //     generalpath: '',
        //     name: '',
        //     keypoints: {
        //         exists: false,
        //         list: [],
        //         json: {}
        //     }
        // }
        this.selectedTrackType = undefined;
        this.audioWavesManager = undefined;
        this.colorManager = new ColorManager();
        this.history = new History();
        this.intervalManager = new IntervalManager();
        this.projectManager = new ProjectManagerA();
        this.xhrManager = new XHRManager();
        this.anchorManager = new Anchors();
        this.annotatingMode = false;
        this.editingMode = false;
        this.buttons = {
            'add-new-track': () => {
                if ($('.add-track-input')[0].value.trim() == '')
                {
                    let error_message = "ERROR: Track Name is Empty!";
                    console.error(error_message);
                    interfaceManager.notificationManager.show(error_message, {type:'error'});
                }
                else
                {
                    processManager.colorManager.createNewType(
                        $('.add-track-input')[0].value,
                        interfaceManager.dataDisplayManager.labelPanelManager.trackCreatorManager.irocolor.color.hexString
                    );
                    $('.add-track-input')[0].value = '';
                    const color = processManager.processes['random-color']();
                    interfaceManager.dataDisplayManager.labelPanelManager.trackCreatorManager.irocolor.color.hexString = color;
                }
            },
            'change-rate': (rate) => {
                if (rate > 8 || rate < 0.25) return;
                if (!interfaceManager.readyState) return;
                $('.video-main')[0].playbackRate = rate;
                $('.playrate-display')[0].innerText = `${$('.video-main')[0].playbackRate}x`;
                $('.playrate-change')[0].innerText = `${$('.video-main')[0].playbackRate}x`;
            },
            'play-pause': () => {
                if (!interfaceManager.readyState) return;
                let main = $('.video-main')[0];
                if (main.paused) {
                    $('.video-button.big').addClass('pause');
                    $('.video-button.big').removeClass('play');
                    main.play();
                } else {
                    $('.video-button.big').removeClass('pause');
                    $('.video-button.big').addClass('play');
                    main.pause();
                    this.intervalManager.stopInterval('label');
                    if (this.annotatingMode) {
                        this.annotatingMode = false;
                        this.intervalManager.stopInterval('annotate');
                        interfaceManager.dataDisplayManager.speedLabelPanelManager.addLabel();
                    }
                }
            },
            'save': () => {
                let data = {}
                let i = 0;
                let tempLabel;
                for (let item of processManager.history.changedData) {
                    tempLabel = interfaceManager.dataDisplayManager.labels.copyDeepLabel(item);
                    tempLabel["text"] = this.processes['escape-str'](tempLabel["text"])
                    data[i++] = tempLabel;
                }
                let json = JSON.stringify(data);
                processManager.xhrManager.writeDataset(
                    'save',
                    json
                )
            },
            'save-as': () => {
                let dat = {};
                let i = 0;
                let tempLabel;
                for (let item of processManager.history.changedData) {
                    tempLabel = interfaceManager.dataDisplayManager.labels.copyDeepLabel(item);
                    tempLabel["text"] = this.processes['escape-str'](tempLabel["text"])
                    dat[i++] = tempLabel;
                }

                let data = {}
                data['name'] = $('.save-as-input')[0].value;
                data['value'] = JSON.stringify(dat);

                processManager.xhrManager.writeDataset(
                    'save-as',
                    data
                )
            },
            'shift-video-time': (t) => {
                if (!interfaceManager.readyState) return;
                let main = $('.video-main')[0];
                main.currentTime += t;
                $('.data-display-panel')[0].scrollLeft = main.currentTime * variableManager.CONFIG_PIXEL_PER_INTERVAL;
                interfaceManager.updateVideoInfo(main.currentTime);
            },
            'redo': () => {
                this.history.redo();
            },
            'import': (data) => {
                console.log("in import" + data)
                this.xhrManager.writeProject('import', data);
            },
            'undo': () => {
                this.history.undo();
            },
            'new-project': () => {
                //this.xhrManager.writeProject('new-project', {});
                this.xhrManager.writeUploader('new-project', {
                    'project_name': document.getElementById('new_project_name').value,
                    'dataset_name': document.getElementById('new_dataset_name').value });
            },
            'close': () => {
                setTimeout(function () {
                    window.close();
                }, 500);
                this.xhrManager.writeProject('shutdown', {});
            },
        }
        this.processes = {
            'adjust-menu': (pos, rect) => {
                let top, left;
                if (pos.top + rect.height >= variableManager.windowHeight) {
                    top = pos.top - rect.height;
                } else {

                    // adding 5px as sufficient padding between mouse click and where the menu shows up 
                    top = pos.top + 5;
                }
                if (pos.left + rect.width >= variableManager.windowWidth) {
                    left = variableManager.windowWidth - rect.width;
                } else {
                    left = pos.left;
                }
                return { top: top, left: left }
            },
            'check-time-change': (oldv, newv) => {
                let px = 1 / variableManager.CONFIG_PIXEL_PER_INTERVAL * 1000;
                if (Math.abs(oldv.start - newv.start) >= px) return true;
                if (Math.abs(oldv.end - newv.end) >= px) return true;
                return false;
            },
            'current-video-frame': (t) => {
                return Math.round(t * variableManager.config.FRAMES_PER_SECOND)
            },
            'escape-str': (str) => {
                return escape(str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).replace(/\//g, '%5C%2F');
            },
            'fetch-data': (name) => {
                if (name === 'None') {
                    return new Promise(res => {
                        res(true);
                    });
                } else {
                    let proj_manager = interfaceManager.toolbarManager.projectManager.currentProject;
                    interfaceManager.dataDisplayManager.reset();
                    this.history.resetHistoryList();
                    // interfaceManager.dataDisplayManager.drawRuler();
                    // ISSUE fixed. No need to call fetch-dataset. Fetch dataset is to get the list of datasets not to load dataset
                    // If you really want to update the dataset list then the name = project name, not dataset name
                    //console.log("Issue >>> " + name);)
                    //this.xhrManager.writeDataset('fetch-dataset', name);

                    this.xhrManager.writeDataset('load-dataset', name);

                    proj_manager.dataset = name;
                    return new Promise(res => {
                        $.getJSON(`${proj_manager.path}${name}.dat?${Date.now()}`, (json) => {
                            this.processes['process-data'](json);
                            res(true);
                        }).error(function () {
                            res(false);
                        });
                    })
                }

            },
            'fetch-keypoints': (path) => {
                return new Promise(res => {
                    $.getJSON(`${path}_keypoints.json`, function () {
                        res(true);
                    }).fail(function () {
                        res(false);
                    });
                })
            },
            'get-play-back': (vid) => {
                return new Promise(res => {
                    let safetyTimer = 0;
                    let playback = window.setInterval(function () {
                        safetyTimer += 1;
                        if (vid.readyState === 4) {
                            window.clearInterval(playback);
                            res(true);
                        }
                        if (safetyTimer >= 60) {
                            window.clearInterval(playback)
                            res(false);
                        }
                    }, 1000);
                })
            },
            'last-element': (array) => {
                if (array == null)
                    return void 0;
                return array[array.length - 1];
            },
            'ms-to-pixel': (t) => {
                return Math.round(t * variableManager.CONFIG_PIXEL_PER_INTERVAL / 1000);
            },
            'pixel-to-ms': (px) => {
                return Math.round(px * 1000 / variableManager.CONFIG_PIXEL_PER_INTERVAL);
            },
            'play-label': (start, end) => {

                $('.video-main')[0].pause();
                this.intervalManager.stopInterval('label');
                $('.video-main')[0].currentTime = start / 1000;

                $('.video-button.big').removeClass('play');
                $('.video-button.big').addClass('pause');
                var promise = $('.video-main')[0].play();

                if (promise !== undefined) {
                    promise.then(function () {
                        // Automatic playback started!
                    }).catch(function (error) {
                        // Automatic playback failed.
                    });
                }

                $('.media-controls-button').removeClass('play');
                $('.media-controls-button').addClass('pause');
                this.intervalManager.set('label', () => {
                    if ($('.video-main')[0].currentTime >= end / 1000) {
                        $('.video-main')[0].pause();
                        $('.video-button.big').removeClass('pause');
                        $('.video-button.big').addClass('play')
                        this.intervalManager.stopInterval('label');
                    }
                }, 10);
            },
            'process-data': (json) => {

                var alert = "INVALID JSON: \n\n";
                var needAlert = false;

                // If data object is missing -> alert. Can't do anything without input data.
                if (json['data'] === undefined)
                {
                    //TODO: Works on the cleint side but server-side stil needs to fix
                    let new_json = json
                    json = {};
                    json['data'] = new_json;
                    
                    needAlert = true;
                    alert += "Older JSON schema or missing data. Correction applied.\n\n";
                }

                // If header is missing, add header with empty labels list. 
                if (json['header'] === undefined) {
                    alert += "Missing header generated automatically.\n\n"
                    needAlert = true;
                    json.header = this.addMissingHeader()

                } else if (json['header']['labels'] === undefined) {
                    json['header']['labels'] = [];
                }

                //Generate tracks—regardless if they are missing or not.
                let _alert_return = this.createMissingTracks(json);
                let _needAlert = _alert_return[0];
                let _alert_msg = _alert_return[1];

                if (needAlert || _needAlert) {
                    //console.log("INVALID JSON: Header and data missing or improperly set up. Any missing labels were generated automatically.");
                    interfaceManager.notificationManager.show(alert + _alert_msg, {type:'warning'});
                    window.alert(alert + _alert_msg);
                }

                let format = Object.keys(json).length;
                let oldFormat = {
                    type: 1,
                    colors: {
                        "1": ["emotion", "#0965AB"],
                        "2": ["action", "#AB092A"],
                        "3": ["speech", "#D44A00"],
                        "4": ["event", "#874DA1"]
                    }
                };
                let newFormat = 2;
                if (format == oldFormat.type) {
                    this.colorManager.initializeColors(oldFormat.colors);
                    interfaceManager.dataDisplayManager.labels.initializeDataTypes(oldFormat.colors);
                    let labels = json['data'];
                    for (let id in labels) {
                        let label = new Label(
                            id,
                            labels[id][3],
                            labels[id][0],
                            labels[id][1] * 1,
                            labels[id][2] * 1
                        )

                        interfaceManager.dataDisplayManager.labels.addLabel(label);

                    }
                } else if (format == newFormat) {
                    let types = json['header']['labels']
                    let colors = {};
                    for (let i in types) {
                        let type = types[i];
                        colors[type[0]] = [i, type[1]];
                    }
                    this.colorManager.initializeColors(colors);
                    interfaceManager.dataDisplayManager.labels.initializeDataTypes(colors);
                    let labels = json['data']
                    for (let id in labels) {
                        let label = new Label(
                            id,
                            labels[id][3],
                            labels[id][0],
                            labels[id][1] * 1,
                            labels[id][2] * 1
                        )
                        interfaceManager.dataDisplayManager.labels.addLabel(label);
                    }
                }
                this.anchorManager.initialize(interfaceManager.dataDisplayManager.labels.getAllLabelsByType())
                interfaceManager.updateColorMenuFilter();
            },
            'random-color': () => {
                let color = Math.floor(Math.random() * 16777215).toString(16);
                while (color.length != 6) {
                    color = Math.floor(Math.random() * 16777215).toString(16);
                }
                return color;
            },
            's-to-string-ms': (sec) => {
                let t = Math.round(sec * 1000);
                let hrs = Math.floor(t / 3600000);
                let mins = Math.floor((t - (hrs * 3600000)) / 60000);
                let s = Math.floor((t - (hrs * 3600000) - (mins * 60000)) / 1000);
                let ms = t - (hrs * 3600000) - (mins * 60000) - (s * 1000);
                if (hrs < 10) {
                    hrs = `0${hrs}`;
                }
                if (mins < 10) {
                    mins = `0${mins}`;
                }
                if (s < 10) {
                    s = `0${s}`;
                }
                if (ms < 10) {
                    ms = `00${ms}`;
                }
                else if (ms < 100) {
                    ms = `0${ms}`;
                }
                return `${hrs}:${mins}:${s}.${ms}`;
            },
            'to-capital-letter': (str) => {
                return str.charAt(0).toUpperCase() + str.slice(1)
            },
            'uuidv4': () => {
                let key = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                let keys = interfaceManager.dataDisplayManager.labels.getAllLabelIDs();
                while (keys.includes(key)) {
                    key = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                return key;
            }
        }
        this.shift = {
            which: undefined,
            pressed: false
        };
    }
    /**
     * Add window onclick function.
     * @param {Function} func function.
     */
    addWindowOnclick(func) {
        window.addEventListener('click', func);
    }
    /**
     * Add window onkeydown function
     * @param {Function} func Function.
     */
    addWindowOnKeyDown(func) {
        window.addEventListener('keydown', func);
    }
    /**
     * Add window onkeyup function.
     * @param {Function} func Function.
     */
    addWindowOnKeyUp(func) {
        window.addEventListener('keyup', func);
    }
    addWindowOnWheel(func) {
        window.addEventListener('wheel', func, {
            passive: false
        });
    }

    addWindownOnResize(func) {
        window.addEventListener('resize', func);
    }


    /**
     * Get selected dataset.
     * @param {String} data Dataset name.
     */
    async getDataset(data) {

        // pauses video before changing dataset
        $('.video-main')[0].pause();

        // stops any previously selected label from playing
        this.intervalManager.stopInterval('label');

        processManager.history.resetHistoryList();

        //Unselecting label before loading new dataset–fix for #229.
        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();

        let promisedata = await this.processes['fetch-data'](data);
        if (promisedata) {
            let dataset = $('.dataset-btn')[0].innerText
            if (dataset == 'None') {
                interfaceManager.notificationManager.show('DEBUG: Nothing selected, Nothing to load.', {type:'warning'});
            }
            else {
                // Looks like this is being called twice. Not sure why this is needed.
                // this.xhrManager.writeDataset(
                //     'load-dataset', //'default-dataset', //load dataset will load and set default
                //     dataset
                //     // { 
                //     //     'project': interfaceManager.toolbarManager.projectManager.currentProject.name,
                //     //     'dataset': dataset
                //     // }
                // );
                this.projectManager.setDefaultDataset(interfaceManager.toolbarManager.projectManager.currentProject.name, dataset)
                interfaceManager.updateDisplayPostGetData();
            }
        } else {
            interfaceManager.notificationManager.show(`Missing or corrupted dataset file: ${data}.dat.`, {type:'error'});
            window.alert(`Missing or corrupted dataset file: ${data}.dat.`);
            // interfaceManager.bubbleTextManager.showMessage([`Missing dataset file: ${data}.dat.`])
        }
    }
    /**
     * Sets angle and thumbnails, and generate new frames and keypoints.
     * @param {number} angle Canvas number selected.
     */
    processNewAngle(angle) {
        this.projectManager.setDefaultAngle(interfaceManager.toolbarManager.projectManager.currentProject.name, angle);
        interfaceManager.updateDisplayAngle(angle);
        let proj_manager = interfaceManager.toolbarManager.projectManager.currentProject;
        if (proj_manager.keypoints.exists) {
            // if the frames aren't stored then we fetch it and store it in keypoints.json
            if (jQuery.isEmptyObject(proj_manager.keypoints.json)){
                $.getJSON(`${proj_manager.path}${proj_manager.name}_keypoints.json`, (json) => {
                    proj_manager.keypoints.json = json;
                    proj_manager.keypoints.list = json[`cam${angle}`];
                    //get frames after angle change
                    interfaceManager.keypointsManager.drawKeypoints(this.processes['current-video-frame']());
                    // calculate frame
                    const frame_ct = $('.data-display-panel')[0].scrollLeft / variableManager.CONFIG_PIXEL_PER_INTERVAL
                    //set frame after receiving the frames
                    interfaceManager.keypointsManager.drawKeypoints(processManager.processes['current-video-frame'](frame_ct));
                });
            }
            // if the frames are already in keypoints.json then we simply load them
            else{
                proj_manager.keypoints.list = proj_manager.keypoints.json[`cam${angle}`];
                //get frames after angle change
                interfaceManager.keypointsManager.drawKeypoints(processManager.processes['current-video-frame']());
                // calculate frame
                const frame_ct = $('.data-display-panel')[0].scrollLeft / variableManager.CONFIG_PIXEL_PER_INTERVAL
                //set frame after receiving the frames
                interfaceManager.keypointsManager.drawKeypoints(processManager.processes['current-video-frame'](frame_ct));
            }
        }
        this.xhrManager.writeConfig(
            'active-angle',
            angle
        )
    }
    /**
     * Process project list of the user.
     */
    processProjectList() {
        this.xhrManager.writeProject(
            'get-project-list'
        )
        interfaceManager.loadingScreenManager.processLoadingScreen();
    }
    /**
     * Set editing mode.
     */
    setEditingMode(mode) {
        this.editingMode = mode;
    }
    /**
     * Sync video time as well as displays.
     * @param {number} time Time which video is sync to.
     * @param {number} speed Animation speed.
     */
    seekScroll(time, speed) {
        if (speed == 'instant')
            $('.data-display-panel')[0].scrollLeft = (time * variableManager.CONFIG_PIXEL_PER_INTERVAL)
        else
            $('.data-display-panel').animate({
                "scrollLeft": (time * variableManager.CONFIG_PIXEL_PER_INTERVAL)
            }, speed);
        $('.video-main')[0].currentTime = time;
        interfaceManager.updateVideoInfo(time);
    }
    /**
     * Process shortcuts for user.
     */
    processShortcuts() {
        this.addWindowOnKeyDown((e) => {
            if ($('input').is(":focus")) return;
            /** SHIFT **/
            if (e.key == 'Shift') {
                if (e.code == 'ShiftLeft') {
                    if (this.shift.pressed) {
                        return;
                    } else {
                        this.shift.pressed = true;
                        if (variableManager.selectedLabel == undefined) return;
                        this.shift.which = 'ShiftLeft';

                        /**
                         * Corner case detected one time, don't know how to reproduce.
                         * The following line in PinpointPanel.jsx, line 206 -
                         * let top = $(`.label-replica.type-${rect.type}.labels`)[0].getBoundingClientRect().top - (variableManager.CONFIG_IMAGE_HEIGHT)
                         *  - reproduces an error saying 'getBoundingClientRect()' is undefined.
                         * 
                         * possible fix: check if LabelEditor state id is not empty or LabelEditor state editing is false.
                         **/
                        interfaceManager.pinpointFrameManager.setFrames('left');
                        interfaceManager.pinpointFrameManager.showFrames();
                    }
                } else if (e.code == 'ShiftRight') {
                    if (this.shift.pressed) {
                        return;
                    } else {
                        this.shift.pressed = true;
                        if (variableManager.selectedLabel == undefined) return;
                        this.shift.which = 'ShiftRight';

                        /**
                         * Corner case detected one time, don't know how to reproduce.
                         * The following line in PinpointPanel.jsx, line 206 -
                         * let top = $(`.label-replica.type-${rect.type}.labels`)[0].getBoundingClientRect().top - (variableManager.CONFIG_IMAGE_HEIGHT)
                         *  - reproduces an error saying 'getBoundingClientRect()' is undefined.
                         * 
                         * possible fix: check if LabelEditor state id is not empty or LabelEditor state editing is false.
                         **/
                        interfaceManager.pinpointFrameManager.setFrames('right');
                        interfaceManager.pinpointFrameManager.showFrames();
                    }
                }
            }
            /** DELETE **/
            else if (e.code == variableManager.config.KEYCODE_DELETE || e.code == variableManager.config.KEYCODE_BACKSPACE) {
                if (variableManager.selectedLabel == undefined) return;
                let id = variableManager.selectedLabel.getID();
                interfaceManager.contextMenuManager.clipboard.removeLabelByID(id);
                interfaceManager.dataDisplayManager.labels.deleteLabelByID(id);

                this.history.addHistory(
                    variableManager.requestCodes.add,
                    {
                        id: id,
                        oldValue: variableManager.selectedLabel,
                        newValue: undefined
                    }
                )

                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(variableManager.selectedLabel.getType());
                interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
                interfaceManager.dataDisplayManager.updateTimelineHeight();
                interfaceManager.contextMenuManager.updateMenu();
            }
            /** PLAY **/
            else if (e.code == variableManager.config.KEYCODE_PLAY) {
                e.preventDefault();
                this.buttons['play-pause']();
            }
            /** UNFOCUS **/
            else if (e.code == variableManager.config.KEYCODE_ESCAPE) {
                interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
            }
            /** UNDO **/
            else if (e.code == variableManager.config.SHORTCUTS['UNDO'] && e.ctrlKey) {
                this.buttons['undo']();
            }
            /** REDO **/
            else if (e.code == variableManager.config.SHORTCUTS['REDO'] && e.ctrlKey) {
                this.buttons['redo']();
            }
            /** SAVE **/
            else if (e.code == variableManager.config.SHORTCUTS['SAVE'] && e.ctrlKey) {
                e.preventDefault();
                this.buttons['save']();
            }
            /** FIND **/
            else if (e.code == variableManager.config.SHORTCUTS['FIND'] && e.ctrlKey) {
                // e.preventDefault();
                // e.stopPropagation();
                // $('.search-bar').focus();
            }
            /** CUT **/
            else if (e.code == variableManager.config.SHORTCUTS['CUT'] && e.ctrlKey && variableManager.selectedLabel) {
                interfaceManager.contextMenuManager.menu['cut-label']();
            }
            /** COPY **/
            else if (e.code == variableManager.config.SHORTCUTS['COPY'] && e.ctrlKey && variableManager.selectedLabel) {
                interfaceManager.contextMenuManager.menu['copy-label']();
            }
            /** PASTE **/
            else if (e.code == variableManager.config.SHORTCUTS['PASTE'] && e.ctrlKey) {
                // TODO: paste label on speed_label_type from variables and on timeline location
                interfaceManager.contextMenuManager.menu['quick-paste']();
                
            }
            else if (e.code == variableManager.config.SHORTCUTS['FRAME_BACKWARD']) {
                // Fix for #240, #264, and #257
                document.activeElement.blur();
                e.preventDefault();
                e.stopPropagation();

                /** SHIFT LABEL BY -1 FRAME **/
                if (this.shift.pressed) {
                    if (this.shift.which == 'ShiftLeft') {
                        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.shiftLabelByAFrame(
                            'start',
                            -1
                        )
                    } else if (this.shift.which == 'ShiftRight') {
                        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.shiftLabelByAFrame(
                            'end',
                            -1
                        )
                    }
                }
                else {
                    /** SHIFT VIDEO BY -5 SECONDS **/
                    if (e.ctrlKey) {
                        this.buttons['shift-video-time'](-5);
                    }
                    /** SHIFT VIDEO BY -CONFIG_INTERVAL SECONDS **/
                    else {
                        this.buttons['shift-video-time'](-variableManager.CONFIG_INTERVAL);
                    }
                }
            }
            else if (e.code == variableManager.config.SHORTCUTS['FRAME_FORWARD']) {
                // Fix for #240, #264, and #257
                document.activeElement.blur();
                e.preventDefault();
                e.stopPropagation();

                /** SHIFT LABEL BY +1 FRAME **/
                if (this.shift.pressed) {
                    if (this.shift.which == 'ShiftLeft') {
                        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.shiftLabelByAFrame(
                            'start',
                            1
                        )
                    } else if (this.shift.which == 'ShiftRight') {
                        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.shiftLabelByAFrame(
                            'end',
                            1
                        )
                    }
                }
                else {
                    /** SHIFT VIDEO BY +5 SECONDS **/
                    if (e.ctrlKey) {
                        this.buttons['shift-video-time'](5);
                    }
                    /** SHIFT VIDEO BY +CONFIG_INTERVAL SECONDS **/
                    else {
                        this.buttons['shift-video-time'](variableManager.CONFIG_INTERVAL);
                    }
                }
            }
            /**  INCREASE PLAYBACK RATE WHEN ARROW UP PRESSED **/
            else if (e.code == variableManager.config.SHORTCUTS['PLAYBACK_RATE_INCREASE']) {
                processManager.buttons['change-rate']($('.video-main')[0].playbackRate + 0.25);

                $('.playrate-change')[0].style.opacity = 1;
                setTimeout(function() {$('.playrate-change')[0].style.opacity = 0;}, 500);

                // Fix for #240, #264, and #257
                document.activeElement.blur();
                e.preventDefault();
                e.stopPropagation();
            }
            /**  DECREASE PLAYBACK RATE WHEN ARROW UP PRESSED **/
            else if (e.code == variableManager.config.SHORTCUTS['PLAYBACK_RATE_DECREASE']) {
                processManager.buttons['change-rate']($('.video-main')[0].playbackRate - 0.25);
                
                $('.playrate-change')[0].style.opacity = 1;
                setTimeout(function() {$('.playrate-change')[0].style.opacity = 0;}, 500);

                // Fix for #240, #264, and #257
                document.activeElement.blur();
                e.preventDefault();
                e.stopPropagation();
            }
            /** EDIT **/
            else if (e.code == variableManager.config.SHORTCUTS['EDIT'] && e.ctrlKey) {
                interfaceManager.contextMenuManager.menu['edit-label']('text');
                e.preventDefault();
                e.stopPropagation();
            }
            /** ADD **/
            else if (e.code == variableManager.config.SHORTCUTS["ANNOTATE"]) {
                if ($('.video-main')[0].paused) return;
                if (this.annotatingMode) {
                    processManager.intervalManager.stopInterval('annotate');
                    interfaceManager.dataDisplayManager.speedLabelPanelManager.addLabel();
                    this.annotatingMode = false;
                }
                else {
                    this.annotatingMode = true;
                    interfaceManager.dataDisplayManager.speedLabelPanelManager.setLeft(
                        $('.data-display-panel')[0].scrollLeft -
                        (variableManager.config.REACTION_TIME / 1000 * variableManager.CONFIG_PIXEL_PER_INTERVAL)
                    )
                    processManager.intervalManager.set('annotate', function () {
                        interfaceManager.dataDisplayManager.speedLabelPanelManager.setWidth($('.data-display-panel')[0].scrollLeft)
                    }, 100);
                }
            }
        });
        this.addWindowOnKeyUp((e) => {
            if ($('input').is(":focus")) return;
            /** SHIFT **/
            if (e.key == 'Shift') {
                this.shift.which = undefined;
                this.shift.pressed = false;
                interfaceManager.pinpointFrameManager.hideFrames();
            }
            /** SHIFT LABEL BY A FRAME **/
            else if ((e.code == variableManager.config.SHORTCUTS['FRAME_BACKWARD'] ||
                e.code == variableManager.config.SHORTCUTS['FRAME_FORWARD']) &&
                this.shift.pressed
            ) {
                // Fix for #240, #264, and #257
                document.activeElement.blur();
                e.preventDefault();
                e.stopPropagation();

                // process label only when it is selected.
                if (interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.getState().id !== '') {
                    interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.processLabelPostShift();
                }
            }
        })
        this.addWindowOnWheel((e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
            }
        })

        this.addWindownOnResize((e) => {
            if ($('.padder')[0] == undefined) return;
            variableManager.paddingResize = $('.padder')[0].clientWidth;
            $('.labels-panel')[0].style.width = `${((variableManager.config.IMAGE_WIDTH / variableManager.CONFIG_INTERVAL) * $('.video-main')[0].duration) + variableManager.paddingResize}px`

        })



    }
    /**
     * When going out of tab.
     */
    visibilityMode() {
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden && !interfaceManager.generatorManager.generator.done) {
                var promise = interfaceManager.generatorManager.generator.generator.play();
                if (promise !== undefined) {
                    promise.then(function () {
                        // Automatic playback started!
                    }).catch(function (error) {
                        // Automatic playback failed.
                    });
                }
            }
        })
    }

    //Function to add missing header

    addMissingHeader() {
        let proj_manager = interfaceManager.toolbarManager.projectManager;
        let proj_name = proj_manager.currentProject.name;
        let modelObject = {
            "date_created": Date.now(),
            "date_modified": Date.now(),
            "labels": [],
            "project": proj_name,
            "schema_version": "2.0",
            "version": "0",
        }
        return modelObject;

    }

    //Function to add missing labels.
    createMissingTracks(data) {
        let labelList = data['header']['labels'];
        let labelData = data['data']

        let repeat = [];
        let flag = false;

        for (var track in labelList) {
            repeat.push(String(labelList[track][0]));
        }

        for (var label in labelData) {
            let type = String(labelData[label][0]);
            if (!repeat.includes(type)) {
                let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                let objArr = [type, color];
                var name = "Track" + type;
                flag = true;
                labelList[name] = objArr;
                this.xhrManager.writeDataset(
                    'new-track',
                    new Color(type.toString(), name, color.toString().substring(1))
                )
                repeat.push(type);
            }
        }

        let alert_msg = ''

        if (flag)
            alert_msg += 'Some tracks were missing in the dataset. The system was able to recover the track(s) and the labels automatically.'

        return [flag, alert_msg]

        // if (flag) {
        //     let msg = 'The dataset file seemed corrupted. There were some tracks missing. The system was able to recover the track(s) and the labels automatically.'
        //     window.alert("Notification:\n\n" + msg)
        //     console.log(msg);
        // }
    }
}




/**
 * PLACEHOLDER FOR FUTURE YOUTUBE API FETCH.
 * @param {String} str 
 */
function youtubeTest(str) {
    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        data: {
            key: 'insertyourkeyhere',
            q: str,
            part: 'snippet',
            maxResults: 5,
            type: 'video',
            videoEmbeddable: true,
        },
        success: function (data) {
            for (let i in data.items) {
                $('.youtube-test').append(
                    `<div style='display: flex;'>
                        <div 
                            class='${data.items[i].id.videoId}'
                            style='background-image:url("https://i.ytimg.com/vi_webp/${data.items[i].id.videoId}/sddefault.webp");
                            background-size: contain; background-repeat: no-repeat; width: 200px; height: 100px;'>
                        </div>
                        <div
                            style='color: white; padding: 10px; border: 1px solid white; box-sizing: content-box; width: 300px;'>
                            ${data.items[i].snippet.title}
                        </div>
                    </div>`
                )
            }
        },
        error: function (response) {
            interfaceManager.notificationManager.show("TODO: FAILED TO FETCH " + response, {type:'error'});
        }
    });
}
