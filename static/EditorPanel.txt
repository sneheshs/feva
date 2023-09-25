
/**
 * ====================================================================================================
 *                                          EDITOR PANEL REACT
 * ====================================================================================================
 * Editor panel React object.
 */
class EditorPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Render Editor panel.
     */
    render() {
        return (
            <div className={'editor-lines'}>
                <div className={'left-line editor-line hidden'} />
                <div className={'right-line editor-line hidden'} />
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          EDITOR PANEL MANAGER
 * ====================================================================================================
 * Manager for editor panel.
 */
class EditorPanelManager {
    /**
     * Constructor
     */
    constructor() {
    }
    /**
     * Hide editor lines
     */
    hideEditorLines() {
        // 1. Re align lines back to middle of screen.
        $('.editor-lines').css({
            left: '50vw',
            width: 0
        });
        // 2. Hide left line.
        $('.left-line').addClass('hidden');
        // 3. Hide right line.
        $('.right-line').addClass('hidden');
    }
    /**
     * Set lines.
     * @param {{}} target Target type.
     */
    setEditorLines(target) {
        // 1. If target is left line
        if (target.line == 'left') {
            // 1.1. Show left line.
            $('.left-line').removeClass('hidden');
            // 1.2. Hide right line.
            $('.right-line').addClass('hidden');
        }
        // 2. If target is right line.
        else if (target.line == 'right') {
            // 2.1. Hide left line.
            $('.left-line').addClass('hidden');
            // 2.2. Show right line.
            $('.right-line').removeClass('hidden');
        }
        // 3. If target is middle.
        else {
            // 3.1. Show both lines.
            $('.left-line').removeClass('hidden');
            $('.right-line').removeClass('hidden');
        }
        // 4. Readjust starting position for lines.
        $('.editor-lines').css({
            left: `calc(50vw + ${target.position}px)`,
            width: target.width
        })
    }
    /**
     * Update height.
     */
    updateHeight() {
        // 1. Set eidtor line height to match with label panel.
        //$('.editor-line').css('height', $('.labels-panel')[0].scrollHeight);
        $('.editor-line').css('height', variableManager.CONFIG_CANVAS_HEIGHT + parseInt($('.labels-panel').css('height')));
    }
}
