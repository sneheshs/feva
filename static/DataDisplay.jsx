/**
 * ====================================================================================================
 *                                          DATA DISPLAY REACT
 * ====================================================================================================
 * Data Display React Object.
 */
class DataDisplayReact extends React.Component {
    constructor(props) {
        super(props);
        processManager.intervalManager.addInterval('label');
    }
    /**
     * Render Main screen display.
     */
    render() {
        return (
            <div className={'data-display-panel'}>
                <div className={'timeline-panel'}
                    onContextMenu={(e) => {
                        interfaceManager.contextMenuManager.setPosition(
                            e,
                            'canvas',
                            $('.menu.add'),
                            {}
                        )
                    }}>
                    <div key={'top'} className={'top-arrow'} />
                    <div key={'bottom'} className={'bottom-arrow'} />
                </div>
                <EditorPanel />
                <GhostPanelReact />
                <div className={'frame-canvas-container'} />
                <LabelsPanelReact />
                <SpeedLabelsPanelReact />
            </div>
        );
    }
};

/**
 * ====================================================================================================
 *                                  DATA DISPLAY JAVASCRIPT OBJECTS
 * ====================================================================================================
 * Label data structures.
 */
class Labels {
    /**
     * Constructor.
     */
    constructor() {
        this.labelsByTypes = {};
        this.labelsByTiers = {};
        this.labelsByTime = [];
        this.labelsByIDs = {};
        this.labelsReactObjects = {};
    }
    /**
     * Initialize dataset colors.
     * @param {{}} colors Color list.
     */
    initializeDataTypes(colors) {
        let types = Object.keys(colors);
        for (let i = 0; i < types.length; i++) {
            this.labelsByTypes[types[i]] = {};
            this.labelsByTiers[types[i]] = { 0: [] };
        }
    }
    /**
     * Label List Highlight On After Moving/Resize.
     */
    labelListHighlightOn(id) {
        variableManager.selectedLabel = interfaceManager.dataDisplayManager.labels.getLabelByID(id);
        // Fix for #224
        //variableManager.selectedLabelDiv = $(`#label-display-${id}`);
        var label = document.getElementById(`label-display-${variableManager.selectedLabel.id}`);
        label.classList.add("label-list-highlight-on")
        this.labelListScrollIntoView(label)
    }
    /**
     * Label List Scroll Into View Highlighted Label.
     */
    labelListScrollIntoView(currLabel) {
        currLabel.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    /**
     * Add label into the data structures.
     * @param {Label} label Label.
     */
    addLabel(label) {
        this.labelsByIDs[label.getID()] = label;
        this.labelsByTypes[label.getType()][label.getID()] = label;
        let p = 0;
        for (let i = 0; i < this.labelsByTime.length; i++) {
            let currentLabel = this.labelsByTime[i];
            if (label.compareTo(currentLabel) == 1) {
                p++;
            } else {
                break;
            }
        }
        this.labelsByTime.splice(p, 0, label);
        this.sortLabelByTiers();
    }
    /**
     * Add label react object.
     * @param {String} id Label ID.
     * @param {React.Component} reactObject Label react object.
     */
    addReactLabel(id, reactObject) {
        this.labelsReactObjects[id] = reactObject;
    }
    /**
     * Add new type.
     * @param {number} type Label Type.
     */
    addColorType(type) {
        this.labelsByTypes[type] = {};
        this.labelsByTiers[type] = { 0: [] };
    }
    /**
     * Copy label data.
     */
    copyDeepLabel(id) {
        const org = this.labelsByIDs[id];
        return org ? new Label(org.getID(), org.getText(), org.getType(), org.getStartTimeMS(), org.getEndTimeMS(), org.isDeleted()) : undefined;
    }
    /**
     * Delete label by ID.
     * @param {String} id Label's ID.
     */
    deleteLabelByID(id) {
        if (this.labelsByIDs[id]) {
            this.labelsByIDs[id].delete();
            this.labelsReactObjects[id].setState({
                del: true
            })
            this.sortLabelByTiers();
            interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(this.labelsByIDs[id].getType());
            interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
        }
    }
    /**
     * Delete all labels by type.
     * @param {number} type Label's type.
     */
    deleteLabelsByType(type) {
        for (let label in this.labelsByIDs) {
            if (this.labelsByIDs[label].getType() == type) {
                this.labelsByIDs[label].delete();
            }
        }
        delete this.labelsByTypes[type];
        delete this.labelsByTiers[type];
        let newLabels = [];
        for (let i = 0; i < this.labelsByTime.length; i++) {
            if (this.labelsByTime[i].getType(type) != type) {
                newLabels.push(this.labelsByTime[i]);
            }
        }
        this.labelsByTime = newLabels;
        for (let label in this.labelsReactObjects) {
            this.labelsReactObjects[label].setState({
                del: true
            })
        }
        interfaceManager.dataDisplayManager.labelPanelManager.updateCanvas();
        interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
    }
    /**
     * Get all labels by IDs.
     */
    getAllLabelIDs() {
        return Object.keys(this.labelsByIDs);
    }
    /**
     * Get label by ID.
     * @param {String} id Label ID.
     */
    getLabelByID(id) {
        return this.labelsByIDs[id];
    }
    /**
     * Get label tier by ID.
     * @param {String} id Label ID.
     */
    getLabelTierByID(id) {
        if (this.labelsByIDs[id] != undefined) {
            for (let i in this.labelsByTiers[this.labelsByIDs[id].getType()]) {
                let currTiers = this.labelsByTiers[this.labelsByIDs[id].getType()][i];
                if (currTiers.includes(this.labelsByIDs[id])) return i
            }
            return -1;
        }
    }
    /**
     * Get labels by tiers as specified by type.
     * @param {number} type Label type.
     */
    getLabelByTiers(type) {
        return this.labelsByTiers[type];
    }
    /**
     * Get all labels sorted by time.
     */
    getLabelsByTime() {
        return this.labelsByTime;
    }
    /**
     * Get total height.
     */
    getTotalTiers() {
        let total = 0;
        for (let i in this.labelsByTiers) {
            total += Object.keys(this.labelsByTiers[i]).length;
        }
        return total;
    }
    /**
     * 
     * @param {number} type Type before.
     */
    getTotalTiersBefore(type) {
        let total = 0;
        for (let i in this.labelsByTiers) {
            if (processManager.colorManager.getTypeOrdering(i) < processManager.colorManager.getTypeOrdering(type)) {
                total += Object.keys(this.labelsByTiers[i]).length;
            }
        }
        return total;
    }
    /**
     * Readjust all display width.
     */
    readjustLabelWidth() {
        for (let i in this.labelsReactObjects) {
            this.labelsReactObjects[i].readjustDisplay();
            this.labelsReactObjects[i].setState({});
        }
    }
    /**
     * Restore label by ID.
     * @param {String} id Label's ID.
     */
    restoreLabelByID(id) {
        if (this.labelsByIDs[id]) {
            this.labelsByIDs[id].restore();
            this.sortLabelByTiers();
            interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(this.labelsByIDs[id].getType());

            this.labelsReactObjects[id].setState({
                del: false
            })

            interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
        }
    }
    /**
     * Set label new text by ID.
     * @param {String} id Label's ID.
     * @param {String} newText Label's new text.
     */
    setLabelsNameByID(id, newText) {
        this.labelsByIDs[id].setText(newText);
        this.labelsReactObjects[id].setState({
            text: newText
        })
        $(`#label-display-${id}`)[0].innerText = newText;

        // $(`.${id}.label-display`)[0].innerText = newText;
    }
    /**
     * Set label new text by ID.
     * @param {String} id Label's ID.
     * @param {number} newType Label's new type.
     */
    setLabelsTypeByID(id, newType) {
        let label = this.labelsByTypes[this.labelsByIDs[id].getType()][id]
        this.labelsByTypes[newType][id] = label;
        delete this.labelsByTypes[this.labelsByIDs[id].getType()][id]
        this.labelsByIDs[id].setType(newType);
        this.labelsReactObjects[id].setState({
            type: newType
        })
        interfaceManager.mainScreenManager.dataPanelManager.updateType(id, newType);
        this.sortLabelByTiers();
    }
    /**
     * Set label's new time by ID.
     * @param {String} id Label's ID.
     * @param {{}} newTime Label's new time.
     */
    setLabelsTimeByID(id, newTime) {
        this.labelsByIDs[id].setNewTime(newTime.start, newTime.end);
        this.labelsReactObjects[id].setState({
            start: newTime.start,
            end: newTime.end
        })
        this.setLabelNewTime(id, newTime.start, newTime.end);
    }
    /**
     * Set label's new time and id.
     * @param {String} id Label ID.
     * @param {number} start Label new start time.
     * @param {number} end Label new end time.
     */
    setLabelNewTime(id, start, end) {
        this.labelsByIDs[id].setNewTime(start, end);
        this.labelsByTime.sort(function (a, b) {
            let st1 = a.getStartTimeMS();
            let st2 = b.getStartTimeMS();
            return st1 > st2 ? 1 : st1 < st2 ? -1 : 0;
        });
        this.sortLabelByTiers();
        interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(this.labelsByIDs[id].getType());
        interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();

        // Highlight label after label list updated
        this.labelListHighlightOn(id)
    }
    /**
     * Re-sort labels by tiers.
     */
    sortLabelByTiers() {
        for (let type in this.labelsByTiers) {
            this.labelsByTiers[type] = { 0: [] };
        }
        for (let item in this.labelsByTime) {
            let curr = this.labelsByTime[item];
            if (!curr.isDeleted()) {
                let currentTier = 0;
                let currentList = this.labelsByTiers[curr.getType()];
                let lastLabel = processManager.processes['last-element'](currentList[currentTier]);
                while (curr.checkOverlap(lastLabel)) {
                    currentTier++;
                    if (!currentList.hasOwnProperty(currentTier)) {
                        currentList[currentTier] = [];
                    }
                    lastLabel = processManager.processes['last-element'](currentList[currentTier])
                    if (currentTier >= 50) {
                        interfaceManager.notificationManager.show("LABEL_LEVEL_THRESHOLD EXCEEDED... , BREAKING OUT LOOP", {type:'warning'});
                        break;
                    }
                }
                currentList[currentTier].push(curr);
            }
        }
    }
    /**
     * Reset label data structures content.
     */
    reset() {
        this.labelsByTypes = {};
        this.labelsByTiers = {};
        this.labelsByTime = [];
        this.labelsByIDs = {};
        this.labelsReactObjects = {};
    }
    getAllLabelsByType() {
        return this.labelsByTypes;
    }
}

/**
 * Label object.
 */
class Label {
    /**
     * Label constructor
     * @param {string} id Label unique ID
     * @param {string} text Label text
     * @param {string} type Speech, Action, Emotion, Event
     * @param {number} start Label start time
     * @param {number} end Label end time
     */
    constructor(id, text, type, start, end, deleted = false) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.start = start;
        this.end = end;
        this.deleted = deleted;
    }
    /**
     * Getters
     */
    getID() {
        return this.id;
    }
    getText() {
        return this.text;
    }
    getType() {
        return this.type;
    }
    getStartTimeMS() {
        return this.start;
    }
    getEndTimeMS() {
        return this.end;
    }
    getTimeMS() {
        return {
            start: this.start,
            end: this.end
        }
    }
    getStartTimeS() {
        return this.start / 1000;
    }
    getEndTimeS() {
        return this.end / 1000;
    }
    /**
     * Setters
     */
    setID(id) {
        this.id = id;
    }
    setText(text) {
        this.text = text;
    }
    setType(type) {
        this.type = type;
    }
    setStartTime(start) {
        this.start = Math.round(start);
    }
    setEndTime(end) {
        this.end = Math.round(end);
    }
    setNewTime(start, end) {
        this.start = Math.round(start);
        this.end = Math.round(end);
    }
    /**
     * Is deleted
     */
    isDeleted() {
        return this.deleted;
    }
    /**
     * Delete this label
     */
    delete() {
        this.deleted = true;
    }
    /**
     * Restore the label.
     */
    restore() {
        this.deleted = false;
    }
    /**
     * Compare to.
     */
    compareTo(label) {
        if (this.getStartTimeMS() > label.getStartTimeMS()) {
            return 1;
        } else if (this.getStartTimeMS() < label.getStartTimeMS()) {
            return -1;
        } else {
            return 0;
        }
    }
    /**
     * Check if this label overlaps with the other.
     * @param {Label} other Other label.
     */
    checkOverlap(other) {
        if (other == undefined) return false;
        let st1 = this.getStartTimeMS();
        let st2 = other.getStartTimeMS();
        let et1 = this.getEndTimeMS();
        let et2 = other.getEndTimeMS();
        if (st1 <= st2 && st2 <= et1) {
            return true;
        } else if (st2 <= st1 && st1 <= et2) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * ====================================================================================================
 *                                          DATA DISPLAY MANAGER
 * ====================================================================================================
 * Manager for data display.
 */
class DataDisplayManager {
    /**
     * Constructor
     */
    constructor() {
        this.ghostPanelManager = new GhostPanelManager();
        this.canvas_length = 6000;
        this.lastcanvas = Math.ceil(variableManager.CONFIG_OFFSET);
        this.labelPanelManager = new LabelPanelManager();
        this.speedLabelPanelManager = new SpeedLabelsPanelManager();
        this.labels = new Labels();
    }
    updateTimelineHeight() {
        $('.timeline-panel').css('height', variableManager.CONFIG_CANVAS_HEIGHT + parseInt($('.labels-panel').css('height')))
    }
    /**
        * Draw ruler.
        */
    drawRuler() {
        let children = document.querySelectorAll('.frame-canvas');
        let t = 0;
        for (let i = 0; i < children.length; i++) {
            var curr = children[i].getContext('2d');
            curr.beginPath();
            for (let j = 0; j < children[i].width; j += variableManager.config.IMAGE_WIDTH) {
                if (t > $('.video-main')[0].duration) break;
                curr.strokeStyle = "#999999";
                curr.lineWidth = 1;
                curr.font = `${variableManager.config.FONT_SIZE}px ${variableManager.config.FONT_FAMILY}`;
                curr.fillStyle = "white";
                curr.fillText(processManager.processes['s-to-string-ms'](t), j + 3, 17);
                curr.moveTo(j + 0.5, 0);
                curr.lineTo(j + 0.5, 25);
                t += variableManager.CONFIG_INTERVAL;
            }
            curr.stroke();
        }
    }
    /**
     * Redraw ruler.
     */
    redrawRuler() {
        this.clearAllImages();
        this.drawRuler();
    }

    /**
     * Clear all images in the canvas.
     */
    clearAllImages() {
        let canvasses = document.querySelectorAll('.frame-canvas');
        for (let i = 0; i < canvasses.length; i++) {
            canvasses[i].getContext('2d').clearRect(0, 0, canvasses[i].width, canvasses[i].height);
        }
    }
    clearRuler() {
        let canvasses = document.querySelectorAll('.frame-canvas');
        for (let i = 0; i < canvasses.length; i++) {
            canvasses[i].getContext('2d').clearRect(0, 0, canvasses[i].width, 25);
        }
    }

    /**
     * Set new canvas number.
     */
    setCanvasNumber() {
        $('.frame-canvas-container')[0].innerHTML = '';
        let num = Math.ceil((
            $('.video-main')[0].duration
            + (document.documentElement.clientWidth / variableManager.CONFIG_PIXEL_PER_INTERVAL)
        ) / (60 * variableManager.CONFIG_INTERVAL))
        let canvasses = [];
        canvasses.push(`<div class='padder frame' />`)
        for (let i = 0; i < num; i++) {
            let width;
            if (i == num - 1) {
                width = this.lastcanvas;
            } else {
                width = this.canvas_length;
            }
            let item =
                `<canvas class="canvas_${i} frame-canvas" height="${variableManager.CONFIG_CANVAS_HEIGHT}px" width="${width}px" />`
            canvasses.push(item);
        }
        canvasses.push(`<div class='padder frame' />`)
        $('.frame-canvas-container').append(canvasses);
    }


    /**
     * Set last canvas width.
     */
    setLastCanvas() {
        this.lastcanvas = Math.ceil(
            ($('.video-main')[0].duration %
                (this.canvas_length / variableManager.CONFIG_PIXEL_PER_INTERVAL)) *
            variableManager.CONFIG_PIXEL_PER_INTERVAL
        )
    }

    /**
     * Add new color type to display.
     * @param {number} type New type.
     */
    addNewColor(type) {
        this.labels.addColorType(type);
        this.labelPanelManager.updateDisplayLabelPanel();
        this.updateTimelineHeight();
    }
    /**
     * Reset data as new project loads.
     */
    reset() {
        this.labels.reset();
        this.labelPanelManager.reset();
        // this.clearAllImages();
    }
    /**
     * Update data display post interval changes.
     */




    simulateClick(element, event) {
        element.dispatchEvent(
            new MouseEvent(event, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            })
        )
    }

  updateDataDisplay() {

        this.setCanvasNumber();
        this.redrawRuler();
        
        var prevId = '';

        // Deactivate any selected labels before updating width
        if (variableManager.selectedLabel != undefined) {
            prevId = variableManager.selectedLabel.getID()
            //this.labelPanelManager.labelEditorManager.setInactive();
        }

        this.labelPanelManager.labelCanvasManager.updateWidth();
        this.labels.readjustLabelWidth();
        
        $('.data-display-panel')[0].scrollLeft = $('.video-main')[0].currentTime * variableManager.CONFIG_PIXEL_PER_INTERVAL;
        $('.labels-panel')[0].style.width = `${((variableManager.config.IMAGE_WIDTH / variableManager.CONFIG_INTERVAL) * $('.video-main')[0].duration) + variableManager.paddingResize}px`

        if (prevId != '') {
            // //Reselect previously selected label
            variableManager.selectedLabel = interfaceManager.dataDisplayManager.labels.getLabelByID(prevId);
            variableManager.selectedLabelDiv = $(`#label-react-${prevId}`);
            
            //Simulate select on label
            var element = document.querySelector(`#label-react-${prevId}`)
            var ghost = document.querySelector('.label-ghost');
            this.simulateClick(element, 'mousedown')
            this.simulateClick(ghost, 'mouseup')
        }
    }
    // updateDataDisplay() {

    //     this.setCanvasNumber();
    //     this.redrawRuler();

    //     // Deactivate any selected labels before updating width

    //     var prevId = variableManager.selectedLabel.getID()
    //     this.labelPanelManager.labelEditorManager.setInactive();

    //     this.labelPanelManager.labelCanvasManager.updateWidth();

    //     this.labels.readjustLabelWidth();

    //     //Reselect previously selected label
    //     variableManager.selectedLabel = interfaceManager.dataDisplayManager.labels.getLabelByID(prevId);
    //     variableManager.selectedLabelDiv = $(`#label-display-${prevId}`);

    //     //Simulate select on label
    //     var element = document.querySelector(`#label-react-${prevId}`)
    //     var ghost = document.querySelector('.label-ghost');
    //     this.simulateClick(element, 'mousedown')
    //     this.simulateClick(ghost, 'mouseup')



    //     $('.data-display-panel')[0].scrollLeft = $('.video-main')[0].currentTime * variableManager.CONFIG_PIXEL_PER_INTERVAL;
    //     $('.labels-panel')[0].style.width = `${((variableManager.config.IMAGE_WIDTH / variableManager.CONFIG_INTERVAL) * $('.video-main')[0].duration) + variableManager.paddingResize}px`


    // }
    /**
     * Update display post generator video fetches.
     */
    updateDisplayGen() {
        $('.ghost-panel').css('width', ($('.video-generator')[0].duration * variableManager.CONFIG_PIXEL_PER_INTERVAL) + (variableManager.offset))
        $('.ghost-panel').css('height', variableManager.config.IMAGE_WIDTH * (variableManager.videoMetaData.ratio * variableManager.config.COL/ variableManager.config.ROW) + 25 + 'px')
    }
    /**
     * Update display post main video fetches.
     */
    updateDisplayMain() {
        this.setLastCanvas();
        this.setCanvasNumber();
        this.redrawRuler();
        $('.data-display-panel')[0].scrollLeft = 0;
    }
    /**
     * Render data display react object.
     */
    render() {
        ReactDOM.render(
            <DataDisplayReact />,
            $('.root-data-display')[0]
        )
        interfaceManager.dataDisplayManager.labelPanelManager.trackCreatorManager.initializeIRO();
    }
}
