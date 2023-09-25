/**
 * ====================================================================================================
 *                                          MAIN SCREEN REACT
 * ====================================================================================================
 * Main Screen React Object.
 */
class MainScreenReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         */
        super(props);
    }
    /**
     * Render Main screen display.
     */
    render() {
        return (
            <div
                className={'main-screen config-general'}>
                <DataPanel />
                <VideoPanel />
            </div>
        );
    }
};

/**
 * ====================================================================================================
 *                                          MAIN SCREEN MANAGER
 * ==================================================================================================== 
 * Manager for main screen panel.
 */
class MainScreenManager {
    /**
     * Constructor.
     */
    constructor() {
        this.dataPanelManager = new DataPanelManager();
        this.videoPanelManager = new VideoPanelManager();
        this.selectorPanelManager = new SelectorPanelManager();
    }
    /**
     * Reset screen as new project is selected.
     */
    reset() {
        // 1. Reset data panel.
        this.dataPanelManager.reset();
        // 2. Reset video panel.
        this.videoPanelManager.reset();
        // 3. Reset selector panel.
        this.selectorPanelManager.reset();
    }
    /**
     * Update display rank as angle is selected.
     */
    updateSelectorAngle(angle) {
        // 1. Set data panel z-index back to 400.
        $('.data-panel-container').css('z-index', 400);
        // 2.2 Set video panel z-index back to 200.
        $('.video-panel').css('z-index', 200);
        // 3. Set x offset and y offset based on angle.
        $('.video-main').css({
            left: `-${((angle - 1) % variableManager.config.COL) * 100}%`,
            top: `-${Math.floor((angle - 1) / variableManager.config.COL) * 100}%`
        });
    }
    /**
     * Render main screen UI via React.
     */
    async render() {
        return new Promise(res => {
            ReactDOM.render(
                <MainScreenReact />,
                $('.root-main-screen')[0]
            );
            res(true);
        })
    }
}
