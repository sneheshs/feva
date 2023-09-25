/**
 * Manager for interface that will run when the app loads.
 */
class InterfaceManager {
    /**
     * Constructor.
     */
    constructor() {
        this.loadingScreenManager = new LoadingScreenManager(
            [
                "progress-toolbar",
                "progress-mainscreen"
            ],
            [
                "progress-fetch-video",
                "progress-fetch-generator",
                'progress-fetch-keypoints'
            ]
        );
        this.toolbarManager = new ToolbarManager();
        this.mainScreenManager = new MainScreenManager();
        this.blockerManager = new BlockerManager();
        this.dataDisplayManager = new DataDisplayManager();
        this.generatorManager = new GeneratorManager();
        this.previewManager = new PreviewManager();
        this.contextMenuManager = new ContextMenuManager();
        this.scrubberManager = new ScrubberManager();
        this.keypointsManager = new KeypointsManager();
        this.pinpointFrameManager = new PinpointFrameManager();
        this.tooltipManager = new TooltipManager();
        this.bubbleTextManager = new BubbleTextManager();
        this.notificationManager = new NotificationManager();
        this.readyState = false;
    }
    /**
     * Initialize body element.
     */
    initializeBody() {
        // 1. Follow user-specified config for font family and size.
        $(document.body).css({
            fontFamily: variableManager.config.FONT_FAMILY,
            fontSize: variableManager.config.FONT_SIZE
        })
    }
    /**
     * Reset interface as project is fetched.
     */
    resetDisplay() {
        // 1. Reset ready state for main video.
        this.readyState = false;
        // 2. Reset processing screen.
        this.loadingScreenManager.resetProcessingScreen();
        // 3. Reset Main Screen for new project.
        this.mainScreenManager.reset();
        // 4. Reset Data display for new project.
        this.dataDisplayManager.reset();
        // 5. Reset generator for new project.
        $('.video-generator')[0].src = "";
        // 6. Show blocker to block until camera selection selected or default fetched.
        $('.blocker').removeClass('hidden');
    }
    /**
     * Update display interface based on changes called.
     * @param {String} tag Tag indicating changes origin. 
     */
    updateDisplay(tag) {
        if (tag == 'interval') {
            this.dataDisplayManager.updateDataDisplay();
            this.generatorManager.generateFrames(interfaceManager.toolbarManager.projectManager.currentProject.angle);
            this.scrubberManager.updateDisplay();
        }
    }
















    /**
     * Update color for menu and filter.
     */
    updateColorMenuFilter() {
        this.mainScreenManager.dataPanelManager.updateFilter();
        this.dataDisplayManager.speedLabelPanelManager.updateSpeedLabel();
        this.contextMenuManager.updateMenu();
    }
    /**
     * Update display as camera angle is selected.
     * @param {number} angle Camera angle.
     */
    updateDisplayAngle(angle) {
        this.mainScreenManager.updateSelectorAngle(angle);
        this.generatorManager.generateFrames(angle);
        $('.blocker').addClass('hidden');
    }
    /**
     * Update display after dataset is obtained.
     */
    updateDisplayPostGetData() {
        this.mainScreenManager.dataPanelManager.updateLabelDisplay()
        this.dataDisplayManager.labelPanelManager.processDataset();
        if ($(`.type-container.type-${variableManager.config.SPEED_LABEL_TYPE}.darken`)[0] == undefined) return;
        $('.speed-labeler').css({
            top: $(`.type-container.type-${variableManager.config.SPEED_LABEL_TYPE}.darken`)[0].getBoundingClientRect().top -
                $('.speedlabel-container')[0].getBoundingClientRect().top,
            width: 0
        })
    }
    /**
     * Update display after generator is obtained.
     */
    updateDisplayGen() {
        this.loadingScreenManager.setCompletion('progress-fetch-generator', 100, "Video Generator Successfully Loaded");
        this.dataDisplayManager.updateDisplayGen();
    }
    /**
     * Update display after keypoints is obtained.
     */
    updateDisplayKeypoints(exists) {
        this.toolbarManager.setKeypoints(exists);
        this.toolbarManager.setKeypointsLines(exists);
        this.keypointsManager.setKeypoints(exists);
        if (exists) {
            this.loadingScreenManager.setCompletion('progress-fetch-keypoints', 100, "Keypoints Successfully Loaded");
            this.keypointsManager.drawKeypoints(processManager.processes['current-video-frame'](0));
        } else {
            this.loadingScreenManager.setCompletion('progress-fetch-keypoints', 50, "Keypoints Unavailable");
        }
    }
    /**
     * Update display after main video is obtained.
     */
    updateDisplayMain() {
        this.loadingScreenManager.setCompletion('progress-fetch-video', 100, "Main Video Successfully Loaded");
        this.mainScreenManager.videoPanelManager.updateDisplay(0);
        this.dataDisplayManager.updateDisplayMain();
        this.readyState = true;
        this.scrubberManager.updateDisplay();
    }
    /**
     * Update display interface when new type is added.
     * @param {number} type New type to be added.
     */
    updateDisplayPostNewTypeAddition(type) {
        this.updateColorMenuFilter();
        this.dataDisplayManager.addNewColor(type);
    }
    /**
     * Update video information display, i.e. scrubber bar, frame number, video time, and keypoints.
     * @param {*} t 
     */
    updateVideoInfo(t) {
        let ratio = t / $('.video-main')[0].duration;
        this.mainScreenManager.videoPanelManager.updateDisplay(t);
        this.scrubberManager.updateScrubberDisplay(ratio);
        if (interfaceManager.toolbarManager.projectManager.currentProject.keypoints.exists)
            this.keypointsManager.drawKeypoints(processManager.processes['current-video-frame'](t));
    }
    /**
     * Process and display all interface elements.
     */
    processInterfaceDisplay() {
        processManager.processShortcuts();
        this.initializeBody();
        this.loadingScreenManager.render();
        let toolRes = this.toolbarManager.render();
        if (toolRes) {
            this.loadingScreenManager.setCompletion('progress-toolbar', 100, "Tool Bar Successfully Loaded");
        } else {
            this.notificationManager.show('TODO TOOLBAR NOT LOADED', {type:'error'});
        }
        let mainRes = this.mainScreenManager.render();
        if (mainRes) {
            this.loadingScreenManager.setCompletion('progress-mainscreen', 100, "Main Screen Successfully Loaded");
        } else {
            this.notificationManager.show('TODO MAIN SCREEN NOT LOADED', {type:'error'})
        }
        this.dataDisplayManager.render();
        this.generatorManager.render();
        this.blockerManager.render();
        this.contextMenuManager.render();
        this.keypointsManager.render();
        this.pinpointFrameManager.render(5);
        this.tooltipManager.render(variableManager.config.SHOW_TOOLTIPS);
        this.bubbleTextManager.render();
        processManager.processProjectList();
        processManager.addWindowOnclick(() => {
            this.contextMenuManager.hideAllMenu();
        });
        processManager.visibilityMode();
    }
}