/**
 * ====================================================================================================
 *                                          PREVIEW REACT
 * ====================================================================================================
 * Video Preview React Object.
 */
class PreviewReact extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Render preview video.
     */
    render() {
        return (
            <div className={'preview-mouse-move'}>
                <div className={'preview-container config'}>
                    <video className={'video-preview config'} muted={true} controls={false} />
                    <div className={'preview-time'}>
                        <span className={'text-info current-time'}>{processManager.processes['s-to-string-ms'](0)}</span>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          PREVIEW MANAGER
 * ====================================================================================================
 * Manager for preview video.
 */
class PreviewManager {
    /**
     * Constructor.
     */
    constructor() {
    }
    /**
     * Set position of the preview and new time.
     * @param {number} left Event page X.
     * @param {String} type Target type.
     */
    setPosition(left, type) {
        // 1. If video is not ready then return
        if (!interfaceManager.readyState) return;
        const prev_width = $('.preview-mouse-move')[0].getBoundingClientRect().width / 2;

        let right_bound;
        let t = 0;
        // 2. Check type, if type is scrubber
        if (type == 'scrubber') {
            right_bound = $('.scrubber-container')[0].getBoundingClientRect().width - prev_width + 20;
            t = left / $('.scrubber-container')[0].getBoundingClientRect().width * $('.video-main')[0].duration;
        }
        // 3. Else if type is ghost or editor.
        else if (type == 'ghost' || type == 'editor') {
            right_bound = document.documentElement.clientWidth - prev_width;
            const true_left = left + $('.data-display-panel')[0].scrollLeft - (document.documentElement.clientWidth / 2);
            t = true_left / variableManager.CONFIG_PIXEL_PER_INTERVAL;
        }
        // 4. Else throw exception is type is neither.
        else {
            throw new KeyException(
                `Type ${type} not found.` +
                `Please contact developer to resolve the issue. `
            );
        }

        // 4.5 Don't show preview if preview is beyond start or end time of video
        if (t < 0 || t > $('.video-main')[0].duration)
        {
            $('.preview-mouse-move').css('display', 'none');
        }
        else
        {
            $('.preview-mouse-move').css('display', 'block');

            // 5. Convert mouse position to preview position that stays in window.
            if (left < prev_width) left = prev_width;
            else if (left > right_bound) left = right_bound;
            $('.preview-mouse-move').css('left', left)
            // 6. Set video preview current time.
            $('.video-preview')[0].currentTime = t < 0 ? t = 0 : t = t;
            // 7. Set video preview current time text.
            $('.current-time.text-info')[0].innerText = processManager.processes['s-to-string-ms'](t);
        }
    }
}