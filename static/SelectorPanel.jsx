/**
 * ====================================================================================================
 *                                          SELECTOR PANEL REACT
 * ==================================================================================================== 
 * Selector Panel React Object.
 */
class SelectorPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Render Selector Panel display.
     */
    render() {
        let angles = [];
        // 1. For every angle draw selectors.
        for (let i = 1; i <= variableManager.config.ROW * variableManager.config.COL; i++) {
            angles.push(
                <div className={`camera-angle-selector-selection angle-${i}`} key={i.toString()}
                    onClick={() => { interfaceManager.mainScreenManager.selectorPanelManager.setActiveAngle(i); }}>
                </div>
            )
        }
        return (
            <div className={'camera-angle-selector main-panel-elements'}>{angles}</div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          SELECTOR PANEL MANAGER
 * ==================================================================================================== 
 * Manager for selector panel.
 */
class SelectorPanelManager {
    /**
     * Constructor
     */
    constructor() {
        this.activeAngle = undefined;
    }
    /**
     * Reset selector positioning when new project is fetched.
     */
    reset() {
        // 1. If current active angle is undefined, do nothing.
        if (this.activeAngle == undefined) return;
        // 2. Else set current active angle to inactive.
        $(`.selector-image-content.${this.activeAngle}, .angle-${this.activeAngle}`).removeClass('active');
        this.activeAngle = undefined;
    }
    /**
     * Set the specified ID to be selected.
     * @param {number} angle Selector ID.
     */
    setActiveAngle(angle) {
        // 1. Restore to state 1 zoomed in.
        $('.main-panel-elements').removeClass('zoom-out');
        // 2. Set previous angle to inactive.
        if (this.activeAngle != undefined)
            $(`.selector-image-content.${this.activeAngle}, .angle-${this.activeAngle}`).removeClass('active');
        // 3. Set current active angle.
        this.activeAngle = angle;
        // 4. Set new angle to be active.
        $(`.selector-image-content.${this.activeAngle}, .angle-${this.activeAngle}`).addClass('active');
        // 5. Process new angle.
        processManager.processNewAngle(this.activeAngle);
    }
}