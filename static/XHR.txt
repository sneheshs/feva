/**
 * XHR object containing all XMLHttpRequests in the app.
 */
class XHRManager {
    /**
     * Constructor.
     */
    constructor() {
        this.xhrs = {
            'config': new XMLHttpRequest(),
            'dataset': new XMLHttpRequest(),
            'project': new XMLHttpRequest(),
            'uploader': new XMLHttpRequest()
        }
        this.initializeProjectsFetcher();
        this.initializeDatasetEditor();
        this.initializeUploader();
    }
    /**
     * Request GET.
     * @param {{url: String, type: String}} data Data.
     */
    requestProcess(reqdata) {
        if (reqdata.type == 'uploader') {
            var file = document.getElementById('new_file').files[0];
            var filename = file.name;
            var filesize = file.size;
            var fileData = new FormData();
            fileData.append("file", file);

            this.xhrs[reqdata.type].open('POST', reqdata.url);
            this.xhrs[reqdata.type].send(fileData);
        }
        else {
            this.xhrs[reqdata.type].open('GET', reqdata.url);
            this.xhrs[reqdata.type].send();
            if (reqdata.type === 'dataset') {
                this.xhrs[reqdata.type].newName = reqdata.url
            }
        }
    }

    /**
     * Initialize fetcher for project list.
     */


    initializeProjectsFetcher() {

        this.xhrs['project'].onload = function () {
            let response = JSON.parse(this.response);

            switch (response.source) {

                case 'fetchProjects':
                    if (response.status == 1) {
                        // let cur_proj = $('.project-selector')[0].value;
                        // $('.project-selector').empty();

                        let projects = response.data.projects;

                        let contents = [];
                        for (let i in projects) {
                            contents.push(projects[i])
                        }
                        interfaceManager.toolbarManager.setProjectList(contents);


                        // if (cur_proj != '') {
                        //     $('.project-selector')[0].value = cur_proj;
                        // }
                    }
                    else {
                        //Handle Error
                        interfaceManager.notificationManager.show(response.data.message, {type:'error'});
                    }
                    break;

                case 'loadProject':
                    if (response.status == 1) {
                        // project name handled in the request itself
                        // let cur_proj = $('.project-selector')[0].value;
                        // interfaceManager.toolbarManager.projectManager.name = cur_proj;

                        interfaceManager.notificationManager.show('TODO: BUBBLE TEXT PROJECT LOADED', {type:'success'});
                        // Set active element focus to document body after project is loaded
                        document.activeElement.blur();
                    }
                    else {
                        //Handle Error
                        interfaceManager.notificationManager.show(response.data.message, {type:'error'});
                    }
                    break;

                case 'createNewProject':
                    if (response.status == 1) {
                        // Make sure user-config is up to date
                        variableManager.reFetchAndUpdateConfig();

                        // Last project


                        // Clear Project List
                        // $('.project-selector').empty();

                        // Populate Projects
                        let projects = response.data.projects;
                        let contents = ['Select Video Project'];


                        for (let i in projects) {
                            contents.push(projects[i])
                        }
                        interfaceManager.toolbarManager.setProjectList(contents);

                        // Load New Project
                        interfaceManager.toolbarManager.projectManager.name = response.data.project_name;
                        $('.proj-btn')[0].innerHTMl = response.data.project_name;
                        interfaceManager.toolbarManager.projectManager.getProject(response.data.project_name);
                    }
                    else {
                        //Handle Error
                        interfaceManager.notificationManager.show(response.data.message, {type:'error'});
                    }
                    break;

                default:
                    interfaceManager.notificationManager.show('Unknown Response: ' + response, {type:'warning'});
            }
        }
    }
    /**
     * Initialize dataset editor.
     */
    initializeDatasetEditor() {
        this.xhrs['dataset'].onload = function () {

            let response = JSON.parse(this.response);

            switch (response.source) {
                case 'saveData':
                    {
                        /*-------------------------------------------
                            SAVE
                        ----------------------------------------------*/
                        // else if (datasetresponseText == save_message_success) {
                        //     console.log('TODO: ' + datasetresponseText);
                        //     processManager.history.changedData.clear();
                        // }
                        // else if (datasetresponseText == save_message_fail) {
                        //     console.log('TODO: ' + datasetresponseText);
                        // }
                        if (response.status == 1) {
                            processManager.history.changedData.clear();
                        }
                        else { }              
                        interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});
                    }
                    break;
                case 'saveAsData':
                    {
                        /*-------------------------------------------
                            SAVE AS
                        ----------------------------------------------*/
                        // else if (datasetresponseText == saveas_message_success) {
                        //     console.log('TODO: ' + datasetresponseText);
                        //     processManager.history.changedData.clear();

                        //     let tokens = this.newName.split('/')
                        //     let newDatasetName = tokens[2]
                        //     interfaceManager.toolbarManager.projectManager.addDatasetToList(newDatasetName);
                        //     interfaceManager.mainScreenManager.dataPanelManager.addNewDatasetToList(newDatasetName);
                        //     interfaceManager.toolbarManager.projectManager.currentProject.dataset = newDatasetName
                        // }
                        // else if (datasetresponseText == saveas_message_fail) {
                        //     console.log('TODO: ' + datasetresponseText);
                        // }
                        if (response.status == 1) {
                            processManager.history.changedData.clear();

                            let tokens = this.newName.split('/')
                            let newDatasetName = tokens[2]
                            interfaceManager.toolbarManager.projectManager.addDatasetToList(newDatasetName);
                            interfaceManager.mainScreenManager.dataPanelManager.addNewDatasetToList(newDatasetName);
                            interfaceManager.toolbarManager.projectManager.currentProject.dataset = newDatasetName
                        }
                        else { }
                        interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'fetchDatasets':
                    {
                        // let contents = [] //['None']
                        // if (datasetresponseText.trim() == "{}") {
                        //     processManager.xhrManager.writeDataset(
                        //         'new-dataset',
                        //         {
                        //             //processManager.currentProject.name,
                        //             currentproject: interfaceManager.toolbarManager.projectManager.currentProject.name,
                        //             datasetname: 'new-dataset'
                        //         }
                        //     )
                        // // }
                        // else {
                        //     datasetresponseText = JSON.parse(datasetresponseText);
                        //     for (let i in datasetresponseText) {
                        //         contents.push(datasetresponseText[i]);
                        //     }
                        //     interfaceManager.toolbarManager.projectManager.initializeDatasets(datasetresponseText);
                        // }
                        // interfaceManager.mainScreenManager.dataPanelManager.setDatasetList(contents);
                        if (response.status == 1) {
                            let contents = [];
                            
                            if(Object.keys(response.data.datasets).length < 1)
                            {
                                interfaceManager.mainScreenManager.dataPanelManager.setDatasetList(contents);

                                interfaceManager.notificationManager.show('No dataset found. Creating a default dataset.', {type:'warning'});

                                processManager.xhrManager.writeDataset('new-dataset',
                                {
                                    currentproject: interfaceManager.toolbarManager.projectManager.currentProject.name,
                                    datasetname: interfaceManager.toolbarManager.projectManager.currentProject.name
                                })
                            }
                            else
                            {
                                for (let i in response.data.datasets) {
                                    contents.push(response.data.datasets[i]);
                                }
                                interfaceManager.toolbarManager.projectManager.initializeDatasets(response.data.datasets);
                                interfaceManager.mainScreenManager.dataPanelManager.setDatasetList(contents);
                                
                                interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});
                            }
                        }
                        else {
                            interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});
                        }

                    }
                    break;
                case 'createNewDataset':
                    {
                        // if (datasetresponseText == 'file-created') {
                        //     let contents = ['new-dataset'];
                        //     interfaceManager.mainScreenManager.dataPanelManager.setDatasetList(contents);
                        //     // $('.dataset-selection').val('new-dataset'); //Old dataset list method
                        //     $('.dataset-btn')[0].innerText = 'new-dataset'; //New dataset dialog box method
                        //     processManager.getDataset('new-dataset');
                        // }
                        if (response.status == 1) {
                            let contents = [response.data.dataset_name];
                            interfaceManager.mainScreenManager.dataPanelManager.setDatasetList(contents);
                            
                            // $('.dataset-selection').val('new-dataset'); //Old dataset list method
                            $('.dataset-btn')[0].innerText = response.data.dataset_name; //New dataset dialog box method
                            
                            processManager.getDataset(response.data.dataset_name);
                        }
                        else { }
                        interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'loadDataset':
                    {
                        // else if (datasetresponseText == 'Dataset Loaded') { /* Good loaded, nothing to do */ }
                        if (response.status == 1) { }
                        else { }
                        interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'writeDefaultDataset':
                    {
                        // else if (datasetresponseText == 'Default written') {
                        //     console.log('TODO: BUBBLE TEXT DEFAULT WRITTEN')
                        // }
                        if (response.status == 1) { }
                        else { }
                        interfaceManager.notificationManager.show(response.data.message, {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'writeNewTrack':
                    {
                        if (response.status == 1) { }
                        else { }
                        console.log('NOTIFICATION: ' + response.data.message)
                        interfaceManager.notificationManager.show('New Track Add: ' + (response.status==1 ? 'Success' : 'Fail'), {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'changeTrackName':
                    {
                        if (response.status == 1) { }
                        else { }
                        console.log('NOTIFICATION: ' + response.data.message)
                        interfaceManager.notificationManager.show('Change Track Name: ' + (response.status==1 ? 'Success' : 'Fail'), {type : response.status==1 ? 'success' : 'error', dontShowButton :true});
                    }
                    break;
                case 'changeTrackColor':
                    {
                        if (response.status == 1) { }
                        else { }
                        console.log('NOTIFICATION: ' + response.data.message)
                        interfaceManager.notificationManager.show('Change Track Color: ' + (response.status==1 ? 'Success' : 'Fail'), {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'changeTrackNumber':
                    {
                        if (response.status == 1) { }
                        else { }
                        console.log('NOTIFICATION: ' + response.data.message)
                        interfaceManager.notificationManager.show('Change Track Name: ' + (response.status==1 ? 'Success' : 'Fail'), {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                case 'deleteTrack':
                    {
                        if (response.status == 1) { }
                        else { }
                        console.log('NOTIFICATION: ' + response.data.message)
                        interfaceManager.notificationManager.show('Track Deletion: ' + (response.status==1 ? 'Success' : 'Fail'), {type : response.status==1 ? 'success' : 'error', dontShowButton :true});

                    }
                    break;
                default:
                    interfaceManager.notificationManager.show('NOTIFICATION: Unknown Response:' + response, {type:'warning'});
            }
        }
    }

    /**
     * Initialize dataset editor.
     */
    initializeUploader() {
        // Reference code from https://pythonise.com/categories/javascript/upload-progress-bar-xmlhttprequest
        this.xhrs['uploader'].upload.addEventListener("progress", function (e) {
            // Get the loaded amount and total filesize (bytes)
            var loaded = e.loaded;
            var total = e.total

            // Calculate percent uploaded
            var percent_complete =  Math.floor((loaded / total) * 100);

            // Update the progress text and progress bar
            // $('#uploader_progress')[0].value = percent_complete;
            $('#uploader_progress_value')[0].innerHTML = '' + percent_complete + '%';
            $('#uploader_progress_value')[0].style.width = percent_complete + '%';
            // console.log("Loading " + Math.floor(percent_complete) + '%...');
        })

        this.xhrs['uploader'].upload.addEventListener("loadend", function (e) {
            // Get the loaded amount and total filesize (bytes)
            var loaded = e.loaded;
            var total = e.total

            // Calculate percent uploaded
            var percent_complete =  Math.floor((loaded / total) * 100);

            // Update the progress text and progress bar
            // $('#uploader_progress')[0].value = percent_complete;
            $('#uploader_progress_value')[0].innerHTML = '' + percent_complete + '%';
            $('#uploader_progress_value')[0].style.width = percent_complete + '%';
            // console.log("Completed " + percent_complete + '%');
        })

        this.xhrs['uploader'].onload = function () {
            let response = JSON.parse(this.response);
            switch (response.source) {
                case 'createNewProject':
                    {
                        if (response.status == 1) {
                            // Make sure user-config is up to date
                            variableManager.reFetchAndUpdateConfig();

                            // Last project
                            // let cur_proj = $('.project-selector')[0].value;

                            // Clear Project List
                            // $(`.proj-row-container`).empty()

                            // Populate Projects
                            let projects = response.data.projects;
                            let contents = []
                            for (let i in projects) {
                                contents.push(projects[i])
                            }
                            interfaceManager.toolbarManager.setProjectList(contents);

                            // Load New Project
                            interfaceManager.toolbarManager.projectManager.name = response.data.project_name;
                            $('.project-btn')[0].innerHTML = response.data.project_name;
                            interfaceManager.toolbarManager.projectManager.getProject(response.data.project_name);

                            // Disable New Project Dialog When Done
                            globalProjDatasetDialog.hideDialogNewProject();

                            // Also hide project list
                            globalProjDatasetDialog.hideDialogProjectList();
                        }
                        else {
                            //Handle Error
                            interfaceManager.notificationManager.show(response.data.message, {type:'error'});
                        }
                    }
                    break;
                case 'createNewDataset':
                    {
                        if (response.status == 1) {
                            //TODO
                        }
                        else {
                            //Handle Error
                            interfaceManager.notificationManager.show(response.data.message, {type:'error'});
                        }
                    }
                    break;
            }
        }
    }

    /**
     * Write into config.
     * @param {String} target String tag.
     * @param {*} data Data for url.
     */
    writeConfig(target, data) {
        let url;
        // target now is the key in user-config.json
        if (target == 'active-angle') {
            //console.log('TODO: REQUEST PROCESS WRITE CONFIG', target, data)
            url = `/writeDefaultAngle/${data}`
        }
        // else if (target == 'active-track') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        // } else if (target == 'slider-value') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        //     // url =  `/updateConfig/${type}/${parseInt(this.state.currentvalue)}`;
        // } else if (target == 'toggle-lines') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        // } else if (target == 'toggle-keypoints') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        // } else if (target == 'toggle-video') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        // } else if (target == 'interval-value') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        // } else if (target == 'show-tooltip') {
        //     console.log('TODO: REQUEST PROCESS WRITE CONFIG')
        //     return;
        //     // url = '/updateConfig/SHOW_TOOLTIPS/0';
        // } else if (target == 'user-config') {
        //     // write config and refetch
        // }

        else {
            //console.log('TODO: REQUEST PROCESS WRITE CONFIG', target, data)
            url = `/updateConfig/${target}/${data}`
        }

        this.requestProcess({
            type: 'config',
            url: url
        })
    }
    /**
     * Write into dataset.
     * @param {String} target String tag.
     * @param {*} data Data for url.
     */
    writeDataset(target, data) {
        let url;

        // CORE DATASET
        // -------------------------------------------------
        if (target == 'new-dataset') {
            console.log('REQUEST PROCESS WRITE DATASET ' + data)
            url = `/createNewDataset/${data.datasetname}`
        }
        else if (target == 'save') {
            url = `/saveData/${data}`
        }
        else if (target == 'save-as') {
            url = `/saveAsData/${data.name}/${data.value}`;
        }
        else if (target == 'fetch-dataset') {
            url = `/fetchDatasets/${data}`;
        }
        else if (target == 'load-dataset') {
            url = `/loadDataset/${data}`
        }
        else if (target == 'default-dataset') {
            //console.log('DONE: Save default dataset ' + data)
            url = `/writeDefaultDataset/${data.project}/${data.dataset}`
        }

        // TRACKS SPECIFIC
        // -------------------------------------------------
        //      All tracks assume current_project and current_dataset
        //      So must make sure the current project and current dataset is update in the server side
        else if (target == 'new-track') {
            //console.log('TODO: REQUEST PROCESS CREATE NEW TRACK ' + data.type + ' ' + data.name + ' ' + data.color)
            url = `/writeNewTrack/${data.name}/${data.type}/${data.color}`
        }
        else if (target == 'change-track') {
            console.log('TODO: REQUEST PROCESS CHANGE TRACK ' + data)
            // url '/changeTrackName/<old_name>/<new_name>'
            // url '/changeTrackColor/<track_name>/<new_color>'
            // url '/changeTrackNumber/<track_name>/<new_number>'
            return;
        }
        else if (target == 'delete-track') {
            console.log('TODO: REQUEST PROCESS DELETE TRACK ' + data)
            // url '/deleteTrack/<track_name>'
            return;
        }
        else {
            return;
        }
        this.requestProcess({
            type: 'dataset',
            url: url
        })
    }
    /**
     * Write into project.
     * @param {String} target String tag.
     * @param {*} data Data for url.
     */
    writeProject(target, data) {
        let url;
        if (target == 'get-project-list') {
            url = `/fetchProjects`
        }
        else if (target == 'load-project') {
            url = `/loadProject/${data}`;
            $('.dataset-btn')[0].innerText = 'Select Dataset';
        }
        else if (target == 'new-project') {
            url = `/createNewProject`
        }
        else if (target == 'shutdown') {
            url = `/shutdown`
        } else if (target == "import") {
            url = `/createNewProject/${data}/<dataset_name>/<video_path>`
        }
        else {
            return;
        }
        this.requestProcess({
            type: 'project',
            url: url
        });
    }
    /**
     * Write into project.
     * @param {String} target String tag.
     * @param {*} data Data for url.
     */
    writeUploader(target, data) {
        let url;

        if (target == 'new-project') {
            url = `/createNewProject/${data.project_name}/${data.dataset_name}`
        }
        else if (target == 'new-dataset') {
            url = `/createNewDataset/${data.project_name}/${data.dataset_name}`
        }
        else {
            return;
        }
        this.requestProcess({
            type: 'uploader',
            url: url
        });
    }
}