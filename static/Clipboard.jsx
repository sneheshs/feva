/**
 * Clipboard object contains all the cut/copied labels
 */
class Clipboard {
    /**
     * Constructor
     */
    constructor() {
        this.labelIDs = [];
        this.clipboardType = [];
        this.TYPES = {
            COPY: 0,
            CUT: 1
        }
        this.max = 10;
    }


    addLabel(id, type) {
        // check for duplicates
        let index = this.labelIDs.indexOf(id);
        
        // if label has been cut or copied before
        if (index != -1) {
            if (this.clipboardType[index] == type) {
                this.removeLabelByID(id);
                type == this.TYPES.COPY ? this.removeCopyLabelByID(id): this.removeCutLabelByID(id);

                return;
            }

            this.clipboardType[index] = type;
            if (type == this.TYPES.CUT) {
                // change from copy to cut
                this.removeCopyLabelByID(id);  
                this.setCutLabelByID(id);
            } else {
                // change from cut to copy
                this.removeCutLabelByID(id);
                this.setCopyLabelByID(id);
            }
          
            return;
        }

        // removing last element from clipboard
        if (this.labelIDs.length >= this.max) {
            const id = this.labelIDs.pop();
            const type = this.clipboardType.pop();
            type == this.TYPES.CUT ? this.removeCutLabelByID(id) : this.removeCopyLabelByID(id);
        }

        if (type == this.TYPES.CUT) {
            this.setCutLabelByID(id);
        } else { 
            this.setCopyLabelByID(id);
        }

        // adding label id to beginning of clipboard
        this.labelIDs.unshift(id);
        this.clipboardType.unshift(type);
    }

    setMax(max) {
        this.max = max;
    }
    setCopyLabelByID(id) {
        $(`#label-react-${id}`)[0].classList.add("copy-label");
    }
    setCutLabelByID(id) {
        $(`#label-react-${id}`)[0].classList.add("cut-label");
        $(`#label-react-${id}`)[0].classList.add("dim-label");
    }
    removeCutLabelByID(id) {
        $(`#label-react-${id}`)[0].classList.remove("cut-label");
        $(`#label-react-${id}`)[0].classList.remove("dim-label");
        $(`#label-react-${id}`)[0].classList.remove('label-highlight');
    }
    removeCopyLabelByID(id) {
        $(`#label-react-${id}`)[0].classList.remove("copy-label");
    }

    getTypeByID(id) {
        const index = this.labelIDs.indexOf(id);
        return this.clipboardType[index];
    }

    generatePasteLabel(start, track, label) {
        // label is being cut
        if (this.getTypeByID(label.getID()) == 1) {
            const prevTrack = label.getType();

            this.removeLabelByID(label.id);
            
            processManager.history.addHistory(
                variableManager.requestCodes.cut,
                {
                    id: label.getID(),
                    oldValue: {type: prevTrack, position: {start: label.getStartTimeMS(), end: label.getEndTimeMS()}},
                    newValue: {type: track, position: {start: start, end: start + (label.end-label.start)}}
                }
            )
            interfaceManager.dataDisplayManager.labels.setLabelsTypeByID(label.getID(), track);
            interfaceManager.dataDisplayManager.labels.setLabelsTimeByID(label.getID(), {start:start, end: start + (label.end-label.start)});
            interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(prevTrack);
        } else {
            const id = processManager.processes['uuidv4']();
            const newLabel = new Label(id, label.text, track, start, start + (label.end-label.start));
            
            $(`#label-react-${label.id}`)[0].classList.remove('label-highlight');

            processManager.history.addHistory(
                variableManager.requestCodes.add,
                {
                    id: id,
                    oldValue: undefined,
                    newValue: newLabel
                }
            )
            interfaceManager.dataDisplayManager.labels.addLabel(newLabel);
        }
        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
        interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(track);
        interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
        interfaceManager.dataDisplayManager.updateTimelineHeight();
    }

    removeLabelByID(id) {
        const index = this.labelIDs.indexOf(id);

        if (index == -1) {
            return;
        }

        // remove label by index
        const type = this.clipboardType.splice(index, 1);
        this.labelIDs.splice(index, 1);
        
        type == this.TYPES.CUT ? this.removeCutLabelByID(id) : this.removeCopyLabelByID(id);
    }

    clear() {
        const len = this.labelIDs.length;
        for (let i=0; i< len; i++) {
            this.removeLabelByID(this.labelIDs[0]);
        }
        this.clipboardType = [];
    }
}