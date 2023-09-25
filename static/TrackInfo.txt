/**
 * ====================================================================================================
 *                                          TRACK INFO REACT
 * ====================================================================================================
 * Track info panel React object.
 */
class TrackInfoPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Render Track info panel.
     */
    render() {
        return (
            <div className={'track-info-panel'}>
                <button className={'track-info-button'}
                    onClick={interfaceManager.dataDisplayManager.labelPanelManager.trackInfoManager.toggle} />
                <div className={'track-info-contents'} />
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          TRACK INFO MANAGER
 * ====================================================================================================
 * Manager for track info.
 */
class TrackInfoManager {
    /**
     * Constructor.
     */
    constructor() {
    }
    /**
     * Button toggling.
     */
    toggle() {
        // 1. If track is shown, then hide.
        if ($('.track-panel')[0].classList.contains('display')) $('.track-panel').removeClass('display');
        // 2. Else show track panel.
        else $('.track-panel').addClass('display');
    }
    /**
     * Update display panel.
     */
    updateDisplay() {
        // 1. Get list of colors. 
        const colors = processManager.colorManager.getListOfTypes();
        let contents = [];
        // 2. For every color
        for (let i = 0; i < colors.length; i++) {
            // 2.1. Make DIV element.
            let track = document.createElement('div');
            // 2.2. Class name.
            track.className = `track-panel display type-${colors[i]}`;
            // 2.3. Add class active if color is speed label.
            if (colors[i] == variableManager.config.SPEED_LABEL_TYPE) track.className += ' active';
            // 2.4. Add on double click function.
            track.ondblclick = function () {
                // 2.4.1. Remove current active speed label type.
                $(`.track-panel.type-${variableManager.config.SPEED_LABEL_TYPE}`).removeClass('active');
                // 2.4.2. Add new selected speed label type class active.
                $(`.track-panel.type-${colors[i]}`).addClass('active');
                // 2.4.3. Write to config new speed label type.
                variableManager.configs('SPEED_LABEL_TYPE', colors[i]);
                // 2.4.4. Update speed label positioning.
                interfaceManager.dataDisplayManager.speedLabelPanelManager.updateSpeedLabel();
            }
            // 2.5. Add on context menu function.
            track.oncontextmenu = function (e) {
                interfaceManager.contextMenuManager.setPosition(
                    e,
                    'track',
                    $('.menu.track'),
                    { type: colors[i] }
                )
            }
            // 2.6. Add text for track.
            $(track).append(`<span>${processManager.processes['to-capital-letter'](processManager.colorManager.getNameByType(colors[i]))}</span>`)
            $(track).append(`<input class="anchor-box anchor-${colors[i]}" style="margin: 4px 0 0; float: right; height: calc(100% - 6px); width: 25px;" type="checkbox"></input>`)
            contents.push(track);
        }
        // 3. Remove all contents.
        $('.track-info-contents').empty();
        // 4. Add all contents back.
        $('.track-info-contents').append(contents);
    }
}