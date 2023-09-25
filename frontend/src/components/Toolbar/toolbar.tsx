import DialogSelectProject from '../Dialog/SelectProject';
import styles from './toolbar.module.scss';
import { Project } from '../../interfaces/projects';

export default function Toolbar() {
    const projects: Project[] = [];

    const handleSelectProject = () => {
        (document.getElementById("modal_select_project") as HTMLDialogElement)?.showModal();
    }
    const handleUndo = () => {

    }
    const handleRedo = () => {

    }

    return (
        <div className="bg-white flex w-full justify-between">
            <div className="m-1 gap-1 h-8 w-[25%] flex flex-item">
                <a href='http://www.Snehesh.com/feva' target="_blank">
                    <img className="h-full" src={'/assets/feva.png'} title={'Fast Events Video Annotation tool by UMD CS'} />
                </a>
                <button className="rounded-[0.5em] h-full border-2 text-sm px-2 border-black hover:bg-gray-200" onClick={handleSelectProject}>Select Project</button>
            </div>
            <div className={`m-1 gap-1 h-8 flex flex-item ${styles.toolbarButtons}`}>
                <button className={`${styles.undoButton} aspect-[1/1]`} onClick={handleUndo}></button>
                <button className={`${styles.redoButton} aspect-[1/1]`} onClick={handleRedo}></button>
            </div>
            {/* <Options></Options> */}
            <DialogSelectProject />
        </div>
    )
}

// /**
//  * ====================================================================================================
//  *                                          TOOL BAR MANAGER
//  * ====================================================================================================
//  * Manager for toolbar UI at the very top.
//  */
// class ToolbarManager {
//     /**
//      * Constructor.
//      */
//     constructor() {
//         this.projectManager = new ProjectManager();
//         this.sliders = {
//             'rows': {
//                 config: 'ROW',
//                 func: () => {
//                     interfaceManager.notificationManager.show('Refresh the browser to see the effects of this change.', {type:'warning', timeout: 3000});
//                 }
//             },
//             'cols': {
//                 config: 'COL',
//                 func: () => {
//                     interfaceManager.notificationManager.show('Refresh the browser to see the effects of this change.', {type:'warning', timeout: 3000});
//                 }
//             },
//             'keypoints': {
//                 config: 'VALUE_KEYPOINTS',
//                 func: () => {
//                     // 1. Get radii for margin and circle size.
//                     const radii = -1.5 * variableManager.config.VALUE_KEYPOINTS, size = 3 * variableManager.config.VALUE_KEYPOINTS;
//                     // 2. For every keypoints
//                     $.map($('.container-points')[0].childNodes, function (p) {
//                         // 2.1. Set appropriate margin and size.
//                         $(p).css({
//                             marginLeft: radii,
//                             marginTop: radii,
//                             width: size,
//                             height: size
//                         });
//                     });
//                 }
//             },
//             'preview': {
//                 config: 'VALUE_PREVIEW',
//                 func: () => {
//                     // 1. Get current active angle.
//                     const active = interfaceManager.mainScreenManager.selectorPanelManager.activeAngle;
//                     // 2. Update config stylesheet for preview video.
//                     variableManager.configPreview();
//                     // 3. Update preview video left and top based on active angle.
//                     $('.video-preview').css({
//                         left: `-${(((active - 1) % variableManager.config.COL) * 100)}%`,
//                         top: `-${(Math.floor((active - 1) / variableManager.config.COL) * 100)}%`
//                     });
//                 }
//             },
//             'interval': {
//                 config: 'VALUE_INTERVAL',
//                 func: () => {
//                     // 1. Update pixel per interval value.
//                     variableManager.updatePixelPerInterval();
//                     // 2. Update display when interval changes.
//                     interfaceManager.updateDisplay('interval');
//                 }
//             }
//         };
//         this.toggles = {
//             'toggle-lines': {
//                 config: 'SHOW_LINES'
//             },
//             'toggle-keypoints': {
//                 config: 'SHOW_KEYPOINTS'
//             },
//             'toggle-video': {
//                 config: 'SHOW_VIDEO'
//             }
//         }
//         this.toggle = (id) => {
//             let js_selector;
//             // 1. Set selector if ID is toggle for lines
//             if (id == 'toggle-lines') js_selector = $('.container-joints');
//             // 2. Else if toggle for keypoints
//             else if (id == 'toggle-keypoints') js_selector = $('.container-points');
//             // 3. Else if toggle for video
//             else if (id == 'toggle-video') js_selector = $('.video-main');
//             // 4. Else throw Exception if ID is not found.
//             else throw new KeyException(
//                 `ID ${id} cannot be found. ` +
//                 `Please contact developer to resolve this issue. `
//             );
//             // 5. Set selector display on check.
//             $(`.input.${id}`).is(":checked") ? js_selector.show() : js_selector.hide();
//             // 6. Write into config.
//             variableManager.configs(this.toggles[id].config, +$(`.input.${id}`).is(":checked"));

//             //7. Remove focus -- Fix for #240, #264, and #257 
//             document.activeElement.blur();
//         }
//         this.optionlist = [
//             {
//                 type: 'slider',
//                 text: 'rows',
//                 min: 1,
//                 max: 5,
//                 value: variableManager.config.ROW
//             },
//             {
//                 type: 'slider',
//                 text: 'cols',
//                 min: 1,
//                 max: 5,
//                 value: variableManager.config.COL
//             },
//             {
//                 type: 'slider',
//                 text: 'Preview',
//                 min: 1,
//                 max: 5,
//                 value: variableManager.config.VALUE_PREVIEW
//             },
//             {
//                 type: 'toggle',
//                 family: 'video',
//                 text: 'Show Video',
//                 id: 'toggle-video',
//                 default: variableManager.config.SHOW_VIDEO
//             },
//             {
//                 type: 'slider',
//                 text: 'Keypoints',
//                 min: 1,
//                 max: 5,
//                 value: variableManager.config.VALUE_KEYPOINTS
//             },
//             {
//                 type: 'toggle',
//                 family: 'keypoints',
//                 text: 'Show Keypoints',
//                 id: 'toggle-keypoints',
//                 default: variableManager.config.SHOW_KEYPOINTS
//             },
//             {
//                 type: 'toggle',
//                 family: 'keypoints',
//                 text: 'Show Lines',
//                 id: 'toggle-lines',
//                 default: variableManager.config.SHOW_LINES
//             },
//             {
//                 type: 'slider',
//                 text: 'Interval',
//                 min: -1,
//                 max: 7,
//                 value: Math.pow(2, variableManager.config.VALUE_INTERVAL)
//             }
//         ],

//             this.projectList = []
//     }
//     /**
//      * Set project list as app loaded.
//      * @param {List} list Project list.
//      */
//     setProjectList(list) {
//         // 1. Clear project list.
//         $('.project-selector').empty();
//         // 2. Add project list
//         // 2.1. Create project list for every options.
//         this.projectList = []
//         list.map(project => {
//             this.projectList.push(project)
//         })
//     }

//     /**
//      * Set keypoints sliders accordingly.
//      * @param {boolean} exists Keypoints exists.
//      */
//     setKeypoints(exists) {
//         // 1. Set keypoints options based on keypoints existence.
//         $('.input.toggle-keypoints').prop("disabled", !exists);
//         // 2. Set keypoints check based on user config show keypoints property.
//         $('.input.toggle-keypoints').prop("checked", variableManager.config.SHOW_KEYPOINTS);
//         // 3. Change background of toggle to indicate existence.
//         $('.slider.toggle-keypoints').css({ background: exists ? '' : '#900D09' })
//     }
//     /**
//      * Set keypoints lines sliders accordingly.
//      * @param {boolean} exists Keypoints exists.
//      */
//     setKeypointsLines(exists) {
//         // 1. Set keypoints lines options based on keypoints existence.
//         $('.input.toggle-lines').prop("disabled", !exists);
//         // 2. Set keypoints check based on user config show lines property.
//         $('.input.toggle-lines').prop("checked", variableManager.config.SHOW_LINES);
//         // 3. Change background of toggle to indicate existence.
//         $('.slider.toggle-lines').css({ background: exists ? '' : '#900D09' })
//     }
//     /**
//      * Render toolbar UI display via React.
//      */
//     render() {
//         return new Promise(res => {
//             ReactDOM.render(
//                 <ToolbarReact
//                     info={this.optionlist}
//                 />,
//                 $('.root-tool-bar')[0]
//             );
//             res(true);
//         })
//     }
// }

// /**
//  * Project Manager for fetching project.
//  */
// class ProjectManager {
//     /**
//      * Constructor
//      */
//     constructor() {
//         this.currentProject = {
//             angle: -1,
//             current_dataset: '',
//             datasets: [],
//             path: '',
//             name: '',
//             keypoints: {
//                 exists: false,
//                 list: [],
//                 json: {}
//             }
//         }
//     }
//     /**
//      * Check for default value.
//      * @param {String} name Current project name.
//      */
//     checkDefault(name) {
//         const proj_config = variableManager.config.PROJECT_LIST;

//         // 0.1 check if project name in project_list or not
//         if (!(name in proj_config))
//         {
//             proj_config[name] = {};
//         }
//         // 0.2 check if there is only 1 dataset -- treaat that as default
//         if (interfaceManager.mainScreenManager.dataPanelManager.dataSetList.length == 1)
//         {
//             proj_config[name]['default_dataset'] = interfaceManager.mainScreenManager.dataPanelManager.dataSetList[0];
//         }
//         // 0.3 check if camera config is 1x1 -- treat cam 1 as default
//         if (variableManager.config.ROW * variableManager.config.COL == 1)
//         {
//             proj_config[name]['default_angle'] = "1";
//         }

//         // If more than one dataset and no default dataset, then let the user choose.
//         if (interfaceManager.mainScreenManager.dataPanelManager.dataSetList.length > 1 &&
//             (!proj_config[name]['default_dataset']))
//         {
//             interfaceManager.mainScreenManager.dataPanelManager.dataToolReact.showDialogDatasetList(); 
//         }

//         // 1. Check if project name is listed in project list.
//         if (proj_config[name] != undefined) {
//             let angle = proj_config[name].default_angle, dataset = proj_config[name].default_dataset, text = [];
//             // 1.1. If no default angle or dataset.
//             if (angle == undefined && dataset == undefined) {
//                 text.push('No default angle nor dataset found.');
//                 text.push('Please select an angle and a dataset.');
//                 // 1.1.1. Push vidoe out for angle selection.
//                 interfaceManager.mainScreenManager.videoPanelManager.displaySelector();
//             }
//             // 1.2. Either one exists.
//             else {
//                 let str = 'Default angle: '
//                 // 1.2.1. Construct text for default angle.
//                 if (angle) {
//                     str += 'found.';
//                     text.push(str);
//                     text.push('Displaying current selected default angle.');
//                     // 1.2.1.1. Set current project to default angle.
//                     this.currentProject.angle = angle;
//                     // 1.2.1.2. Set active angle for selector.
//                     interfaceManager.mainScreenManager.selectorPanelManager.setActiveAngle(angle);
//                 }
//                 // 1.2.2. Construct text to select angle
//                 else {
//                     str += 'not found.';
//                     text.push(str);
//                     text.push('Please select a camera angle.');
//                 }
//                 str = 'Default dataset: ';
//                 // 1.2.2. Construct text for default dataset.
//                 if (dataset) {
//                     str += 'found.';
//                     text.push(str);
//                     text.push('Displaying current selected default dataset.');
//                     // 1.2.2.1. Set current dataset selection on option to be default dataset.
//                     $('.dataset-btn')[0].innerText = dataset
//                     // 1.2.2.2. Set current project current dataset to be default dataset.
//                     this.currentProject.current_dataset = dataset;
//                     // 1.2.2.3. Get dataset.
//                     processManager.getDataset(dataset);
//                 } else {
//                     str += 'not found.';
//                     text.push(str);
//                     text.push('Please select a dataset.');
//                 }
//             }
//             // 1.3. Display bubble text.
//             interfaceManager.bubbleTextManager.showMessage(text);
//         }
//         // 2. No default dataset detected.
//         else {
//             // 2.2. Display bubble text.
//             interfaceManager.bubbleTextManager.showMessage(
//                 [`No records found for current dataset's default value.`, `Please select an angle and a dataset.`]
//             );
//         }
//     }
//     /**
//      * Get selected project file.
//      */

//     async getProject(selectedProject) {
//         // $('.project-selector')[0].style.visibility = 'hidden'
//         const proj_manager = interfaceManager.toolbarManager.projectManager;
//         // 1. Pause main video to prevent playback error.
//         $('.video-button.big').addClass('play');
//         $('.video-main')[0].pause();
//         // 2. Stop scrolling interval as video is paused.
//         processManager.intervalManager.stopInterval('scroll');
//         // 3. Reset current project data.
//         proj_manager.currentProject = {
//             angle: -1,
//             current_dataset: '',
//             datasets: [],
//             path: '',
//             name: '',
//             keypoints: {
//                 exists: false,
//                 list: [],
//                 json: {}
//             }
//         }

//         //Unselecting label before loading new project–fix for #229.
//         interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
//         // 4. Reset interface for incoming project.
//         interfaceManager.resetDisplay();
//         // 5. Check if placeholder value is selected and stop. 
//         if ($('.project-selector option:selected').val() == 'Select Video Project') {
//             // 5.1. Hide loading screen.
//             $('.root-processing-screen').hide();
//             // 5.2. Hide blocker.
//             $('.blocker').addClass('hidden');
//             // 5.3. Reset history list.
//             processManager.history.resetHistoryList();
//             return;
//         }
//         // 6. Set project manager current project name to selected project.
//         // const name = $('.project-selector option:selected').val();
//         const name = selectedProject
//         proj_manager.currentProject.name = name;

//         // 7. Set project manager current project path to selected project path.
//         proj_manager.currentProject.path = `static/data/${name}/`;
//         // 8. Send response to set current project as selected.
//         processManager.xhrManager.writeProject('load-project', name);
//         // 9. Send response to fetch datasets of current selected project.
//         processManager.xhrManager.writeDataset('fetch-dataset', name);
//         // 10. Set video sources for current project.
//         $('.video-main')[0].src = $('.video-preview')[0].src = `${proj_manager.currentProject.path}${name}.mp4`;
//         // 11. Check video playback / video exists.
//         let promisemain = await processManager.processes['get-play-back']($('.video-main')[0]);
//         if (promisemain) {
//             // 11.1. Update Mainscreen display when video is available.
//             interfaceManager.updateDisplayMain();
//             // 11.2. Update config to css stylesheet.
//             variableManager.configPostVideo();
//             // 11.3. Draw Wave files.
//             processManager.audioWavesManager.load(`${proj_manager.currentProject.path}${name}.mp4`);
//             // 11.4. Set new wave width.
//             $('#waveform').css({ width: `${variableManager.CONFIG_PIXEL_PER_INTERVAL * $('.video-main')[0].duration}px` });
//         } else {
//             // 11.2. Send message indicating main video fails to load.
//             interfaceManager.bubbleTextManager.showMessage(
//                 [`No video source found for: ${proj_manager.currentProject.name}.mp4.`]
//             );
//         }
//         // 12. Set video generator source for current project.
//         interfaceManager.generatorManager.generator.getGenerator(proj_manager.currentProject.path + name);
//         // 13. Check video playback / video exists for generator.
//         let promisegen = await processManager.processes['get-play-back']($('.video-generator')[0]);
//         if (promisegen) {
//             // 13.1. Update Datadisplay when video is available.
//             interfaceManager.updateDisplayGen();
//         } else {
//             // 13.2. Send message indicating generator video fails to load / main video does not exists.
//             interfaceManager.bubbleTextManager.showMessage(
//                 [`No generator video source found for: ${this.currentProject.name}.mp4 or `,
//                 `${this.currentProject.name}_generator.mp4.`]
//             )
//         }
//         // 14. Check if keypoints exists for current selected project.
//         let promisekeypoints = await processManager.processes['fetch-keypoints'](proj_manager.currentProject.path + name);
//         // 15. Set current project keypoints availability.
//         proj_manager.currentProject.keypoints.exists = promisekeypoints;
//         // 16. Update Mainscreen when keypoints is available.
//         interfaceManager.updateDisplayKeypoints(promisekeypoints);
//         // 17. If Main video and Generator video exists, check for default dataset and angle.
//         if (promisemain && promisegen) {
//             // 17.1. Check default dataset and angle.
//             proj_manager.checkDefault(name);
//             // 17.2. Remove processing screen.
//             interfaceManager.loadingScreenManager.processProcessingScreen();

//             // And hide project list dialog
//             globalProjDatasetDialog.hideDialogProjectList();
//         }
//     }
//     /**
//      * Initialize list of datasets for current project.
//      * @param {{}} list List of datasets.
//      */
//     initializeDatasets(list) {
//         for (let i in list) {
//             this.currentProject.datasets.push(list[i]);
//         }
//     }
//     /**
//      * add new dataset to current project.
//      */
//     addDatasetToList(datasetName) {
//         this.currentProject.datasets.push(datasetName);
//         console.log(this.currentProject);
//     }
// }