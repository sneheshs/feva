/**
 * ====================================================================================================
 *                                          TOOLTIP REACT
 * ====================================================================================================
 * Tooltip React Object.
 */
class TooltipPanel extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         */
        super(props);
        /**
         * Background   : Tooltip background color.
         * Text         : Tooltip text.
         * Left         : Tooltip position left.
         * Top          : Tooltip position top.
         * Right        : Tooltip position right.
         */
        this.state = {
            background: 'black',
            text: interfaceManager.tooltipManager.tooltiptexts['welcome'],
            left: (variableManager.windowWidth / 2) - 100,
            top: (variableManager.windowHeight / 2) - 50,
            right: 'unset'
        }
    }
    /**
     * Hide tooltip.
     */
    hide() {
        $('.tool-tip').hide();
        variableManager.configs('SHOW_TOOLTIPS', false);
        processManager.xhrManager.writeConfig(
            'show-tooltip',
            0
        )
    }
    /**
     * On next click.
     */
    next() {
        if (interfaceManager.tooltipManager.pos == interfaceManager.tooltipManager.tooltips.length - 1) {
            this.setState({
                text: 'OK'
            })
        } else if (interfaceManager.tooltipManager.pos == interfaceManager.tooltipManager.tooltips.length) {
            $('.root-tool-tip').hide();
            return;
        }
        this.data = interfaceManager.tooltipManager.tooltips[interfaceManager.tooltipManager.pos]
        this.setState({
            text: data[0],
            left: data[1] + 200 > variableManager.windowWidth ? 'unset' : data[1],
            right: data[1] + 200 > variableManager.windowWidth ? '0px' : 'unset',
            top: data[2],
            background: data[3]
        })
        interfaceManager.tooltipManager.pos += 1;
    }
    /**
     * Render tooltip.
     */
    render() {
        return (
            <div>
                <div
                    /**
                     * Background       : Tooltip background color.
                     * Height           : Tooltip background height.
                     * Left             : Tooltip background left.
                     * Opacity          : Tooltip background opacity.
                     * Position         : Absolute.
                     * Top              : Tooltip background top.
                     * Width            : Tooltip bakcground width.
                     * Zindex           : 590
                     */
                    style={{
                        background: this.state.background,
                        height: `${variableManager.windowHeight}px`,
                        left: '0px',
                        opacity: 0.7,
                        position: 'absolute',
                        top: '0px',
                        width: `${variableManager.windowWidth}px`,
                        zIndex: 590
                    }}
                    className={'tool-tip-background'}>
                </div>
                <div
                    className={'tool-tip-box'}
                    style={{
                        position: 'absolute',
                        top: `${this.state.top}px`,
                        right: `${this.state.right}px`,
                        left: `${this.state.left}px`,
                        width: '200px',
                        height: '100px',
                        background: 'white',
                        borderRadius: '5px',
                        borderStyle: 'groove',
                        borderColor: 'grey',
                        zIndex: 591
                    }}>
                    <div
                        style={{
                            background: '#EEEEEE',
                            width: '190px',
                            margin: '2.5px',
                            height: '70px'
                        }}
                        className={'tool-tip-text'}>
                        {this.state.text}
                    </div>
                    <button
                        style={{
                            margin: '2.5px',
                            borderRadius: '2.5px',
                            width: '92.5px',
                            height: '15px',
                            border: 'white'
                        }}
                        className={'tool-tip-next'}
                        onClick={this.next.bind(this)}>
                        {'Next'}
                    </button>
                    <button
                        style={{
                            margin: '2.5px',
                            borderRadius: '2.5px',
                            width: '92.5px',
                            height: '15px',
                            border: 'white'
                        }}
                        onClick={this.hide.bind(this)}>
                        {`Don't Show Again`}
                    </button>
                </div>
            </div>
        )
    }
}

/**
 * Manager for tooltips.
 */
class TooltipManager {
    /**
     * Constructor.
     */
    constructor() {
        this.pos = 0;
        this.tooltiptexts = {
            'welcome': 'Welcome...',
            'interval': "Interval...",
            'keypoints': "Keypoints...",
            'preview': "Preview...",
            'save': "Save...",
            'undo': "Undo...",
            'redo': "Redo...",
            'option': "Option...",
            'youtube': "Youtube...",
            'video-list': "Video list...",
            'project-list': "Project list...",
            'filter-list': "Filter list...",
            'label-list': "Label list...",
            'main-camera': "Main camera...",
            'camera-selector': "Camera selector...",
            'scrubber-bar': "Scrubber bar...",
            'filmstrip': "Filmstrip...",
            'label-canvas': "Label canvas....",
        }
        this.tooltips = [
            // [
            //     this.tooltiptexts['interval'],
            //     0,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         transparent ${$('.slider-interval').width()}px,
            //         black ${$('.slider-interval').width()}px
            //         ),
            //     linear-gradient(
            //         to bottom,
            //         transparent ${height}px,
            //         black ${height}px,
            //         black 100%
            //         )`
            // ],
            // [
            //     this.tooltiptexts['keypoints'],
            //     $('.slider-interval').width(),
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width()}px,
            //         transparent ${$('.slider-interval').width()}px,
            //         transparent ${$('.slider-interval').width() * 2}px,
            //         black ${$('.slider-interval').width() * 2}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['preview'],
            //     $('.slider-interval').width() * 2,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width() * 2}px,
            //         transparent ${$('.slider-interval').width() * 2}px,
            //         transparent ${$('.slider-interval').width() * 3}px,
            //         black ${$('.slider-interval').width() * 3}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['save'],
            //     $('.slider-interval').width() * 3 + 2 * GAP_WIDTH,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width() * 3}px,
            //         transparent ${$('.slider-interval').width() * 3}px,
            //         transparent ${$('.slider-interval').width() * 3 + height + 2 * GAP_WIDTH}px,
            //         black ${$('.slider-interval').width() * 3 + height + 2 * GAP_WIDTH}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['undo'],
            //     $('.slider-interval').width() * 3 + 4 * GAP_WIDTH + height,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width() * 3 + height + 4 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height + 4 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 2 + 6 * GAP_WIDTH}px,
            //         black ${$('.slider-interval').width() * 3 + height * 2 + 6 * GAP_WIDTH}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['redo'],
            //     $('.slider-interval').width() * 3 + 6 * GAP_WIDTH + height * 2,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width() * 3 + height * 2 + 6 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 2 + 6 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 3 + 8 * GAP_WIDTH}px,
            //         black ${$('.slider-interval').width() * 3 + height * 3 + 8 * GAP_WIDTH}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['option'],
            //     $('.slider-interval').width() * 3 + 8 * GAP_WIDTH + height * 3,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width() * 3 + height * 3 + 8 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 3 + 8 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 4 + 10 * GAP_WIDTH}px,
            //         black ${$('.slider-interval').width() * 3 + height * 4 + 10 * GAP_WIDTH}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['youtube'],
            //     $('.slider-interval').width() * 3 + 10 * GAP_WIDTH + height * 4,
            //     height,
            //     `linear-gradient(
            //         to right,
            //         black ${$('.slider-interval').width() * 3 + height * 4 + 10 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 4 + 10 * GAP_WIDTH}px,
            //         transparent ${$('.slider-interval').width() * 3 + height * 5 + 12 * GAP_WIDTH}px,
            //         black ${$('.slider-interval').width() * 3 + height * 5 + 12 * GAP_WIDTH}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             transparent ${height}px,
            //             black ${height}px,
            //             black 100%
            //             )`
            // ],
            // [
            //     this.tooltiptexts['video-list'],
            //     0,
            //     height + GAP_WIDTH + INPUT_BAR_HEIGHT,
            //     `linear-gradient(
            //         to right,
            //         transparent ${searchBarWidth / 2}px,
            //         black ${searchBarWidth / 2}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             black ${height + GAP_WIDTH}px,
            //             transparent ${height + GAP_WIDTH}px,
            //             transparent ${height + GAP_WIDTH + INPUT_BAR_HEIGHT}px,
            //             black ${height + GAP_WIDTH + INPUT_BAR_HEIGHT}px
            //             )`
            // ],
            // [
            //     this.tooltiptexts['project-list'],
            //     searchBarWidth / 2,
            //     height + GAP_WIDTH + INPUT_BAR_HEIGHT,
            //     `linear-gradient(
            //         to right,
            //         black ${searchBarWidth / 2}px,
            //         transparent ${searchBarWidth / 2}px,
            //         transparent ${searchBarWidth}px,
            //         black ${searchBarWidth}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             black ${height + GAP_WIDTH}px,
            //             white ${height + GAP_WIDTH}px,
            //             white ${height + GAP_WIDTH + INPUT_BAR_HEIGHT}px,
            //             black ${height + GAP_WIDTH + INPUT_BAR_HEIGHT}px
            //             )`
            // ],
            // [
            //     this.tooltiptexts['filter-list'],
            //     0,
            //     height + GAP_WIDTH + INPUT_BAR_HEIGHT * 2,
            //     `linear-gradient(
            //         to right,
            //         transparent ${searchBarWidth}px,
            //         black ${searchBarWidth}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             black ${height + GAP_WIDTH + INPUT_BAR_HEIGHT}px,
            //             transparent ${height + GAP_WIDTH + INPUT_BAR_HEIGHT}px,
            //             transparent ${height + GAP_WIDTH + INPUT_BAR_HEIGHT * 2}px,
            //             black ${height + GAP_WIDTH + INPUT_BAR_HEIGHT * 2}px
            //             )`
            // ],
            // [
            //     this.tooltiptexts['label-list'],
            //     searchBarWidth,
            //     height + GAP_WIDTH + INPUT_BAR_HEIGHT * 2,
            //     `linear-gradient(
            //         to right,
            //         transparent ${searchBarWidth}px,
            //         black ${searchBarWidth}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             black ${height + GAP_WIDTH + INPUT_BAR_HEIGHT * 2}px,
            //             white ${height + GAP_WIDTH + INPUT_BAR_HEIGHT * 2}px,
            //             white ${height + GAP_WIDTH + mainScreenHeight}px,
            //             black ${height + GAP_WIDTH + mainScreenHeight}px
            //             )`
            // ],
            // [
            //     this.tooltiptexts['main-camera'],
            //     searchBarWidth + window.innerWidth / 2,
            //     25,
            //     `linear-gradient(
            //         to right,
            //         black ${searchBarWidth}px,
            //         transparent ${searchBarWidth}px,
            //         transparent ${searchBarWidth + window.innerWidth / 2}px,
            //         black ${searchBarWidth + window.innerWidth / 2}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             black ${height + GAP_WIDTH}px,
            //             white ${height + GAP_WIDTH}px,
            //             white ${height + GAP_WIDTH + mainScreenHeight}px,
            //             black ${height + GAP_WIDTH + mainScreenHeight}px
            //             )`
            // ],
            // [
            //     this.tooltiptexts['camera-selector'],
            //     searchBarWidth + window.innerWidth / 2 - 200,
            //     25,
            //     `linear-gradient(
            //         to right,
            //         black ${searchBarWidth + window.innerWidth / 2}px,
            //         transparent ${searchBarWidth + window.innerWidth / 2}px
            //         ),
            //         linear-gradient(
            //             to bottom,
            //             black ${height + GAP_WIDTH}px,
            //             white ${height + GAP_WIDTH}px,
            //             white ${height + GAP_WIDTH + mainScreenHeight}px,
            //             black ${height + GAP_WIDTH + mainScreenHeight}px
            //             )`
            // ],
            // [
            //     this.tooltiptexts['scrubber-bar'],
            //     0,
            //     height + GAP_WIDTH + mainScreenHeight - 100,
            //     `linear-gradient(
            //         to bottom,
            //         black ${height + GAP_WIDTH + mainScreenHeight}px,
            //         white ${height + GAP_WIDTH + mainScreenHeight}px,
            //         white ${height + GAP_WIDTH * 2 + mainScreenHeight}px,
            //         black ${height + GAP_WIDTH * 2 + mainScreenHeight}px
            //         )`
            // ],
            // [
            //     this.tooltiptexts['filmstrip'],
            //     0,
            //     height + GAP_WIDTH * 2 + mainScreenHeight - 100,
            //     `linear-gradient(
            //         to bottom,
            //         black ${height + GAP_WIDTH * 2 + mainScreenHeight}px,
            //         grey ${height + GAP_WIDTH * 2 + mainScreenHeight}px,
            //         grey ${height + GAP_WIDTH * 2 + mainScreenHeight + CONFIG_CANVAS_HEIGHT}px,
            //         black ${height + GAP_WIDTH * 2 + mainScreenHeight + CONFIG_CANVAS_HEIGHT}px
            //         )`
            // ],
            // [
            //     this.tooltiptexts['label-canvas'],
            //     0,
            //     height + GAP_WIDTH * 2 + mainScreenHeight + CONFIG_CANVAS_HEIGHT - 100,
            //     `linear-gradient(
            //         to bottom,
            //         black ${height + GAP_WIDTH * 2 + mainScreenHeight + CONFIG_CANVAS_HEIGHT}px,
            //         grey ${height + GAP_WIDTH * 2 + mainScreenHeight + CONFIG_CANVAS_HEIGHT}px
            //         )`
            // ],
        ]
    }
    /**
     * Render tooltips via React.
     */
    render(show) {
        if (show) {
            ReactDOM.render(
                <TooltipPanel />,
                $('.root-tool-tip')[0]
            )
        }
    }
}