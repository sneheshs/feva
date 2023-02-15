/**
 * ====================================================================================================
 *                                          TRACK CREATOR REACT
 * ====================================================================================================
 * Track creator panel react object.
 */
class TrackCreatorPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Remove color wheel functionality on blur.
     */
    blur() {
        // 1. Hide color wheel on blur.
        $(`.color-wheel`).hide();
        // 2. Remove any functionality from wheel on color change.
        interfaceManager.dataDisplayManager.labelPanelManager.trackCreatorManager.irocolor
            .off('color:change');
    }
    /** 
     * Set color wheel per focus on track creator.
     */
    focus() {
        // 1. Show color wheel
        $(`.color-wheel`).show();
        // 2. Set iroColor to change background on change.
        interfaceManager.dataDisplayManager.labelPanelManager.trackCreatorManager.irocolor
            .on('color:change', function (color) {
                $('.track-creator-add').css({
                    background: color.hexString,
                })
            });
    }
    /**
     * Render track creator panel.
     */
    render() {
        return (
            <div className={'track-creator-panel'}>
                <div className={'track-creator-add'}>
                    <div className={'track-creator-button'}
                        onClick={processManager.buttons['add-new-track']} />
                    <div className={'color-wheel'} id={'color-wheel'} />
                    <input className={'add-track-input'}
                        type={'text'}
                        onFocus={this.focus}
                        onBlur={this.blur}>
                    </input>
                </div>
                <div className={'track-creator-padder'}></div>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          TRACK CREATOR MANAGER
 * ====================================================================================================
 * Manager for track creator.
 */
class TrackCreatorManager {
    /**
     * Constructor.
     */
    constructor() {
        this.irocolor = undefined;
    }
    /**
     * Initialize IRO Colors
     */
    initializeIRO() {
        // 1. Get random color.
        const color = processManager.processes['random-color']();
        // 2. Change track creator background color.
        $('.track-creator-add').css({ background: `#${color}` });
        // 3. Create new IRO color picker and set background.
        this.irocolor = new iro.ColorPicker('#color-wheel', {
            color: `#${color}`,
            borderWidth: 1,
            borderColor: 'white',
            width: 120
        });
        // 4. Set on color change to change track creator background color.
        this.irocolor.on('color:change', function (color) {
            $('.track-creator-add').css({
                background: color.hexString,
            })
        });
    }
    /**
     * Set display after fetching dataset.
     */
    setDisplay() {
        // 1. Set width to be 100%.
        $('.track-creator-panel').css({ width: '100vw' })
    }
}
