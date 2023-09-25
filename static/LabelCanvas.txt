
/**
 * ====================================================================================================
 *                                          LABEL CANVAS REACT
 * ====================================================================================================
 * Label display panel React object.
 */
class LabelCanvasPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contents: []
        }
        interfaceManager.dataDisplayManager.labelPanelManager.labelCanvasManager.addPanelReact(this);
    }
    /**
     * Reset display.
     */
    clearDisplay() {
        this.setState({
            contents: []
        })
    }
    /**
     * Update display panel.
     */
    updateDisplay() {
        let colors = processManager.colorManager.getListOfTypes();
        let contents = [];
        for (let i = 0; i < colors.length; i++) {
            contents.push(
                <LabelCanvasReact
                    key={colors[i].toString()}
                    type={colors[i]} />
            )
        }
        this.setState({
            contents: contents
        })
    }
    /**
     * Render Label display panel.
     */
    render() {
        return (
            <div className='label-canvas-panel'
                onWheel={(e) => { interfaceManager.dataDisplayManager.labelPanelManager.labelCanvasManager.wheel(e) }}>
                {this.state.contents}
            </div>
        )
    }
}

/**
 * Label Canvas React Object.
 */
class LabelCanvasReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         * Type         : Type number for canvas.
         */
        super(props);
        /**
         * Labels                   : List of labels displayed.
         * Levels                   : Height level of label tiers.
         */
        this.state = {
            labels: [],
            levels: 1
        };
        interfaceManager.dataDisplayManager.labelPanelManager.labelCanvasManager.addCanvasReact(this.props.type, this)
    }
    /**
     * First time component mounted.
     */
    componentDidMount() {
        this.updateDisplay();
    }
    /**
     * Process label in specific order of position left and top.
     */
    updateDisplay() {
        let labels = [];
        let tiered = interfaceManager.dataDisplayManager.labels.getLabelByTiers(this.props.type);
        if (tiered)
        {
            let levels = Object.keys(tiered).length;
            $(`.track-panel.type-${this.props.type}`).css('height', levels * variableManager.config.LABEL_HEIGHT + 10);
            for (let tier in tiered) {
                for (let label in tiered[tier]) {
                    labels.push(
                        <LabelReact
                            click={this.select.bind(this)}
                            info={tiered[tier][label]}
                            key={tiered[tier][label].getID()}
                            level={tier} />
                    )
                }
            }
            this.setState({
                labels: labels,
                levels: levels
            });
        }
    }
    /**
     * Update width when interval changes.
     */
    updateWidth() {
        this.setState({})
    }
    /**
     * Set editor to be active when label is selected. 
     * @param {Event} e HTML event.
     * @param {{}} childData Containing label data.
     */
    select(e, childData) {
        // interfaceManager.mainScreenManager.dataPanelManager.labelDisplayManager.highlightLabel(childData.id);
        // $('.preview-mouse-move').show();
        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.selected({
            end: childData.end,
            id: childData.id,
            left: childData.left,
            pageX: e.pageX,
            start: childData.start,
            top: childData.top,
            type: this.props.type,
            width: childData.width
        })
        const top = (processManager.colorManager.getTypeOrdering(this.props.type) * 10) +
            (interfaceManager.dataDisplayManager.labels.getTotalTiersBefore(this.props.type) * variableManager.config.LABEL_HEIGHT) + childData.top;
        $('.ghost-editor').css('top', top)
        interfaceManager.previewManager.setPosition(e.pageX, 'editor')
        interfaceManager.dataDisplayManager.labelPanelManager.editorPanelManager.setEditorLines({
            line: 'middle',
            position: childData.left,
            width: childData.width
        })
        $('.preview-mouse-move').detach().appendTo('.data-display-panel')
    }
    /**
     * Render label canvas below main screen.
     */
    render() {
        return (

            <div className={`type-container type-${this.props.type} darken`}
                style={{
                    height: `${this.state.levels * variableManager.config.LABEL_HEIGHT + 10}px`,
                }}
                onMouseDown={(e) => {
                    if (e.target.className.split(' ').includes('type-container')) {
                        interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.setInactive();
                    }
                }}
                onContextMenu={(e) => {
                    if (e.target.className == 'padder') return;
                    interfaceManager.contextMenuManager.setPosition(
                        e,
                        'canvas',
                        $('.menu.add'),
                        {type: this.props.type}
                    )
                }}>
                <div className={'padder'}></div>
                <div className={`label-container`}>
                    {this.state.labels}
                </div>
            </div>
        )
    }
}

/**
 * Label React Object.
 */
class LabelReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         * Click        : Onclick event for callback when label is selected.
         * Info         : Label's info.
         * Level        : Label's top position.
         */
        super(props);
        /**
         * Del          : Label's deleted state.
         * End          : Label's end time.
         * ID           : Label's id.
         * Start        : Label's start time.
         * Text         : Label's text.
         * Top          : Label's top position.
         * Type         : Label's type.
         */
        this.state = {
            del: this.props.info.isDeleted(),
            end: this.props.info.getEndTimeMS(),
            id: this.props.info.getID(),
            start: this.props.info.getStartTimeMS(),
            text: this.props.info.getText(),
            top: this.props.level,
            type: this.props.info.getType()
        }
        interfaceManager.dataDisplayManager.labels.addReactLabel(this.state.id, this)
    }
    /**
     * Callback the function passed when label is clicked.
     * @param {Event} e HTML Event.
     */
    callback(e) {
        if (e.button === 0 || e.button === 2) {
            this.props.click(e,
                {
                    end: this.state.end,
                    id: this.state.id,
                    left: processManager.processes['ms-to-pixel'](this.state.start),
                    start: this.state.start,
                    top: this.state.top * variableManager.config.LABEL_HEIGHT,
                    width: processManager.processes['ms-to-pixel'](this.state.end - this.state.start),
                })
        }
    }
    /**
     * When label is moved around or changed.
     */
    componentDidUpdate(pProps, prevState) {
        let curr = {
            del: this.props.info.deleted,
            end: this.props.info.getEndTimeMS(),
            id: this.props.info.getID(),
            start: this.props.info.getStartTimeMS(),
            text: this.props.info.getText(),
            top: this.props.level,
            type: this.props.info.getType(),
        }
        let prev = {
            del: prevState.del,
            end: prevState.end,
            id: prevState.id,
            start: prevState.start,
            text: prevState.text,
            top: prevState.top,
            type: prevState.type
        }
        if (curr.id !== prev.id) {
            this.setState({
                id: curr.id
            })
        } else if (curr.text !== prev.text) {
            this.setState({
                text: curr.text
            })
        } else if (curr.type !== prev.type) {
            this.setState({
                type: curr.type
            })
        } else if (curr.start !== prev.start || curr.end !== prev.end) {
            this.setState({
                start: curr.start,
                end: curr.end
            })
        } else if (curr.end !== prev.end) {
            this.setState({
                del: curr.del
            })
        } else if (curr.top !== prev.top) {
            this.setState({
                top: curr.top
            })
        }
    }
    /**
     * Readjust label display when interval is changed.
     */
    readjustDisplay() {
        this.setState({
            width: `${processManager.processes['ms-to-pixel'](this.state.end - this.state.start)}px`
        });
    }
    /**
     * Render label into label canvas.
     */
    render() {
        return (
            !this.state.del &&
            <div
                /**
                 * Classname        : Label's ID.
                 * Title            : Label's text when hovered to display hidden shrunk text.
                 */
                //className={`${this.state.id} type-${this.state.type} label-react`}
                className={`type-${this.state.type} label-react`}
                title={this.state.text}
                id={`label-react-${this.state.id}`}
                /**
                 * Height           : Label's height.
                 * Left             : Label's left position.
                 * Top              : Label's top position.
                 * Width            : Label's width.
                 */
                style={{
                    height: variableManager.config.LABEL_HEIGHT,
                    left: `${processManager.processes['ms-to-pixel'](this.state.start)}px`,
                    top: `${this.state.top * variableManager.config.LABEL_HEIGHT}px`,
                    width: `${processManager.processes['ms-to-pixel'](this.state.end - this.state.start)}px`

                }}
                onMouseDown={this.callback.bind(this)}
                onContextMenu={(e) => {
                    e.stopPropagation();
                    interfaceManager.contextMenuManager.setPosition(
                        e,
                        'label',
                        $('.menu.edit'),
                        { id: this.state.id, type: this.state.type }
                    )
                }}>
                {this.state.text}
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          LABEL CANVAS MANAGER
 * ====================================================================================================
 * Manager for label canvas.
 */
class LabelCanvasManager {
    /**
     * Constructor. 
     */
    constructor() {
        this.labelCanvasPanel = undefined;
        this.labelCanvasReacts = {};
        this.scrolling = undefined;
    }
    /**
     * Add react object.
     * @param {React.Component} reactObject React object.
     */
    addPanelReact(reactObject) {
        this.labelCanvasPanel = reactObject;
    }
    /**
     * Add react object.
     * @param {number} type Label Canvas type.
     * @param {React.Component} reactObject React object.
     */
    addCanvasReact(type, reactObject) {
        this.labelCanvasReacts[type] = reactObject;
    }
    /**
     * Reset display.
     */
    clearDisplay() {
        this.labelCanvasPanel.clearDisplay();
        this.labelCanvasReacts = {};
    }
    /**
     * Redisplay label canvas.
     * @param {number} canvas Label canvas type.
     */
    reDisplayCanvas(canvas) {
        this.labelCanvasReacts[canvas].updateDisplay(canvas);
    }
    /**
     * Update canvas by type.
     */
    updateCanvas() {
        this.clearDisplay();
        this.updateDisplay();
    }
    /**
     * Update width
     */
    updateWidth() {
        for (let i in this.labelCanvasReacts) {
            this.labelCanvasReacts[i].updateWidth();
        }
    }
    /**
     * Update display.
     */
    updateDisplay() {
        this.labelCanvasPanel.updateDisplay();
    }
    
    wheel(e) {
        // 1. Else remove scrolling timout for video sync.
        window.clearTimeout(this.scrolling);

        // Source: https://stackoverflow.com/questions/10744645/detect-touchpad-vs-mouse-in-javascript
        let isTouchPad = e.nativeEvent.wheelDeltaY ? e.nativeEvent.wheelDeltaY === -3 * e.nativeEvent.deltaY : e.nativeEvent.deltaMode === 0;

        let sign = "+";
        if (isTouchPad)
        {
            // 2.1.1 Find dominant scroll up/down or left/right
            if(Math.abs(e.deltaY) > Math.abs(e.deltaX))
            {
                // 2.1.2 Get scroll direction sign.
                sign = e.deltaY < 0 ? "+" : '-';
            }
            else
            {
                // 2.1.2 Get scroll direction sign.
                sign = e.deltaX < 0 ? "-" : '+';
            }
        }
        else
        {
            // 2. Get scroll up or down sign.
            sign = e.deltaY < 0 ? "+" : '-';
        }

        // 3. Scroll data display to appropriate scroll.
        $('.data-display-panel')[0].scrollLeft += parseInt(sign + 50);
        const c_time = $('.data-display-panel')[0].scrollLeft / variableManager.CONFIG_PIXEL_PER_INTERVAL;
        // 4. Update video display info
        interfaceManager.updateVideoInfo(c_time);
        // 5. Set timeout for scrolling to prevent video update every scroll clicks.
        this.scrolling = window.setTimeout(function () {
            $('.video-main')[0].currentTime = c_time;
        }, 500);
    }
}
