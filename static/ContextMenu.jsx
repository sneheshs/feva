
/**
 * ====================================================================================================
 *                                      CONTEXTMENU REACT
 * ====================================================================================================
 * Context Menu React Object.
 */
class ContextMenuReact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: processManager.colorManager,
            clipboard: interfaceManager.contextMenuManager.clipboard
        }
        interfaceManager.contextMenuManager.addReact(this.props.type, this)
    }
    updateClipboardReact() {
        this.setState({
            clipboard: interfaceManager.contextMenuManager.clipboard
        })
    }
    /**
     * Update when dataset changes and color box changes.
     */
    updateMenuReact() {
        this.setState({
            colors: processManager.colorManager
        })
    }
    /**
     * Render context menu hidden in background.
     */
    render() {
        const ctxmenu = [];
        const labelMenu  = [];
 
        for (const id of this.state.clipboard.labelIDs) {
            // const type = this.state.clipboard.getTypeByID(id) ? "&#9988" : "&#10066";
            const currLabel = interfaceManager.dataDisplayManager.labels.getLabelByID(id);
            const colors = processManager.colorManager.getRGBByType(currLabel.getType());
            let ghostLabel;
            labelMenu.push(<li key={id} id={id} className={'menu-option label-option'} 
                style={{backgroundColor: `rgba(${colors["red"]}, ${colors["green"]}, ${colors["blue"]}, 1.0)`,
                        color: 'white'}}
                onClick={()=> {
                    interfaceManager.contextMenuManager.menu['unpreview-label'](ghostLabel);
                    interfaceManager.contextMenuManager.menu['paste-label'](processManager.selectedTrackType, currLabel);
                }}
                onMouseEnter={() => {
                    //TODO: show preview
                    if (this.state.clipboard.getTypeByID(id) == this.state.clipboard.TYPES.CUT) {
                        $(`#label-react-${id}`)[0].classList.remove("dim-label");
                    }
                    $(`#label-react-${id}`)[0].classList.add('label-highlight');
                    ghostLabel = interfaceManager.contextMenuManager.menu['preview-label'](processManager.selectedTrackType, currLabel);
                    // $(`#label-react-${newLabel.getID()}`)[0].classList.add('ghost-label');
                }}

                onMouseLeave={() => {
                    $(`#label-react-${id}`)[0].classList.remove('label-highlight');
                    if (this.state.clipboard.getTypeByID(id) == this.state.clipboard.TYPES.CUT) {
                        $(`#label-react-${id}`)[0].classList.add("dim-label");
                    }
                    interfaceManager.contextMenuManager.menu['unpreview-label'](ghostLabel);
                }}
                >
                {currLabel.getText()}
                
            </li>);
        }

        if (this.props.type == 'edit') {
            ctxmenu.push(<div className={'checkmark'} key={'checkmark'}>&#10004;</div>);
            ctxmenu.push(<li key={'edit-text'} className={"menu-option"}
                onClick={() => { interfaceManager.contextMenuManager.menu['edit-label']('text'); }}>
                {'Edit Text'}
            </li>
            );
            ctxmenu.push(<hr key={'hr-line-1'} style={{ margin: '5px', padding: '0px' }} />);
            let types = this.state.colors.getListOfTypes();
            for (let obj in types) {
                let type = types[obj];
                ctxmenu.push(<li key={type.toString()} className={"menu-option"}
                    onMouseEnter={() => { interfaceManager.contextMenuManager.menu['preview-type'](type); }}
                    onMouseOut={() => {
                        if (variableManager.selectedLabel == undefined) return;
                        interfaceManager.contextMenuManager.menu['preview-type'](variableManager.selectedLabel.getType());
                    }}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-label']('type', type);
                    }}>
                    {processManager.processes['to-capital-letter'](this.state.colors.getNameByType(type))}
                </li>
                )
            };
            ctxmenu.push(
                <hr key={'hr-line-2'} style={{ margin: '5px', padding: '0px' }} />
            );
            ctxmenu.push(
                <li
                    key={'edit-start'}
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-label']('time', 'start');
                    }}>
                    {'Edit Start Time'}
                </li>
            );
            ctxmenu.push(
                <li
                    key={'edit-end'}
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-label']('time', 'end');
                    }}>
                    {'Edit End Time'}
                </li>
            );
            if (this.state.clipboard.labelIDs.length > 0) {
                ctxmenu.push(
                    <hr key={'hr-line-3'} style={{ margin: '5px', padding: '0px' }} />
                );
                ctxmenu.push(
                    // TODO: Disable clicking on paste, make it only hoverable
                    <li
                        className={"menu-option edit-paste paste"}
                        onClick={() => {
                            return false;
                        }}>
                        {'Paste'}
                        {<ul className={'paste-menu menu-options'}>
                            {labelMenu}
                        </ul>
                        }
                    </li>
                );
            }
            
            ctxmenu.push(
                <hr key={'hr-line-4'} style={{ margin: '5px', padding: '0px' }} />
            );
            /* TEST */
            ctxmenu.push(
                <li
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['cut-label']();
                    }}>
                    {'Cut'}
                </li>
            )
            ctxmenu.push(
                <li
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['copy-label']();
                    }}>
                    {'Copy'}
                </li>
            );
            ctxmenu.push(
                <hr key={'hr-line-5'} style={{ margin: '5px', padding: '0px' }} />
            );
            ctxmenu.push(
                <li
                    key={'edit-delete'}
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-label']('delete');
                    }}>
                    {'Delete Label'}
                </li>
            );
            if (this.state.clipboard.labelIDs.length > 0) {
                ctxmenu.push(
                    <li
                        className={"menu-option"}
                        onClick={() => {
                            interfaceManager.contextMenuManager.menu['clear-labels']();
                        }}>
                        {'Clear Paste Menu'}
                    </li>
                );
            }
        } else if (this.props.type == 'add') {
            let types = this.state.colors.getListOfTypes();
            for (let obj in types) {
                let type = types[obj];
                ctxmenu.push(
                    <li key={type}
                        className={"menu-option"}
                        onClick={() => {
                            interfaceManager.contextMenuManager.menu['add-label']('menu', type);
                        }}>
                        {processManager.processes['to-capital-letter'](this.state.colors.getNameByType(type))}
                    </li>
                )
            };
            if(this.state.clipboard.labelIDs.length > 0) {
                ctxmenu.push(
                    <hr key={'hr-line-6'} style={{ margin: '5px', padding: '0px' }} />
                );
                ctxmenu.push(
                    // TODO: Disable clicking on paste, make it only hoverable
                    <li
                        className={"menu-option add-paste paste"}
                        onClick={() => {
                            
                        }}>
                        {'Paste'}
                        {<ul className={'paste-menu menu-options'}>
                                {labelMenu}
                            </ul>
                        }
                    </li>
                );
                ctxmenu.push(
                    <li
                        className={"menu-option"}
                        onClick={() => {
                            interfaceManager.contextMenuManager.menu['clear-labels']();
                        }}>
                        {'Clear Paste Menu'}
                    </li>
                );
            }
            
        } else if (this.props.type == 'track') {
            ctxmenu.push(
                <li
                    key={'edit-name'}
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-track']('text');
                    }}>
                    {'Edit Track Name'}
                </li>
            );
            ctxmenu.push(
                <li
                    key={'edit-color'}
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-track']('type');
                    }}>
                    {'Edit Track Color'}
                </li>
            );
            ctxmenu.push(
                <li
                    key={'delete-track'}
                    className={"menu-option"}
                    onClick={() => {
                        interfaceManager.contextMenuManager.menu['edit-track']('delete');
                    }}>
                    {'Delete Track'}
                </li>
            );
        }
        let retval = <ul
            className={'menu-options'}
            style={{
                margin: '0px'
            }}>
            {ctxmenu}
        </ul>
        return retval;
    }
}

/**
 * ====================================================================================================
 *                                      CONTEXTMENU MANAGER
 * ====================================================================================================
 * Manager for context menus.
 */
class ContextMenuManager {
    /**
     * Constructor
     */
    constructor() {
        this.clipboard = new Clipboard()
        this.menu = {
            'add-label': (tag, data) => {
                if (tag == 'menu') {
                    let id = processManager.processes['uuidv4']();
                    let start = processManager.processes['pixel-to-ms'](
                        $('.menu.add')[0].getBoundingClientRect().left + $('.data-display-panel')[0].scrollLeft - variableManager.offset
                    )
                    let label = new Label(id, '', data, start, start + 1000);
                    interfaceManager.dataDisplayManager.labels.addLabel(label);
                    interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(data);
                    interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                    interfaceManager.dataDisplayManager.updateTimelineHeight();
                    processManager.history.addHistory(
                        variableManager.requestCodes.add,
                        {
                            id: id,
                            oldValue: undefined,
                            newValue: label
                        }
                    )
                }
            },
            'copy-label': () => {
                this.clipboard.addLabel(variableManager.selectedLabel.id, this.clipboard.TYPES.COPY);
                this.updateMenu();
                
            },
            'cut-label': () => {
                this.clipboard.addLabel(variableManager.selectedLabel.id, this.clipboard.TYPES.CUT);
                this.updateMenu();
            },
            'clear-labels': () => {
                this.clipboard.clear();
                this.updateMenu();
            },
            'paste-label': (track, label) => {
                let start;
                if ($('.menu.add')[0].classList.contains('hidden')) {
                    start = processManager.processes['pixel-to-ms'](
                        $('.menu.edit')[0].getBoundingClientRect().left + $('.data-display-panel')[0].scrollLeft - variableManager.offset
                    )
                } else {
                    start = processManager.processes['pixel-to-ms'](
                        $('.menu.add')[0].getBoundingClientRect().left + $('.data-display-panel')[0].scrollLeft - variableManager.offset
                    )
                }
                this.clipboard.generatePasteLabel(start, track, label);
                this.updateMenu();
            },
            'quick-paste': () => {
                if (!this.clipboard.labelIDs.length) {
                    // check empty clipboard
                    return;
                }

                const track = variableManager.config['SPEED_LABEL_TYPE']; // selected track
                const start = processManager.processes['pixel-to-ms']($('.data-display-panel')[0].scrollLeft);
                const label = interfaceManager.dataDisplayManager.labels.getLabelByID(this.clipboard.labelIDs[0]);
                
                this.clipboard.generatePasteLabel(start, track, label);
                this.updateMenu();
            },
            'edit-label': (tag, data) => {
                if (tag == 'text') {
                    if (variableManager.selectedLabel == undefined) return;
                    let textbox = $(variableManager.selectedLabelDiv);
                    let inputAttr = `font-size: 12px; height: ${textbox.innerHeight()}px; `;

                    textbox.attr('class').includes('display') ?
                        inputAttr += `width: 25vw;` :
                        inputAttr += `left: ${textbox.css('left')}; position: absolute;` +
                        ` top: ${textbox.css('top')}; z-index: 172; width: ${textbox.innerWidth()}px;`
                    let input = `<input ` +
                        `class='input-text-editor' ` +
                        `style="${inputAttr}" ` +
                        `type='text' ` +
                        `value="${textbox.text().replaceAll("'", "&apos;").replaceAll('"', '&quot;')}"></input>`;
                    textbox.replaceWith(input)
                    $('.input-text-editor')
                        .keydown(function (e) {
                            if (e.originalEvent.code == 'Enter' || e.originalEvent.code == 'NumpadEnter') {
                                if (e.target.value.includes('/')) {
                                    interfaceManager.notificationManager.show("INVALID INPUT: CONTAINING '/' CHARACTER.", {type: 'error'})
                                } else {
                                    this.blur();

                                    processManager.history.addHistory(
                                        variableManager.requestCodes.text,
                                        {
                                            id: variableManager.selectedLabel.getID(),
                                            oldValue: variableManager.selectedLabel.getText(),
                                            newValue: e.target.value
                                        }
                                    );
                                    interfaceManager.dataDisplayManager.labels.setLabelsNameByID(
                                        variableManager.selectedLabel.getID(),
                                        e.target.value
                                    );
                                }
                                interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                                interfaceManager.contextMenuManager.updateMenu();
                            } else if (e.originalEvent.code == variableManager.config.KEYCODE_ESCAPE) {
                                this.blur();
                                interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                            }
                        })
                        .blur(function () {
                            this.replaceWith(textbox[0])
                            interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                            processManager.setEditingMode(false);
                        })
                        .focus();
                    processManager.setEditingMode(true);
                } else if (tag == 'type') {
                    let prevtype = variableManager.selectedLabel.getType();
                    processManager.history.addHistory(
                        variableManager.requestCodes.type,
                        {
                            id: variableManager.selectedLabel.getID(),
                            oldValue: prevtype,
                            newValue: data
                        }
                    )
                    interfaceManager.dataDisplayManager.labels.setLabelsTypeByID(
                        variableManager.selectedLabel.getID(),
                        data
                    );
                    interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(prevtype);
                    interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(data);
                    interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.readjustEditor();
                    interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
                    interfaceManager.dataDisplayManager.updateTimelineHeight();
                    this.updateMenu();
                } else if (tag == 'time') {
                    if (variableManager.selectedLabel == undefined) return;
                    let textbox = $(variableManager.selectedLabelDiv);
                    let inputAttr = `font-size: 10px; height: ${textbox.innerHeight()}px; `;
                    let valueminmax;
                    if (data == 'start') {
                        textbox.attr('class').includes('display') ?
                        inputAttr += `width: 25vw;` :
                        inputAttr += `left: ${textbox.css('left')}; position: ` +
                        `absolute; top: ${textbox.css('top')}; z-index: 172; width: 110px;`
                        valueminmax =
                            `value='${processManager.processes['s-to-string-ms'](variableManager.selectedLabel.getStartTimeS())}' ` +
                            `min='00:00:00.000' ` +
                            `max='${processManager.processes['s-to-string-ms'](variableManager.selectedLabel.getEndTimeS())}' `
                    } else {
                        textbox.attr('class').includes('display') ?
                        inputAttr += `width: 25vw;` :
                        inputAttr += `right: ${textbox.css('right')}; position: ` +
                        `absolute; top: ${textbox.css('top')}; z-index: 172; width: 110px;`
                        valueminmax =
                            `value='${processManager.processes['s-to-string-ms'](variableManager.selectedLabel.getEndTimeS())}' ` +
                            `min='${processManager.processes['s-to-string-ms'](variableManager.selectedLabel.getStartTimeS())}' ` +
                            `max='99:99:99.999' `
                    }
                    let input = `<input ` +
                        `class='input-time-editor' ` +
                        `step='0.001' ` +
                        `style="${inputAttr}" ` +
                        `type='time' ` +
                        valueminmax +
                        `></input>`;
                    textbox.replaceWith(input)
                    $('.input-time-editor')
                        .keydown(function (e) {
                            if (e.originalEvent.code == 'Enter' || e.originalEvent.code == 'NumpadEnter') {
                                this.blur();
                                let arr = e.target.value.split(/[\:.]/);
                                let t = (arr[0] * 3600000) + (arr[1] * 60000) + (arr[2] * 1000) + (arr[3] * 1);
                                let oldval = {
                                    start: variableManager.selectedLabel.getStartTimeMS(),
                                    end: variableManager.selectedLabel.getEndTimeMS()
                                }
                                let newval;
                                if (data == 'start') {
                                    if (t > oldval.end) t = oldval.end;
                                    newval = {
                                        start: t,
                                        end: oldval.end
                                    }
                                } else {
                                    if (t < oldval.start) t = oldval.start;
                                    newval = {
                                        start: oldval.start,
                                        end: t
                                    }
                                }
                                interfaceManager.dataDisplayManager.labels.setLabelsTimeByID(
                                    variableManager.selectedLabel.getID(),
                                    newval
                                );
                                interfaceManager.dataDisplayManager.updateTimelineHeight();
                                if (processManager.processes['check-time-change'](oldval, newval)) {
                                    processManager.history.addHistory(
                                        variableManager.requestCodes.position,
                                        {
                                            id: variableManager.selectedLabel.getID(),
                                            oldValue: oldval,
                                            newValue: newval
                                        }
                                    )
                                }
                            } else if (e.originalEvent.code === variableManager.config.KEYCODE_ESCAPE) {
                                this.blur();
                                interfaceManager.dataDisplayManager.updateTimelineHeight();
                            }
                        })
                        .blur(function () {
                            this.replaceWith(textbox[0]);
                            interfaceManager.dataDisplayManager.updateTimelineHeight();
                            interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                            processManager.setEditingMode(false);
                        })
                        .focus();
                    processManager.setEditingMode(true);
                } else if (tag == 'delete') {
                    let prevtype = variableManager.selectedLabel.getType();
                    this.clipboard.removeLabelByID(variableManager.selectedLabel.getID());
                    interfaceManager.dataDisplayManager.labels.deleteLabelByID(variableManager.selectedLabel.getID());

                    processManager.history.addHistory(
                        variableManager.requestCodes.add,
                        {
                            id: variableManager.selectedLabel.getID(),
                            oldValue: variableManager.selectedLabel,
                            newValue: undefined
                        }
                    )
                    variableManager.selectedLabel = undefined;
                    variableManager.selectedLabelDiv = undefined;

                    interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(prevtype);
                    interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
                    interfaceManager.dataDisplayManager.updateTimelineHeight();
                    this.updateMenu();
                } 
            },
            'edit-track': (tag) => {
                if (tag == 'text') {
                    console.log('WORK IN PROGRESS: EDIT TRACK')
                    // let targetTrack = $(ctxMenuTrackDIV);
                    // let inputAttr = `font-size: 18px; height: ${targetTrack.innerHeight()}px; width: 200px; 
                    // position: absolute; left: ${targetTrack.css('left')}; top: ${targetTrack.css('top')}; z-index: 2;`;
                    // let inputTextBox = `<input
                    //     class='input-text-editor'
                    //     style="${inputAttr}"
                    //     type='text'
                    //     value=${targetTrack.text()}
                    // >
                    // </input>`
                    // targetTrack.replaceWith(inputTextBox)
                    // $('.input-text-editor')
                    //     .keydown(function (e) {
                    //         if (e.code === 'Enter') {
                    //             if (e.target.value.includes('/')) {
                    //                 window.alert("INVALID INPUT: CONTAINING '/' CHARACTER.")
                    //             } else {
                    //                 this.blur();
                    //                 let oldName = colorsBox.getNameByType(ctxMenuTrackType);
                    //                 colorsBox.setNameByName(oldName, e.target.value, ctxMenuTrackDIV)
                    //             }
                    //         } else if (e.code === KEYCODE_ESCAPE) {
                    //             this.blur();
                    //         }
                    //     })
                    //     .blur(function () {
                    //         this.replaceWith(targetTrack[0]);
                    //     })
                    //     .focus();
                } else if (tag == 'type') {
                    console.log('WORK IN PROGRESS: EDIT TYPE')
                    // $('.color-wheel')
                    //     .css({
                    //         bottom: (LABEL_HEIGHT + 10) * getTypeReverseOrder(ctxMenuTrackType)
                    //     })
                    //     .removeClass('hidden');
                    // colorsBox.setIroOnColorChange(ctxMenuTrackDIV)
                    // colorsBox.setIroCurrentColor(colorsBox.getColorByType(ctxMenuTrackType))
                } else if (tag == 'delete') {
                    console.log('WORK IN PROGRESS: DELETE TRACK')
                    // colorsBox.deleteColorByType(ctxMenuTrackType);
                    // menuManager.updateMenu()
                    // menuManager.updateFilter();
                    // labelDataStructures.deleteLabelsByType(ctxMenuTrackType);
                }
            },
            'preview-label': (type, label) => {
                // Create a ghost version of the label on the selectected track type
                let start;
                if ($('.menu.add')[0].classList.contains('hidden')) {
                    start = processManager.processes['pixel-to-ms'](
                        $('.menu.edit')[0].getBoundingClientRect().left + $('.data-display-panel')[0].scrollLeft - variableManager.offset
                    )
                } else {
                    start = processManager.processes['pixel-to-ms'](
                        $('.menu.add')[0].getBoundingClientRect().left + $('.data-display-panel')[0].scrollLeft - variableManager.offset
                    )
                }
                const id = processManager.processes['uuidv4']();
                const newLabel = new Label(id, label.text, type, start, start + (label.end-label.start));

                interfaceManager.dataDisplayManager.labels.addLabel(newLabel);
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(type);
                interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                interfaceManager.dataDisplayManager.updateTimelineHeight();

                return newLabel;
            },
            'preview-type': (type) => {

                let id = variableManager.selectedLabel.getID();

                $(`#label-display-${id}`).removeClass(function (i, className) {
                    return (className.match(/(^|\s)type-\S+/g) || []).join(' ');
                });
                $(`#label-display-${id}`).addClass(`type-${type}`);
            },
            'unpreview-label': (label) => {
                if (label == undefined) {
                    return;
                }
                interfaceManager.dataDisplayManager.labels.deleteLabelByID(label.getID());
                interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(label.type);
                interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
                interfaceManager.dataDisplayManager.updateTimelineHeight();
            }
        }
        this.contextMenuReact = {
            'add': undefined,
            'edit': undefined,
            'track': undefined
        }
    }
    /**
     * Add react object.
     * @param {String} type Context menu type.
     * @param {React.Component} reactObject Context menu react object.
     */
    addReact(type, reactObject) {
        this.contextMenuReact[type] = reactObject;
    }
    /**
     * Hide all menus.
     */
    hideAllMenu() {
        for (let i in this.contextMenuReact) {
            $(`.menu.${i}`).addClass('hidden');
        }
    }
    /**
     * Set context menu new position when displayed.
     * @param {Event} e Event
     * @param {String} target Target for context menu.
     * @param {Jquery.Selector} menu Jquery selector menu.
     * @param {{}} data Data.
     */
    setPosition(e, target, menu, data) {
        e.preventDefault();
        let clickPos = {
            left: e.pageX,
            top: e.pageY
        };
        processManager.selectedTrackType = data.type;

        if (target == 'label') {
            variableManager.selectedLabel = interfaceManager.dataDisplayManager.labels.getLabelByID(data.id);
            variableManager.selectedLabelDiv = e.target;

            if (e.target.className.includes('label-ghost')) variableManager.selectedLabelDiv = $(`#label-react-${data.id}`)[0]

            $('.checkmark').css({ marginTop: 32 + 20 * processManager.colorManager.getTypeOrdering(data.type) });
            $('.menu.edit').removeClass('hidden');
            $('.menu.add').addClass('hidden');
            $('.menu.track').addClass('hidden');
        } else if (target == 'track') {
            $('.menu.edit').addClass('hidden');
            $('.menu.add').addClass('hidden');
            $('.menu.track').removeClass('hidden');
        } else if (target == 'canvas') { 
            $('.menu.edit').addClass('hidden');
            $('.menu.add').removeClass('hidden');
            $('.menu.track').addClass('hidden');
        }
        const rect = menu[0].getBoundingClientRect();
        let adjusted = processManager.processes['adjust-menu'](clickPos, rect);
        menu.css({
            top: adjusted.top,
            left: adjusted.left
        })

        // adjust paste menu left or right depending on menu position
        if (2*rect.width + adjusted.left >= variableManager.windowWidth) {
            $('.paste-menu').css({right: '95%', left: ''});
        } else {
            $('.paste-menu').css({right: '', left: '95%'});
        }
    }
    /**
     * Update all menus with new colors.
     */
    updateMenu() {
        for (let m in this.contextMenuReact) {
            this.contextMenuReact[m].updateMenuReact();
            this.contextMenuReact[m].updateClipboardReact();
        }
    }
    /**
     * Render context menus via React.
     */
    render() {
        ReactDOM.render(
            <ContextMenuReact type={'edit'} />,
            $('.menu.edit')[0]
        );
        ReactDOM.render(
            <ContextMenuReact type={'add'} />,
            $('.menu.add')[0]
        );
        ReactDOM.render(
            <ContextMenuReact type={'track'} />,
            $('.menu.track')[0]
        );
    }
}