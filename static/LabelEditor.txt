/**
 * ====================================================================================================
 *                                          LABEL EDITOR VARIABLES 
 * ====================================================================================================
 */
const SNAP_THRESHOLD_PIXEL = 15;
var CURRENT_ANCHORS_
/**
 * ====================================================================================================
 *                                          LABEL LIST FUNCTIONS  
 * ====================================================================================================
 * Label List Highlight Property To On/Off And Scroll
 */
var labelListHighlight = {
    /**
     * Label List Highlight Off
     */
    labelListHighlightOff: function (vManager) {
        var label = document.getElementById(`label-display-${vManager.selectedLabel.id}`);
        if (label === null || label === undefined) return;
        // var label = document.getElementsByClassName(`label-display ${vManager.selectedLabel.id}`)
        label.classList.remove("label-list-highlight-on")
    },
    /**
     * Label List Highlight On
     */
    labelListHighlightOn: function (vManager) {
        // var label = document.getElementsByClassName(`label-display ${vManager.selectedLabel.id}`)
        var label = document.getElementById(`label-display-${vManager.selectedLabel.id}`);
        label.classList.add("label-list-highlight-on")
        this.labelListScrollIntoView(label)
    },
    /**
    * Label List Scroll Into View Highlighted Label.
    */
    labelListScrollIntoView: function (currLabel) {
        currLabel.scrollIntoView({behavior: "smooth", block: "center"});
    }
}

/**
 * ====================================================================================================
 *                                          LABEL EDITOR REACT
 * ====================================================================================================
 * Label Editor Display React Object.
 */

class LabelEditorPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current_anchors: [],
            editing: false,
            end: 0,
            dragStateLeft: {
                dragging: false,
                hover: false,
                height: variableManager.config.LABEL_HEIGHT,
                left: -15,
                top: 0,
                width: 15,
                zindex: 170
            },
            dragStateMiddle: {
                dragging: false,
                hover: false,
                height: variableManager.config.LABEL_HEIGHT,
                left: 0,
                top: 0,
                width: 0,
                zindex: 170
            },
            dragStateRight: {
                dragging: false,
                hover: false,
                height: variableManager.config.LABEL_HEIGHT,
                right: -15,
                top: 0,
                width: 15,
                zindex: 170
            },
            id: '',
            left: 0,
            start: 0,
            top: 0,
            tracktop: -30,
            type: undefined,
            width: 0,
        }
        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.addPanelReact(this);
    }
    /**
     * Return label editor state.
     */
    getState() {
        return this.state;
    }
    /**
     * Readjust track top.
     */
    readjustEditor() {
        let type = interfaceManager.dataDisplayManager.labels.getLabelByID(this.state.id).getType();
        this.setState({
            type: type
        })
        const top = (processManager.colorManager.getTypeOrdering(type) * 10) +
            (interfaceManager.dataDisplayManager.labels.getTotalTiersBefore(type) * variableManager.config.LABEL_HEIGHT) + this.state.top;
        $('.ghost-editor').css('top', top)
    }
    /**
     * Update state when Label is selected.
     * @param {{}} datapos Label data.
     */
    selected({ end, id, left, pageX, start, top, type, width }) {
        //this.state.dragStateMiddle.width = width;
        this.setState({
            dragStateMiddle: {
                dragging: true,
                hover: this.state.dragStateMiddle.hover,
                height: 400,
                left: -150,
                top: -200,
                width: width + 300,
                zindex: 195,
                anchor: {
                    left: left,
                    x: pageX
                }
            },
            editing: true,
            end: end,
            id: id,
            left: left,
            start: start,
            top: top,
            type: type,
            tracktop: (processManager.colorManager.getTypeOrdering(type) * 10) +
                (interfaceManager.dataDisplayManager.labels.getTotalTiersBefore(type) * variableManager.config.LABEL_HEIGHT),
            width: width
        })

        // if label is selected then unselect first
        if (variableManager.selectedLabel !== undefined) {
            labelListHighlight.labelListHighlightOff(variableManager)
        }

        // update variable manager selected label
        variableManager.selectedLabel = interfaceManager.dataDisplayManager.labels.getLabelByID(id);
        variableManager.selectedLabelDiv = $(`#label-react-${id}`);

        // highlight selected label
        labelListHighlight.labelListHighlightOn(variableManager)
    }
    /**
     * Dragstate functions.
     * Left, middle, and right controls.
     */
    /** LEFT FUNCTIONS **/
    leftDown(e) {
        if (e.button != 0) return
        $('.preview-mouse-move').detach().appendTo('.data-display-panel')
        interfaceManager.previewManager.setPosition($('.ghost-container')[0].getBoundingClientRect().x, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'left',
            position: this.state.left,
            width: 0
        })

        const drag_state = this.state.dragStateLeft;
        
        // Get list of current anchors
        var curr_anchors = [];
        $('.anchor-box').each(function() {
            if (this.checked) {
                curr_anchors = curr_anchors.concat(processManager.anchorManager.getAnchorsByID(this.className.split('-')[2]))
            }
        })
        curr_anchors.sort((a, b) => a - b);

        this.setState({
            dragStateLeft: {
                dragging: true,
                hover: drag_state.hover,
                height: 2000,
                left: -1000,
                top: -1000,
                width: 2000,
                zindex: 195,
                anchor: {
                    x: e.pageX,
                    left: this.state.left,
                    width: this.state.width
                }
            },
            dragStateMiddle: {
                dragging: false,
                height: variableManager.config.LABEL_HEIGHT,
                left: 0,
                top: 0,
                width: this.state.width,
                zindex: 170
            },
            dragStateRight: {
                dragging: false,
                height: variableManager.config.LABEL_HEIGHT,
                right: -15,
                top: 0,
                width: 15,
                zindex: 170
            },
            current_anchors: curr_anchors
        });
    }
    leftMove(e) {
        if (!this.state.dragStateLeft.dragging) return
        e.stopPropagation();
        /** If label is being dragged beyond label's end time. */
        if (this.state.dragStateLeft.anchor.width <= e.pageX - this.state.dragStateLeft.anchor.x) {
            this.setState({
                left: this.state.dragStateLeft.anchor.left + this.state.dragStateLeft.anchor.width,
                start: this.state.end,
                width: 0
            })
        } else {
            let newLeft = this.state.dragStateLeft.anchor.left - this.state.dragStateLeft.anchor.x + e.pageX
            var pointer = newLeft
            const ancs = this.state.current_anchors;
            for (let i in ancs) {
                let current_anchor = processManager.processes["ms-to-pixel"](ancs[i]);
                if (Math.abs(current_anchor - pointer) < SNAP_THRESHOLD_PIXEL) {
                    $('.left-line').css({border: "1px dotted red"});
                    newLeft = current_anchor
                    break;
                } else {
                    $('.left-line').css({border: "1px dotted white"});
                }
            }
            this.setState({
                left: newLeft,
                start: processManager.processes['pixel-to-ms'](newLeft),
                width: this.state.dragStateLeft.anchor.width + this.state.dragStateLeft.anchor.x - e.pageX
            })
        }
        interfaceManager.previewManager.setPosition($('.ghost-container')[0].getBoundingClientRect().x, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'left',
            position: this.state.left,
            width: 0
        })
        
       
    }
    leftHover() {
        const drag_state = this.state.dragStateLeft;
        if (!drag_state.dragging)
        {
            drag_state.left = -100;
            drag_state.width = 100;
            drag_state.hover = true;
            this.setState({
                dragStateLeft: drag_state
            })
        }
        else{}
    }
    leftOut() {
        const drag_state = this.state.dragStateLeft;

        if (!drag_state.dragging)
        {
            drag_state.left = -15;
            drag_state.width = 15;
            drag_state.hover = false;
            this.setState({
                dragStateLeft: drag_state
            })
        }
        else{}
    }

    /** MIDDLE FUNCTIONS **/
    middleDown(e) {
        if (e.button != 0) return
        $('.preview-mouse-move').detach().appendTo('.data-display-panel')
        const rect = $('.ghost-container')[0].getBoundingClientRect();
        interfaceManager.previewManager.setPosition(rect.x, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'middle',
            position: this.state.left,
            width: this.state.width
        });
        const drag_state = this.state.dragStateMiddle;

        this.setState({
            dragStateLeft: {
                dragging: false,
                hover: this.state.dragStateLeft.hover,
                height: variableManager.config.LABEL_HEIGHT,
                left: -15,
                top: 0,
                width: 15,
                zindex: 170
            },
            dragStateMiddle: {
                dragging: true,
                height: 2000,
                left: -1000,
                top: -1000,
                width: this.state.width + 2000,
                zindex: 195,
                anchor: {
                    x: e.pageX,
                    left: this.state.left
                }
            },
            dragStateRight: {
                dragging: false,
                hover: this.state.dragStateRight.hover,
                height: variableManager.config.LABEL_HEIGHT,
                right: -15,
                top: 0,
                width: 15,
                zindex: 170
            },
        });
    }
    middleMove(e) {
        if (!this.state.dragStateMiddle.dragging) return
        e.stopPropagation();
        let newLeft = this.state.dragStateMiddle.anchor.left - this.state.dragStateMiddle.anchor.x + e.pageX;
        this.setState({
            left: newLeft,
            start: processManager.processes['pixel-to-ms'](newLeft),
            end: processManager.processes['pixel-to-ms'](newLeft + this.state.width)
        })
        const rect = $('.ghost-container')[0].getBoundingClientRect();
        interfaceManager.previewManager.setPosition(rect.x, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'middle',
            position: this.state.left,
            width: this.state.width
        })
    }

    /** RIGHT FUNCTIONS **/
    rightDown(e) {
        if (e.button != 0) return
        $('.preview-mouse-move').detach().appendTo('.data-display-panel');
        const rect = $('.ghost-container')[0].getBoundingClientRect();
        interfaceManager.previewManager.setPosition(rect.x + rect.width, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'right',
            position: this.state.left,
            width: this.state.width
        })
        const drag_state = this.state.dragStateRight;
                
        // Get list of current anchors
        var curr_anchors = [];
        $('.anchor-box').each(function() {
            if (this.checked) {
                curr_anchors = curr_anchors.concat(processManager.anchorManager.getAnchorsByID(this.className.split('-')[2]))
            }
        })
        curr_anchors.sort((a, b) => a - b);

        this.setState({
            dragStateLeft: {
                dragging: false,
                hover: this.state.dragStateLeft.hover,
                height: variableManager.config.LABEL_HEIGHT,
                left: -15,
                top: 0,
                width: 15,
                zindex: 170
            },
            dragStateMiddle: {
                dragging: false,
                height: variableManager.config.LABEL_HEIGHT,
                left: 0,
                top: 0,
                width: this.state.width,
                zindex: 170                
            },
            dragStateRight: {
                dragging: true,
                hover: this.state.dragStateRight.hover,
                height: 2000,
                top: -1000,
                width: 2000,
                right: -1000,
                zindex: 195,
                anchor: {
                    x: e.pageX,
                    left: this.state.left,
                    width: this.state.width
                }
            },
            current_anchors: curr_anchors
        });
    }
    rightMove(e) {
        if (!this.state.dragStateRight.dragging) return
        e.stopPropagation();
        /** If label is being dragged beyond label's start time. */
        let newWidth = this.state.dragStateRight.anchor.width - this.state.dragStateRight.anchor.x + e.pageX
        if (newWidth <= 0) {
            this.setState({
                end: this.state.start,
                width: 0
            })
        } else {
            var pointer = newWidth
            const ancs = this.state.current_anchors;
            for (let i in ancs) {
                let current_anchor = processManager.processes["ms-to-pixel"](ancs[i]) - this.state.left;
                if (Math.abs(current_anchor - pointer) < SNAP_THRESHOLD_PIXEL) {
                    $('.right-line').css({border: "1px dotted red"});
                    newWidth = current_anchor
                    break;
                } else {
                    $('.right-line').css({border: "1px dotted white"});
                }
            }
            this.setState({
                end: processManager.processes['pixel-to-ms'](this.state.dragStateRight.anchor.left + newWidth),
                width: newWidth
            })
        }
        const rect = $('.ghost-container')[0].getBoundingClientRect();
        interfaceManager.previewManager.setPosition(rect.x + rect.width, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'right',
            position: this.state.left,
            width: this.state.width
        })
    }
    rightHover() {
        const drag_state = this.state.dragStateRight;

        if (!drag_state.dragging)
        {
            drag_state.right = -100;
            drag_state.width = 100;
            drag_state.hover = true;
            this.setState({
                dragStateRight: drag_state
            })
        }
        else{ }
    }
    rightOut() {
        const drag_state = this.state.dragStateRight;

        if (!drag_state.dragging)
        {
            drag_state.right = -15;
            drag_state.width = 15;
            drag_state.hover = false;
            this.setState({
                dragStateRight: drag_state
            })
        }
    }
    /**
     * Process when mouse left click is lifted.
     */
    process() {
        const drag_state_left = this.state.dragStateLeft;
        const drag_state_right = this.state.dragStateRight;
        
        this.setState({
            dragStateLeft: {
                dragging: false,
                hover: drag_state_left.hover, 
                height: variableManager.config.LABEL_HEIGHT,
                left: drag_state_left.hover ? -100 : -15,
                top: 0,
                width: drag_state_left.hover ? 100 : 15
            },
            dragStateRight: {
                dragging: false,
                hover: drag_state_right.hover, 
                height: variableManager.config.LABEL_HEIGHT,
                right: drag_state_right.hover ? -100 : -15,
                top: 0,
                width: drag_state_right.hover ? 100 : 15
            }
        }, () => {
            $('.preview-mouse-move').detach().appendTo('.video-current-info');
            interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.hideEditorLines();
            let newTime = {
                start: processManager.processes['pixel-to-ms'](this.state.left),
                end: processManager.processes['pixel-to-ms'](this.state.left + this.state.width)
            }
            const original_time = interfaceManager.dataDisplayManager.labels.getLabelByID(this.state.id).getTimeMS();
            if (processManager.processes['check-time-change'](original_time, newTime)) {
                processManager.history.addHistory(
                    variableManager.requestCodes.position,
                    {
                        id: this.state.id,
                        oldValue: original_time,
                        newValue: newTime
                    }
                )
                interfaceManager.dataDisplayManager.labels.setLabelNewTime(
                    this.state.id,
                    processManager.processes['pixel-to-ms'](this.state.left),
                    processManager.processes['pixel-to-ms'](this.state.left + this.state.width)
                );
            }
            // interfaceManager.mainScreenManager.dataPanelManager.labelDisplayManager.highlightLabel(this.state.id)
            interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.datapos = {
                left: this.state.left,
                type: this.state.type,
                width: this.state.width
            }
            interfaceManager.dataDisplayManager.updateTimelineHeight();

            let type = interfaceManager.dataDisplayManager.labels.getLabelByID(this.state.id).getType();
            const top = (processManager.colorManager.getTypeOrdering(type) * 10) + 
            (interfaceManager.dataDisplayManager.labels.getTotalTiersBefore(type) *  variableManager.config.LABEL_HEIGHT) +
            (interfaceManager.dataDisplayManager.labels.getLabelTierByID(this.state.id) * variableManager.config.LABEL_HEIGHT);

            this.setState({
                dragStateMiddle: {
                    dragging: false,
                    height: variableManager.config.LABEL_HEIGHT,
                    left: 0,
                    top: 0,
                    width: this.state.width
                },
                top: top 
            })

            $('.ghost-editor').css('top', top)
        })
    }
    /**
     * Shift label and editor by a frame.
     * @param {String} target Start or End.
     * @param {number} direction Backward or Forward.
     */
    shiftLabelByAFrame(target, direction) {
        if (target == 'start') {
            if (direction == 1) {
                if (Math.round(this.state.start + (100 / 3)) >= this.state.end) {
                    this.setState({
                        left: processManager.processes['ms-to-pixel'](this.state.end),
                        start: this.state.end,
                        width: 0
                    })
                } else {
                    this.setState({
                        left: processManager.processes['ms-to-pixel'](this.state.start + (100 / 3)),
                        start: Math.round(this.state.start + (100 / 3)),
                        width: processManager.processes['ms-to-pixel'](this.state.end - this.state.start - 100 / 3)
                    })
                }
                interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
                    line: 'left',
                    position: this.state.left,
                    width: 0
                })
            } else {
                if (Math.round(this.state.start - (100 / 3)) <= 0) {
                    this.setState({
                        left: 0,
                        start: 0,
                        width: processManager.processes['ms-to-pixel'](this.state.end)
                    })
                } else {
                    this.setState({
                        left: processManager.processes['ms-to-pixel'](this.state.start - (100 / 3)),
                        start: Math.round(this.state.start - (100 / 3)),
                        width: processManager.processes['ms-to-pixel'](this.state.end - this.state.start + 100 / 3)
                    })
                }
                interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
                    line: 'left',
                    position: this.state.left,
                    width: 0
                })
            }
            interfaceManager.pinpointFrameManager.setFrames('left');
        } else if (target == 'end') {
            if (direction == 1) {
                if (Math.round(this.state.end + (100 / 3)) >= $('.video-main')[0].duration * 1000) {
                    this.setState({
                        end: $('.video-main')[0].duration * 1000,
                        width: processManager.processes['ms-to-pixel']($('.video-main')[0].duration * 1000 - this.state.start)
                    })
                } else {
                    this.setState({
                        end: Math.round(this.state.end + (100 / 3)),
                        width: processManager.processes['ms-to-pixel'](this.state.end - this.state.start + 100 / 3)
                    })
                }
                interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
                    line: 'right',
                    position: this.state.left,
                    width: this.state.width
                })
            } else {
                if (Math.round(this.state.end - (100 / 3)) <= this.state.start) {
                    this.setState({
                        end: this.state.start,
                        width: 0
                    })
                } else {
                    this.setState({
                        end: Math.round(this.state.end - (100 / 3)),
                        width: processManager.processes['ms-to-pixel'](this.state.end - this.state.start - 100 / 3)
                    })
                }
                interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
                    line: 'right',
                    position: this.state.left,
                    width: this.state.width
                })
            }
            interfaceManager.pinpointFrameManager.setFrames('right');
        } else {
            interfaceManager.notificationManager.show('TODO: MISSING TARGET SHIFT', {type:'error'})
        }
    }
    /**
     * Process label after shfiting,
     */
    processLabelPostShift() {
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.hideEditorLines();
        let newTime = {
            start: processManager.processes['pixel-to-ms'](this.state.left),
            end: processManager.processes['pixel-to-ms'](this.state.left + this.state.width)
        }
        const original_time = interfaceManager.dataDisplayManager.labels.getLabelByID(this.state.id).getTimeMS();
        if (processManager.processes['check-time-change'](original_time, newTime)) {
            processManager.history.addHistory(
                variableManager.requestCodes.position,
                {
                    id: this.state.id,
                    oldValue: original_time,
                    newValue: newTime
                }
            )
            interfaceManager.dataDisplayManager.labels.setLabelNewTime(
                this.state.id,
                processManager.processes['pixel-to-ms'](this.state.left),
                processManager.processes['pixel-to-ms'](this.state.left + this.state.width)
            );
        }
        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.datapos = {
            left: this.state.left,
            type: this.state.type,
            width: this.state.width
        }
    }
    /**
     * Render label editor into label canvas.
     */
    render() {
        return (
            <div className={'ghost-editor'}>
                {this.state.editing &&
                    <div className={'ghost-container'}
                        style={{
                            left: `${this.state.left}px`,
                            width: `${this.state.width}px`
                        }}>
                        <div className={'label-ghost'}
                            style={{
                                height: `${this.state.dragStateMiddle.height}px`,
                                left: `${this.state.dragStateMiddle.left}px`,
                                top: `${this.state.dragStateMiddle.top}px`,
                                width: `${this.state.dragStateMiddle.width}px`,
                                zIndex: `${this.state.dragStateMiddle.zindex}`
                            }}
                            onContextMenu={(e) => {
                                e.stopPropagation();
                                interfaceManager.contextMenuManager.setPosition(
                                    e,
                                    'label',
                                    $('.menu.edit'),
                                    { id: this.state.id, type: this.state.type }
                                )
                            }}
                            onDoubleClick={() => {
                                processManager.processes['play-label'](this.state.start, this.state.end)
                            }}
                            onMouseDown={this.middleDown.bind(this)}
                            onMouseMove={this.middleMove.bind(this)}
                            onMouseUp={this.process.bind(this)} />
                        <div className={'label-ghost left'}
                            style={{
                                height: `${this.state.dragStateLeft.height}px`,
                                left: `${this.state.dragStateLeft.left}px`,
                                top: `${this.state.dragStateLeft.top}px`,
                                width: `${this.state.dragStateLeft.width}px`,
                                zIndex: `${this.state.dragStateLeft.zindex}`
                            }}
                            onMouseOver={this.leftHover.bind(this)}
                            onMouseOut={this.leftOut.bind(this)}
                            onMouseDown={this.leftDown.bind(this)}
                            onMouseMove={this.leftMove.bind(this)}
                            onMouseUp={this.process.bind(this)} />
                        <div>
                            <div className={'time-displayer start labels'}>
                                {processManager.processes['s-to-string-ms'](this.state.start / 1000)}
                            </div>
                            <div className={'left-arrow labels-arrow'} />
                        </div>
                        <div className={'label-ghost right'}
                            style={{
                                height: `${this.state.dragStateRight.height}px`,
                                right: `${this.state.dragStateRight.right}px`,
                                top: `${this.state.dragStateRight.top}px`,
                                width: `${this.state.dragStateRight.width}px`,
                                zIndex: `${this.state.dragStateRight.zindex}`
                            }}
                            onMouseOver={this.rightHover.bind(this)}
                            onMouseOut={this.rightOut.bind(this)}
                            onMouseDown={this.rightDown.bind(this)}
                            onMouseMove={this.rightMove.bind(this)}
                            onMouseUp={this.process.bind(this)} />
                        <div>
                            <div className={'time-displayer end labels'}>
                                {processManager.processes['s-to-string-ms'](this.state.end / 1000)}
                            </div>
                            <div className={'right-arrow labels-arrow'} />
                        </div>
                        <div className={`label-replica type-${this.state.type} labels`}
                            style={{
                                //top: this.state.top,
                                width: `${this.state.width}px`
                            }} />
                    </div>
                }
            </div>
        );
    }
};


/**
 * ====================================================================================================
 *                                          LABEL EDITOR mANAGER
 * ====================================================================================================
 * Manager for label editor.
 */
class LabelEditorManager {
    /**
     * Constructor.
     */
    constructor() {
        this.labelEditorReact = undefined;
        this.datapos = {
            left: 0,
            type: 0,
            width: 0
        };
    }
    /**
     * Add react object.
     * @param {React.Component} reactObject React object.
     */
    addPanelReact(reactObject) {
        this.labelEditorReact = reactObject;
    }
    /**
     * Readjust Editor track top position.
     */
    readjustEditor() {
        this.labelEditorReact.readjustEditor();
    }
    /**
     * Process label after shifting.
     */
    processLabelPostShift() {
        this.labelEditorReact.processLabelPostShift();
    }
    /**
     * Return label editor state.
     */
    getState() {
        return this.labelEditorReact.getState();
    }
    /**
     * Label is selected.
     * @param {{}} datapos Label data.
     */
    selected(datapos) {
        this.datapos.left = datapos.left
        this.datapos.type = datapos.type
        this.datapos.width = datapos.width;
        this.labelEditorReact.selected(datapos);
    }
    /**
     * Shift label and editor by a frame.
     * @param {String} target Start or End.
     * @param {number} direction Backward or Forward.
     */
    shiftLabelByAFrame(target, direction) {
        this.labelEditorReact.shiftLabelByAFrame(target, direction);
    }
    /**
     * Set all editor to be inactive.
     */
    setInactive() {
        this.labelEditorReact.setState({
            editing: false
        })
        // interfaceManager.mainScreenManager.dataPanelManager.labelDisplayManager.unHighlightLabel();
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.hideEditorLines();
        // Remove highlight from label list
        if (variableManager.selectedLabel !== undefined) {
            labelListHighlight.labelListHighlightOff(variableManager)
        }
        variableManager.selectedLabel = undefined;
        variableManager.selectedLabelDiv = undefined;
    }
}