
/**
 * ====================================================================================================
 *                                          KEYPOINTS REACT
 * ====================================================================================================
 * Keypoints Panel React object.
 */
class KeypointsPanelReact extends React.Component {
    constructor(props) {
        /**
         * Props
         */
        super(props);
        /**
         * Exists       : Keypoints exists.
         * Points       : List of points.
         * Joints       : List of joints.
         */
        this.state = {
            exists: false,
            points: [],
            joints: []
        }
        interfaceManager.keypointsManager.addPanelReact(this);
    }
    /**
     * Draw keypoints.
     * @param {[]} keypoints List of keypoints.
     */
    drawKeypoints(keypoints) {
        let boundingbox = {
            minX: 100000,
            minY: 100000,
            maxX: 0,
            maxY: 0
        }
        let points = [];
        const coords = keypoints;
        if (coords == undefined) return;

        for (let i = 0; i < coords.length; i += 2) {
            points.push(
                <PointReact
                    key={i.toString()}
                    coords={{
                        x: coords[i],
                        y: coords[i + 1]
                    }} />
            )
            if (coords[i] > 0 && coords[i + 1] > 0) {
                if (coords[i] < boundingbox.minX) {
                    boundingbox.minX = coords[i];
                }
                if (coords[i + 1] < boundingbox.minY) {
                    boundingbox.minY = coords[i + 1];
                }
                if (coords[i] > boundingbox.maxX) {
                    boundingbox.maxX = coords[i];
                }
                if (coords[i + 1] > boundingbox.maxY) {
                    boundingbox.maxY = coords[i + 1];
                }
            }
        }

        let joints = [];
        if (coords.length > 1 && coords != undefined) {
            for (let i = 0; i < variableManager.jointslist.length; i++) {
                if (
                    coords[variableManager.jointslist[i][0] * 2] > 0 &&
                    coords[variableManager.jointslist[i][0] * 2 + 1] > 0 &&
                    coords[variableManager.jointslist[i][1] * 2] > 0 &&
                    coords[variableManager.jointslist[i][1] * 2 + 1] > 0
                ) {
                    joints.push(
                        <JointReact
                            key={i.toString()}
                            coords={{
                                x1: coords[variableManager.jointslist[i][0] * 2],
                                y1: coords[variableManager.jointslist[i][0] * 2 + 1],
                                x2: coords[variableManager.jointslist[i][1] * 2],
                                y2: coords[variableManager.jointslist[i][1] * 2 + 1]
                            }} />
                    )
                }
            }
            let NOSE = 0;
            let NECK = 1;
            let L_EYE = 15;
            let R_EYE = 16;
            let x_offset = Math.sqrt(
                Math.pow((coords[L_EYE * 2] - coords[R_EYE * 2]), 2) +
                Math.pow((coords[L_EYE * 2 + 1] - coords[R_EYE * 2 + 1]), 2));
            let y_offset = Math.sqrt(
                Math.pow((coords[NOSE * 2] - coords[NECK * 2]), 2) +
                Math.pow((coords[NOSE * 2 + 1] - coords[NECK * 2 + 1]), 2)) / 4;
            joints.push(<JointReact
                key={'100'}
                coords={{
                    x1: boundingbox.minX - x_offset,
                    y1: boundingbox.minY - 2.5 * y_offset,
                    x2: boundingbox.minX - x_offset,
                    y2: boundingbox.maxY + y_offset
                }} />)
            joints.push(<JointReact
                key={'101'}
                coords={{
                    x1: boundingbox.minX - x_offset,
                    y1: boundingbox.minY - 2.5 * y_offset,
                    x2: boundingbox.maxX + x_offset,
                    y2: boundingbox.minY - 2.5 * y_offset
                }} />)
            joints.push(<JointReact
                key={'102'}
                coords={{
                    x1: boundingbox.maxX + x_offset,
                    y1: boundingbox.maxY + y_offset,
                    x2: boundingbox.minX - x_offset,
                    y2: boundingbox.maxY + y_offset
                }} />)
            joints.push(<JointReact
                key={'103'}
                coords={{
                    x1: boundingbox.maxX + x_offset,
                    y1: boundingbox.maxY + y_offset,
                    x2: boundingbox.maxX + x_offset,
                    y2: boundingbox.minY - 2.5 * y_offset
                }} />)
        }
        this.setState({
            points: points,
            joints: joints
        })
    }
    /**
     * Render keyppoints panel.
     */
    render() {
        return (
            this.state.exists &&
            <div>
                <PointsPanel
                    points={this.state.points} />
                <JointsPanel
                    joints={this.state.joints} />
            </div>
        )
    }
}

/**
 * Points Panel react object.
 */
class PointsPanel extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         * Points       : List of points
         */
        super(props);
        /**
         * Display      : Display keypoints.
         * Points       : List of points.
         */
        this.state = {
            display: variableManager.config.SHOW_KEYPOINTS == 1 ? '' : 'none',
            points: this.props.points
        }
    }
    /**
     * When new points updated.
     * @param {React.Props} prevProps Previous props.
     */
    componentDidUpdate(prevProps) {
        if (prevProps.points != this.props.points) {
            this.setState({
                points: this.props.points
            })
        }
    }
    /**
     * Render keypoints.
     */
    render() {
        return (
            <div
                className={'container-points'}
                /**
                 * Display      : Keypoints display.
                 * Position     : Absolute.
                 * Z Index      : 1.
                 */
                style={{
                    display: this.state.display,
                    position: 'absolute',
                    zIndex: 230
                }}>
                {this.state.points}
            </div>
        )
    }
}

/**
 * Points react object.
 */
class PointReact extends React.Component {
    constructor(props) {
        /**
         * Props.
         * #####
         * Coords       : x and y coordinates.
         */
        super(props);
        /**
         * X        : X coordinate.
         * Y        : Y coordinate.
         */
        this.state = {
            x: this.props.coords.x,
            y: this.props.coords.y
        }
    }
    /**
     * Add listener to class 'cropper'. When window size change
     * force update the points component to sync with window size.
     */
    componentDidMount(){
        let res= new ResizeObserver(entries =>{
            this.forceUpdate()
        })
        res.observe(document.getElementsByClassName('cropper')[0])
    }
    /**
     * When new points updated.
     * @param {React.Props} prevProps Previous props.
     */
    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            this.setState({
                x: this.props.coords.x,
                y: this.props.coords.y
            })
        }
    }
    /**
     * Render points.
     */
    render() {
        if (this.state.x == 0 && this.state.y == 0) return <div></div>;
        // Coordinates are adjusted based on the aspect ratio and the panel offset
        let left = (this.state.x * (($('.cropper')[0].getBoundingClientRect().width) / (variableManager.videoMetaData.width/variableManager.config.COL))) + ($('.pad-horizontal')[0].getBoundingClientRect().width/ (variableManager.videoMetaData.width/variableManager.config.COL));
        let top = (this.state.y * (($('.cropper')[0].getBoundingClientRect().height) / (variableManager.videoMetaData.height/variableManager.config.ROW))) - ($('.pad-vertical')[0].getBoundingClientRect().height/ (variableManager.videoMetaData.height/variableManager.config.ROW));
        let radius = 3 * variableManager.config.VALUE_KEYPOINTS / 2;
        return (
            <div
                /**
                 * Background       : Keypoints color.
                 * Border Radius    : Circle.
                 * Height           : Circle height.
                 * Left             : X position.
                 * Position         : Absolute.
                 * Top              : Y position.
                 * Width            : Circle width.
                 */
                style={{
                    background: variableManager.config.COLOR_KEYPOINTS,
                    borderRadius: '50%',
                    height: `${3 * variableManager.config.VALUE_KEYPOINTS}px`,
                    left: `${left}px`,
                    margin: `-${radius}px 0px 0px -${radius}px`,
                    position: 'absolute',
                    top: `${top}px`,
                    width: `${3 * variableManager.config.VALUE_KEYPOINTS}px`
                }} />
        )
    }
}

/**
 * Joints Panel react object.
 */
class JointsPanel extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         * Joints       : List of joints.
         */
        super(props);
        /**
         * Display      : Display lines.
         * Joints       : List of joints.
         */
        this.state = {
            display: variableManager.config.SHOW_LINES == 1 ? '' : 'none',
            joints: this.props.joints
        }
    }
    /**
     * Add listener to class 'cropper'. When window size change
     * force update the SVG to sync with window size.
     */
    componentDidMount(){
        let res= new ResizeObserver(entries =>{
            this.forceUpdate()
        })
        res.observe(document.getElementsByClassName('cropper')[0])
    }

    /**
    * When new points updated.
    * @param {React.Props} prevProps Previous props.
    */
    componentDidUpdate(prevProps) {
        if (prevProps.joints != this.props.joints) {
            this.setState({
                joints: this.props.joints
            })
        }
    }
    /**
     * Render joints panel.
     */
    render() {
        return (
            <svg
                className={'container-joints'}
                //Use cropper (main video panel) dimensions as height and width
                //for svg dimensions.
                height = {$('.cropper')[0].getBoundingClientRect().height}
                width = {$('.cropper')[0].getBoundingClientRect().width}
                /**
                 * Display      : Keypoints display.
                 * Position     : Absolute.
                 * Z Index      : 1.
                 */
                style={{
                    display: this.state.display,
                    position: 'absolute',
                    zIndex: 230,
                    pointerEvents: 'none'
                }}>
                {this.state.joints}
            </svg>
        )
    }
}

/**
 * Joints react object.
 */
class JointReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         * Coords   : X and Y coordinates of line.
         */
        super(props);
        /**
         * X1       : X coordinate of point 1.
         * Y1       : Y coordinate of point 1.
         * X2       : X coordinate of point 2.
         * Y2       : Y coordinate of point 2.
         */
        this.state = {
            x1: this.props.coords.x1,
            y1: this.props.coords.y1,
            x2: this.props.coords.x2,
            y2: this.props.coords.y2
        }
    }
    /**
     * Add listener to class 'cropper'. When window size change
     * force update the joints component to sync with window size.
     */
    componentDidMount(){
        let res= new ResizeObserver(entries =>{
            this.forceUpdate()
        })
        res.observe(document.getElementsByClassName('cropper')[0])
    }
    /**
     * When new points updated.
     * @param {React.Props} prevProps Previous props.
     */
    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            this.setState({
                x1: this.props.coords.x1,
                y1: this.props.coords.y1,
                x2: this.props.coords.x2,
                y2: this.props.coords.y2
            })
        }
    }
    /**
     * Render joints line.
     */
    render() {
        return (
            <line
            // Coordinates are adjusted based on the aspect ratio and the panel offset
                x1={(this.state.x1 * (($('.cropper')[0].getBoundingClientRect().width) / (variableManager.videoMetaData.width/variableManager.config.COL))) + 
                    ($('.pad-horizontal')[0].getBoundingClientRect().width/ (variableManager.videoMetaData.width/variableManager.config.COL))}
                y1={(this.state.y1 * (($('.cropper')[0].getBoundingClientRect().height) / (variableManager.videoMetaData.height/variableManager.config.ROW))) - 
                    ($('.pad-vertical')[0].getBoundingClientRect().height/ (variableManager.videoMetaData.height/variableManager.config.ROW))}
                x2={(this.state.x2 * (($('.cropper')[0].getBoundingClientRect().width) / (variableManager.videoMetaData.width/variableManager.config.COL))) + 
                    ($('.pad-horizontal')[0].getBoundingClientRect().width/ (variableManager.videoMetaData.width/variableManager.config.COL))}
                y2={(this.state.y2 * (($('.cropper')[0].getBoundingClientRect().height) / (variableManager.videoMetaData.height/variableManager.config.ROW))) - 
                    ($('.pad-vertical')[0].getBoundingClientRect().height/ (variableManager.videoMetaData.height/variableManager.config.ROW))}
                stroke={variableManager.config.COLOR_KEYPOINTS} />
        )
    }
}

/**
 * ====================================================================================================
 *                                          KEYPOINTS MANAGER
 * ====================================================================================================
 * Manager for keypoints display.
 */
class KeypointsManager {
    /**
     * Constructor.
     */
    constructor() {
        this.keypointsReact = undefined;
    }
    /**
     * Add react object.
     * @param {React.Component} reactObject React object.
     */
    addPanelReact(reactObject) {
        this.keypointsReact = reactObject;
    }
    /**
     * Draw keypoints.
     * @param {[]} keypoints Keypoints list.
     */
    drawKeypoints(frame) {
        this.keypointsReact.drawKeypoints(interfaceManager.toolbarManager.projectManager.currentProject.keypoints.list[frame]);
    }
    /**
     * Set keypoints to exists.
     * @param {boolean} exists Keypoints exists
     */
    setKeypoints(exists) {
        this.keypointsReact.setState({
            exists: exists
        })
    }
    /**
     * Render keypoints display via React.
     */
    render() {
        ReactDOM.render(
            <KeypointsPanelReact />,
            $('.keypoints-container')[0]
        );
    }
}





























