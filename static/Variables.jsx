
/**
 * Manager for getting and writing config values and storing and editing variables.
 */
class VariableManager {
    /**
     * Constructor.
     */
    constructor() {
        this.requestCodes = {
            text: 0,
            type: 1,
            position: 2,
            add: 3,
            cut: 4
        };
        this.config = {};
        this.videoMetaData = {
        };
        this.selectedLabel = undefined;
        this.selectedLabelDiv = undefined;
        this.paddingResize = 0;
        this.fetchConfig();
        let res= new ResizeObserver(entries =>{
            this.processVariables()
        })
        res.observe($('body')[0])
    };
    configPreview() {
        $('#config-preview').remove();
        $('head').append(
            '<style id="config-preview" type="text/css">' +
            `.config.preview-container{height: ${variableManager.config.VALUE_PREVIEW * variableManager.CONFIG_IMAGE_HEIGHT}px;` +
            `width: ${variableManager.config.VALUE_PREVIEW * variableManager.config.IMAGE_WIDTH}px; }` +
            `.config.video-preview{height: ${variableManager.config.VALUE_PREVIEW * variableManager.CONFIG_IMAGE_HEIGHT * variableManager.config.ROW}px;` +
            `width: ${variableManager.config.VALUE_PREVIEW * variableManager.config.IMAGE_WIDTH * variableManager.config.COL}px; }` +
            `.data-display-panel>.preview-mouse-move{top: calc(50vh + ${10 - variableManager.config.VALUE_PREVIEW * variableManager.CONFIG_IMAGE_HEIGHT}px)}` +
            '</style>'
        )
    }

    configToStyle() {
        $('head').append(
            '<style id="config-style" type="text/css">' +
            `.config.toolbar{background: ${this.config.COLOR_TOOLBAR_BACKGROUND};}` +
            `.config-general{background: ${this.config.COLOR_BACKGROUND}; font-family: ${this.config.FONT_FAMILY};} ` +
            `.labels{height: ${this.config.LABEL_HEIGHT}px;}` +
            `.labels-arrow{border-width: ${this.config.LABEL_HEIGHT / 2}px;}` +
            `.camera-angle-selector-selection{width: ${100 / this.config.COL}%;height: ${100 / this.config.ROW}%;}` +
            `.camera-angle-selector-selection.active{border: ${this.config.SELECTOR_BORDER_COLOR} 3px solid;}` +
            `.padder.frame{height: ${this.config.IMAGE_WIDTH * (this.videoMetaData.ratio * this.config.COL/ this.config.ROW) + 25}px}` +
            `.labels-panel{height: calc(50vh - ${this.config.IMAGE_WIDTH * (this.videoMetaData.ratio * this.config.COL/ this.config.ROW) + 37.5}px);}` +
            '</style>'
        );
    }
    configPostVideo() {
        this.paddingResize = $('.padder')[0].clientWidth;
        let aspect_width = Math.floor($('.video-main')[0].videoWidth / this.config.COL / 0.75);
        let aspect_height = Math.floor($('.video-main')[0].videoHeight / this.config.ROW / 0.5 + 25);
        let aspect_width_zoom = Math.floor($('.video-main')[0].videoWidth / 0.75);
        let aspect_height_zoom = Math.floor($('.video-main')[0].videoHeight / 0.5 + 25);
        let aspect_zoom = ($('.video-main')[0].videoWidth / $('.video-main')[0].videoHeight);
        let aspect_section = aspect_zoom *
            (this.config.ROW / this.config.COL);
        $('.selector-image').css({ height: 50 / $('.video-main')[0].videoWidth * $('.video-main')[0].videoHeight });
        $('#config-padding').remove();
        $('head').append(
            '<style id="config-padding" type="text/css">' +
            // State 1.
            `.pad-vertical{height: calc(50% - ${37.5 / aspect_section}vw);}` +
            `.pad-vertical.zoom-out{height: calc(50% - ${37.5 / aspect_zoom}vw);}` +
            `.central-pad{height: ${75 / aspect_section}vw;}` +
            `.central-pad.zoom-out{height: ${75 / aspect_zoom}vw;}` +
            `.selector-image-row{height: ${100 / this.config.ROW}%;}` +
            `.selector-image-content{width: ${100 / this.config.COL}%;}` +
            `.video-main{width: ${100 * this.config.COL}%;}` +
            // State 2.
            `@media (min-aspect-ratio: ${aspect_width}/${aspect_height}) {` +
            `.central-pad{height: calc(50vh - 12.5px);}` +
            `.pad-horizontal{width: calc(37.5vw - ${aspect_section * 25}vh + ${aspect_section * 6.25}px);}` +
            `.cropper{width: calc(${aspect_section * 50}vh - ${aspect_section * 12.5}px); height: unset;}` +
            `.cropper.zoom-out{width: calc(${aspect_zoom * 50}vh - ${aspect_zoom * 12.5}px); height: unset;}` +
            `}` +
            // State 3.
            `@media (min-aspect-ratio: ${aspect_width_zoom}/${aspect_height_zoom}) {` +
            `.video-main.zoom-out{height: 100%; width:unset;}` +
            `.central-pad.zoom-out{height: calc(50vh - 12.5px);}` +
            `.pad-horizontal.zoom-out{width: calc(37.5vw - ${aspect_zoom * 25}vh + ${aspect_zoom * 6.25}px);}` +
            `}` +
            // Video duration
            `.labels-panel{width: ${((this.config.IMAGE_WIDTH / variableManager.CONFIG_INTERVAL) * $('.video-main')[0].duration) + this.paddingResize}px}` +
            '</style>'
        );


    }
    /**
     * Re-Fetch configuration. No need to update anything else.
     * Was mainly added for new project creation. This could be extended
     * for other things later on.
     */
    reFetchAndUpdateConfig() {
        $.ajax({
            url: `static/user-config.json?${Date.now()}`,
            dataType: 'json',
            async: true,
        }).done((data) => {
            for (let obj in data) {
                this.config[obj] = data[obj];
            }
        }).fail(() => {

        }).then(() => {

        });
    }
    /**
     * Fetch all configuration variables.
     */
    fetchConfig() {
        $.ajax({
            url: `static/user-config.json?${Date.now()}`,
            dataType: 'json',
            async: true,
        }).done((data) => {
            for (let obj in data) {
                this.config[obj] = data[obj];
            }
        }).fail(() => {
            processManager.xhrManager.writeConfig(
                'user-config',
                {
                    COL: 2,
                    COLOR_BACKGROUND: "#191919",
                    COLOR_KEYPOINTS: "#00FF00",
                    FRAMES_PER_SECOND: 30,
                    FONT_FAMILY: "Roboto",
                    FONT_FAMILY_LABEL: "Courier New",
                    FONT_SIZE: 10,
                    IMAGE_WIDTH: 100,
                    KEYCODE_BACKSPACE: "Backspace",
                    KEYCODE_DELETE: "Delete",
                    KEYCODE_ESCAPE: "Escape",
                    KEYCODE_PLAY: "Space",
                    LABEL_HEIGHT: 20,
                    PROJECT_LIST: {},
                    REACTION_TIME: 500,
                    ROW: 3,
                    SHORTCUTS: {
                        "ANNOTATE": "KeyA",
                        "EDIT": "KeyE",
                        "FIND": "KeyF",
                        "REDO": "KeyY",
                        "SAVE": "KeyS",
                        "UNDO": "KeyZ",
                        "COPY": "KeyC",
                        "CUT": "KeyX",
                        "PASTE": "KeyV",
                        "5SEC_BACKWARD": "ArrowLeft",
                        "5SEC_FORWARD": "ArrowRight",
                        "FRAME_BACKWARD": "ArrowLeft",
                        "PLAYBACK_RATE_INCREASE": "ArrowUp",
                        "PLAYBACK_RATE_DECREASE": "ArrowDown",
                        "FRAME_FORWARD": "ArrowRight",
                        "ZOOM_IN": "ScrollUp",
                        "ZOOM_OUT": "ScrollDown"
                    },
                    SHOW_KEYPOINTS: 1,
                    SHOW_LINES: 1,
                    SHOW_TOOLTIPS: 1,
                    SHOW_VIDEO: 1,
                    SELECTOR_BORDER_COLOR: "#663A82",
                    SPEED_LABEL_TYPE: 1,
                    VALUE_INTERVAL: 4,
                    VALUE_KEYPOINTS: 2,
                    VALUE_PREVIEW: 1
                }
            );
        }).then(() => {
            this.processVariables();
            this.configToStyle();
            interfaceManager = new InterfaceManager();
            interfaceManager.processInterfaceDisplay();
        });
    };

    /**
     * Process all remaining variables based on config fetched.
     */
    processVariables() {
        var body_rect = $('body')[0].getBoundingClientRect();
        // Window bounds.
        this.windowWidth = body_rect.width;
        this.windowHeight = window.innerHeight;

        // Video resolution ratio.
        let vidRatio = this.videoMetaData.ratio * this.config.COL/ this.config.ROW; //720 / 1280;

        // Interface display values.
        this.CONFIG_INTERVAL = Math.pow(2, this.config.VALUE_INTERVAL);

        // Unused old variable. Delete if no use case.
        // this.mainScreenHeight = (body_rect.width / 2) * vidRatio;

        // Data display values.
        this.CONFIG_IMAGE_HEIGHT = this.config.IMAGE_WIDTH * vidRatio;
        this.CONFIG_CANVAS_HEIGHT = this.CONFIG_IMAGE_HEIGHT + 25;
        this.CONFIG_OFFSET = document.documentElement.clientWidth / 2;
        this.offset = body_rect.width / 2;
        this.jointslist = [
            [15, 17],
            [15, 0],
            [0, 16],
            [16, 18],
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [1, 5],
            [5, 6],
            [6, 7],
            [1, 8],
            [8, 9],
            [8, 12],
            [9, 10],
            [12, 13],
            [10, 11],
            [13, 14],
            [11, 24],
            [14, 21],
            [11, 22],
            [21, 19],
            [22, 23],
            [19, 20]
        ]
        this.videoDuration = 0;
        this.updatePixelPerInterval();
        this.configPreview();
    };
    /**
     * Set config value to specified value in Interface Manager or get specific config value.
     * @param {String} tag Config.
     * @param {number} value New value.
     */
    configs(tag, value = undefined) {
        if (value == undefined) {
            return this.config[tag];
        } else {
            this.config[tag] = value;
            processManager.xhrManager.writeConfig(
                tag,
                value
            )
            return;
        }
    }
    /**
     * Update Value Pixel Per Interval.
     */
    updatePixelPerInterval() {
        this.CONFIG_INTERVAL = Math.pow(2, this.config.VALUE_INTERVAL);
        this.CONFIG_PIXEL_PER_INTERVAL = this.config.IMAGE_WIDTH / this.CONFIG_INTERVAL;
        if (processManager.audioWavesManager != undefined) {
            processManager.audioWavesManager.zoom(this.CONFIG_PIXEL_PER_INTERVAL);
            $('#waveform').css({width: `${this.CONFIG_PIXEL_PER_INTERVAL * $('.video-main')[0].duration}px`});
        }
    };
}

let interfaceManager;
let variableManager = new VariableManager();
let processManager = new ProcessManager();


// Result for BODY_25 (25 body parts consisting of COCO + foot)
// const std::map<unsigned int, std::string> POSE_BODY_25_BODY_PARTS {
//     {0,  "Nose"},
//     {1,  "Neck"},
//     {2,  "RShoulder"},
//     {3,  "RElbow"},
//     {4,  "RWrist"},
//     {5,  "LShoulder"},
//     {6,  "LElbow"},
//     {7,  "LWrist"},
//     {8,  "MidHip"},
//     {9,  "RHip"},
//     {10, "RKnee"},
//     {11, "RAnkle"},
//     {12, "LHip"},
//     {13, "LKnee"},
//     {14, "LAnkle"},
//     {15, "REye"},
//     {16, "LEye"},
//     {17, "REar"},
//     {18, "LEar"},
//     {19, "LBigToe"},
//     {20, "LSmallToe"},
//     {21, "LHeel"},
//     {22, "RBigToe"},
//     {23, "RSmallToe"},
//     {24, "RHeel"},
//     {25, "Background"}
// };


