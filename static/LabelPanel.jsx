
/**
 * ====================================================================================================
 *                                          LABEL PANEL REACT
 * ====================================================================================================
 * Label panel React object.
 */
class LabelsPanelReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         */
        super(props);
    }
    /**
     * Render Label panel.
     */
    render() {
        return (
            <div
                className={'labels-panel'}>
                <AudioWaves />
                <TrackInfoPanel />
                <LabelEditorPanel />
                <LabelCanvasPanel />
                <TrackCreatorPanel />
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          LABEL PANEL MANAGER
 * ====================================================================================================
 * Manager for label panel.
 */
class LabelPanelManager {
    /**
     * Constructor
     */
    constructor() {
        this.trackInfoManager = new TrackInfoManager();
        this.labelCanvasManager = new LabelCanvasManager();
        this.editorPanelManager = new EditorPanelManager();
        this.labelEditorManager = new LabelEditorManager();
        this.trackCreatorManager = new TrackCreatorManager();
    }
    /**
     * Draw all labels.
     */
    processDataset() {
        this.updateDisplayLabelPanel();
        interfaceManager.dataDisplayManager.updateTimelineHeight();
        this.editorPanelManager.updateHeight();
        this.trackCreatorManager.setDisplay();
    }
    /**
     * Redisplay label canvas.
     * @param {number} canvas Label canvas type.
     */
    reDisplayCanvas(canvas) {
        this.labelCanvasManager.reDisplayCanvas(canvas);
    }
    /**
     * Reset display
     */
    reset() {
        $('.track-info-contents').empty();
        this.labelCanvasManager.clearDisplay();
    }
    /**
     * Update canvas by type.
     */
    updateCanvas() {
        this.labelCanvasManager.updateCanvas();
    }
    /**
     * Update display panel for track and canvas.
     */
    updateDisplayLabelPanel() {
        this.trackInfoManager.updateDisplay();
        this.labelCanvasManager.updateCanvas();
    }
}







