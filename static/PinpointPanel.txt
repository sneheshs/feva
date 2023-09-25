
/**
 * ====================================================================================================
 *                                          PINPOINT REACT
 * ====================================================================================================
 * Pinpoint panel react object.
 */
class PinpointPanel extends React.Component {
    /**
      * Props
      * #####
      * Num         : Number of frames.
      */
    constructor(props) {
        super(props);
        /**
         * Display      : Pinpoint frames display.
         * Num          : Number of frames.
         */
        this.state = {
            display: 'none',
            num: this.props.num
        }
        interfaceManager.pinpointFrameManager.addReactPanel(this);
    }
    /**
     * Show.
     */
    show() {
        this.setState({
            display: 'flex'
        })
    }
    /**
     * Hide.
     */
    hide() {
        this.setState({
            display: 'none'
        })
    }
    /** 
     * Render pinpoint react.
     */
    render() {
        let contents = [];
        for (let i = 0; i < this.state.num; i++) {
            contents.push(
                <PinpointReact
                    tag={i}
                    key={i.toString()}
                    left={variableManager.config.IMAGE_WIDTH * i} />
            )
        }
        return (
            <div
                className={'pinpoint-container'}
                /**
                 * Display      : Flex or none.
                 * Box Sizing   : Including height width.
                 * Height       : Image height.
                 * Position     : Absolute.
                 * Width        : Image width * number of frames.
                 * Z Index      : 1
                 */
                style={{
                    display: this.state.display,
                    boxSizing: "border-box",
                    height: `${variableManager.CONFIG_IMAGE_HEIGHT}px`,
                    position: 'absolute',
                    width: `${this.state.num * variableManager.config.IMAGE_WIDTH}px`,
                    zIndex: 190
                }}>
                {[
                    contents,
                    <video
                        key={'video-pinpoint'}
                        className={'video-pinpoint'}
                        style={{
                            width: `${variableManager.config.IMAGE_WIDTH * variableManager.config.COL}px`,
                            height: `${variableManager.CONFIG_IMAGE_HEIGHT * variableManager.config.ROW}px`,
                            display: 'none'
                        }}
                        muted={true} />
                ]}
            </div>
        )
    }
}

/**
 * Pinpoint React object.
 */
class PinpointReact extends React.Component {
    /**
      * Props
      * #####
      * Left        : Left position of frame.
      * Tag         : Frame tag.
      */
    constructor(props) {
        super(props);
    }
    /** 
     * Render pinpoint react.
     */
    render() {
        return (
            <div
                className ={this.props.tag=='2' ? 'pinpoint-div box-2' : 'pinpoint-div '}
                /**
                 * Background       : Transparent.
                 * Border           : 1px solid white.
                 * Box Sizing       : Content box.
                 * Height           : Image height.
                 * Position         : Absolute.
                 * Width            : Image width.
                 * Z Index          : 1.
                 */
                style={{
                    left: `${this.props.tag=='2' ? this.props.left - 3 + 'px' :
                                                        this.props.left + 'px'}`,
                    height: `${variableManager.CONFIG_IMAGE_HEIGHT}px`,
                    width: `${variableManager.config.IMAGE_WIDTH}px`
                }}>
                <canvas
                    className={`pinpoint-${this.props.tag}`}
                    height={variableManager.CONFIG_IMAGE_HEIGHT + 'px'}
                    width={variableManager.config.IMAGE_WIDTH + 'px'}
                    style={{
                        height: `${variableManager.CONFIG_IMAGE_HEIGHT}px`,
                        width: `${variableManager.config.IMAGE_WIDTH}px`
                    }} />
                <div
                    className={`pinpoint-text-${this.props.tag}`}
                    /**
                     * Background       : Black.
                     * Color            : Font color.
                     * Height           : 14px.
                     * 
                     */
                    style={{
                        background: '#00000077', //'black',
                        color: 'white',
                        height: '14px',
                        /*left: `${variableManager.config.IMAGE_WIDTH / 2 - 10}px`,*/
                        position: 'absolute',
                        textAlign: 'center',
                        top: '0px',
                        width: '100%' //'20px'
                    }}>
                </div>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          PINPOINT MANAGER
 * ====================================================================================================
 * Manager for pinpoint frames.
 */
class PinpointFrameManager {
    constructor() {
        this.pinpointPanel = undefined;
        this.pinpointFrames = {}
        this.pinpointGenerator = undefined;
        this.flag = [];
        this.num = 0;
    }
    /**
     * Add panel.
     * @param {React.Component} reactObject React object.
     */
    addReactPanel(reactObject) {
        this.pinpointPanel = reactObject
    }
    /**
     * Hide frames.
     */
    hideFrames() {
        this.pinpointPanel.hide();
    }
    /**
     * Show frames.
     */
    showFrames() {
        this.pinpointPanel.show();
    }
    /**
     * Set frames.
     * @param {String} placement Left or Right.
     */
    setFrames(placement) {
        this.flag = [];
        for (let i = 0; i < this.num; i++) {
            this.flag.push(false);
        }
        let rect = interfaceManager.dataDisplayManager.labelPanelManager.labelEditorManager.datapos;        
        
        //let top = $(`.track-panel.type-${rect.type}`)[0].getBoundingClientRect().top - (variableManager.CONFIG_IMAGE_HEIGHT)
        let top = $(`.label-replica.type-${rect.type}.labels`)[0].getBoundingClientRect().top - (variableManager.CONFIG_IMAGE_HEIGHT)
        if (placement == 'left') {
            $('.pinpoint-container').css({
                // Fix: Instead of computing with respect to the whole canvas, calc is based on onscreen position
                // left: variableManager.offset + rect.left - (this.num / 2 * variableManager.config.IMAGE_WIDTH) - $('.data-display-panel')[0].scrollLeft,
                left: $(`.label-replica.type-${rect.type}.labels`)[0].getBoundingClientRect().left -
                    (this.num / 2 * variableManager.config.IMAGE_WIDTH),
                top: top,
            })
            this.pinpointGenerator.currentTime =
                (variableManager.selectedLabel.getStartTimeMS() -
                    (Math.floor(this.num / 2) * 100 / 3)) / 1000;
        } else if (placement == 'right') {
            $('.pinpoint-container').css({
                // Fix: Instead of computing with respect to the whole canvas, calc is based on onscreen position
                // left: variableManager.offset + rect.left - (this.num / 2 * variableManager.config.IMAGE_WIDTH) + rect.width - $('.data-display-panel')[0].scrollLeft,
                left: $(`.label-replica.type-${rect.type}.labels`)[0].getBoundingClientRect().left -
                    (this.num / 2 * variableManager.config.IMAGE_WIDTH) + 
                    $(`.label-replica.type-${rect.type}.labels`)[0].getBoundingClientRect().width,
                top: top,
            })
            this.pinpointGenerator.currentTime =
                (variableManager.selectedLabel.getEndTimeMS() -
                    (Math.floor(this.num / 2) * 100 / 3)) / 1000;
        } else {
            interfaceManager.notificationManager.show('TODO: ERROR MISSING PLACEMENT', {type:'error'})
        }
        let x = ((interfaceManager.toolbarManager.projectManager.currentProject.angle - 1) %
            variableManager.config.COL) * this.pinpointGenerator.videoWidth / variableManager.config.COL;
        let y = Math.floor((interfaceManager.toolbarManager.projectManager.currentProject.angle - 1) /
            variableManager.config.COL) * this.pinpointGenerator.videoHeight / variableManager.config.ROW;
        let counter = 0;
        let timer = Math.round(this.pinpointGenerator.currentTime * 30);
        this.pinpointGenerator.ontimeupdate = () => {
            this.pinpointGenerator.pause();
            if (!this.flag[counter] && counter < this.num) {
                $(`.pinpoint-${counter}`)[0].getContext('2d').drawImage(
                    this.pinpointGenerator,
                    x,
                    y,
                    this.pinpointGenerator.videoWidth / variableManager.config.COL,
                    this.pinpointGenerator.videoHeight / variableManager.config.ROW,
                    0,
                    0,
                    variableManager.config.IMAGE_WIDTH,
                    variableManager.CONFIG_IMAGE_HEIGHT
                )
                $(`.pinpoint-text-${counter}`)[0].innerText = timer + counter;
                this.flag[counter] = true;
                this.pinpointGenerator.currentTime += 1 / 30;
                counter++;
            }
        };
        this.pinpointGenerator.onended = () => { this.pinpointGenerator.pause(); };
    }
    /**
     * Render display frames via React.
     */
    render(num) {
        this.num = num;
        for (let i = 0; i < num; i++) {
            this.flag.push(false);
        }
        ReactDOM.render(
            <PinpointPanel
                num={num} />,
            $('.root-pinpoint-frames')[0]
        )
        this.pinpointGenerator = $('.video-pinpoint')[0]
    }
}

