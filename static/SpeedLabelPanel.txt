
/**
 * ====================================================================================================
 *                                          SPEED LABEL REACT
 * ====================================================================================================
 * Label panel React object.
 */
class SpeedLabelsPanelReact extends React.Component {
    constructor(props) {
        super(props);
        processManager.intervalManager.addInterval('annotate');
    }
    /**
     * Render Speed label panel.
     */
    render() {
        return (
            <div className={'speedlabel-container'}>
                <div className={`speed-labeler type-${variableManager.config.SPEED_LABEL_TYPE}`} />
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          SPEED LABEL MANAGER
 * ====================================================================================================
 * Manager for speed label panel.
 */
class SpeedLabelsPanelManager {
    /**
     * Constructor
     */
    constructor() {
        this.left = 0;
    }
    /**
     * Add new label as annotating ended.
     */
    addLabel() {
        // 1. Set user reaction time to pixel values.
        const reaction = processManager.processes['ms-to-pixel'](variableManager.config.REACTION_TIME);
        // 2. Get label width from duration of speed labeling.
        const width = parseFloat($('.speed-labeler').css('width')) - reaction;
        // 3. Generate Id
        let id = processManager.processes['uuidv4']();
        // 4. Add label
        interfaceManager.dataDisplayManager.labels.addLabel(
            new Label(
                // 3.1. Generate random unique ID.
                id,
                // 3.2. Empty text.
                '',
                // 3.3. Type of speed label.
                variableManager.config.SPEED_LABEL_TYPE,
                // 3.4. Start time from left position.
                processManager.processes['pixel-to-ms']($('.speed-labeler').position().left),
                // 3.5. End time from width of speed label.
                processManager.processes['pixel-to-ms']($('.speed-labeler').position().left + width)
            )
        )
        interfaceManager.dataDisplayManager.labelPanelManager.reDisplayCanvas(variableManager.config.SPEED_LABEL_TYPE);
        interfaceManager.mainScreenManager.dataPanelManager.updateLabelDisplay();
        processManager.history.addHistory(
            variableManager.requestCodes.add,
            {
                id: id,
                oldValue: undefined,
                newValue: interfaceManager.dataDisplayManager.labels.getLabelByID(id)
            }
        );
        this.setWidth(0);
    }
    /**
     * Set speed labeler left position.
     * @param {number} left Left position.
     */
    setLeft(left) {
        this.left = left;
        $('.speed-labeler').css({
            width: 0,
            left: left
        })
    }
    /**
     * Set speed labeler width.
     * @param {number} width new Width.
     */
    setWidth(width) {
        $('.speed-labeler').css({
            width: width == 0 ? 0 : width - this.left
        })
    }
    /**
     * Update speed labeler after video loads.
     */
    updateSpeedLabel() {
        $('.speed-labeler').removeClass(function (i, className) {
            return (className.match(/(^|\s)type-\S+/g) || []).join(' ');
        });
        $('.speed-labeler').addClass(`type-${variableManager.config.SPEED_LABEL_TYPE}`)
        if ($(`.type-container.type-${variableManager.config.SPEED_LABEL_TYPE}.darken`)[0] == undefined) return;
        $('.speed-labeler').css({
            top: $(`.type-container.type-${variableManager.config.SPEED_LABEL_TYPE}.darken`)[0].getBoundingClientRect().top -
                $('.speedlabel-container')[0].getBoundingClientRect().top,
            width: 0
        })
    }
}
