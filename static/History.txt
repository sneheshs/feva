/**
 * History object containing history of current dataset.
 */
class History {
    /**
     * Constructor.
     */
    constructor() {
        this.historyList = [];
        this.position = -1;
        this.changedData = new Set();
    }
    /**
     * Trim history beyond current position.
     */
    trimHistory() {
        this.historyList = this.historyList.slice(0, this.position + 1);
    }
    copyHistory() {
        let copy = [];
        for (let i = 0; i < this.historyList.length; i++) {
            copy.push(this.historyList[i]);
        }
        return copy;
    }
    /**
     * Convert button post changes.
     */
    convertButtonPostAddition() {
        $('.undo').prop('disabled', false);
        $('.redo').prop('disabled', true);
    }
    /**
     * Add into history list.
     * @param {number} request Request number.
     * @param {List} data List containing changes.
     */
    addHistory(request, data) {
        if (this.historyList.length - 1 > this.position) {
            this.trimHistory();
        }
        this.changedData.add(data.id);
        this.historyList.push({
            request: request,
            data: data
        })
        this.convertButtonPostAddition();
        this.position++;
    }
    /**
     * Reset history list.
     */
    resetHistoryList() {
        this.historyList = [];
        this.position = -1;
        
        //Handle changed data on reset
        this.changedData.clear()
    }
    redo() {
        if (this.position < this.historyList.length - 1) {
            let changes = this.historyList[this.position + 1];
            this.doChanges(changes, 'redo');
            
            //Handle changed data on redo
            this.changedData.add(changes.data.id);

            this.position++;
            $('.undo').prop('disabled', false);
            if (this.position >= this.historyList.length - 1) {
                $('.redo').prop('disabled', true);
            }
        }
    }
    undo() {
        if (this.position >= 0) {
            let changes = this.historyList[this.position];
            this.doChanges(changes, 'undo');
            
            //Handle changed data on undo
            this.changedData.add(changes.data.id);

            this.position--;
            $('.redo').prop('disabled', false);
            if (this.position < 0) {
                $('.undo').prop('disabled', true);
            }
        }
    }
    doChanges(changes, type) {
        if (changes.request === variableManager.requestCodes.text) {
            if (type == 'undo') {
                interfaceManager.dataDisplayManager.labels.setLabelsNameByID(changes.data.id, changes.data.oldValue)
            } else {
                interfaceManager.dataDisplayManager.labels.setLabelsNameByID(changes.data.id, changes.data.newValue)
            }
        } else if (changes.request === variableManager.requestCodes.type) {
            if (type == 'undo') {
                interfaceManager.dataDisplayManager.labels.setLabelsTypeByID(changes.data.id, changes.data.oldValue)
            } else {
                interfaceManager.dataDisplayManager.labels.setLabelsTypeByID(changes.data.id, changes.data.newValue)
            }
            interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.oldValue);
            interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.newValue);
        } else if (changes.request === variableManager.requestCodes.position) {
            if (type == 'undo') {
                interfaceManager.dataDisplayManager.labels.setLabelsTimeByID(changes.data.id, changes.data.oldValue)
            } else {
                interfaceManager.dataDisplayManager.labels.setLabelsTimeByID(changes.data.id, changes.data.newValue)
            }
            interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
        } else if (changes.request === variableManager.requestCodes.add) {
            if (changes.data.oldValue) {
                if (type == 'undo') {
                    interfaceManager.dataDisplayManager.labels.restoreLabelByID(changes.data.oldValue.getID())
                } else {
                    interfaceManager.dataDisplayManager.labels.deleteLabelByID(changes.data.oldValue.getID())
                }
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.oldValue.getType());
            } else {
                if (type == 'undo') {
                    interfaceManager.dataDisplayManager.labels.deleteLabelByID(changes.data.newValue.getID())
                } else {
                    interfaceManager.dataDisplayManager.labels.restoreLabelByID(changes.data.newValue.getID())
                }
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.newValue.getType());
            }
            interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
            interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
            interfaceManager.dataDisplayManager.updateTimelineHeight();
        } else if (changes.request === variableManager.requestCodes.cut) {
            if (type == 'undo') {
                interfaceManager.dataDisplayManager.labels.setLabelsTypeByID(changes.data.id, changes.data.oldValue.type);
                interfaceManager.dataDisplayManager.labels.setLabelsTimeByID(changes.data.id, changes.data.oldValue.position);
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.oldValue.type);
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.newValue.type);
                interfaceManager.contextMenuManager.clipboard.addLabel(changes.data.id, interfaceManager.contextMenuManager.clipboard.TYPES.CUT);
                interfaceManager.contextMenuManager.updateMenu();
            } else {
                interfaceManager.dataDisplayManager.labels.setLabelsTypeByID(changes.data.id, changes.data.newValue.type);
                interfaceManager.dataDisplayManager.labels.setLabelsTimeByID(changes.data.id, changes.data.newValue.position);
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.oldValue.type);
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(changes.data.newValue.type);
            }

            interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
            interfaceManager.dataDisplayManager.updateTimelineHeight();
        }
    }
}
