/**
 * ====================================================================================================
 *                                              SCRUBBER REACT
 * ====================================================================================================
 * Scrubber Panel React Object.
 */
class ScrubberPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Render scrubber panel.
     */
    render() {
        return (
            <div
                className={'scrubber-panel'}
                onMouseDown={(e) => { interfaceManager.scrubberManager.seek(e); }}
                onMouseUp={() => { interfaceManager.scrubberManager.mouseDown = false }}
                onMouseMove={(e) => { interfaceManager.scrubberManager.move(e); }}>
                <div className={'video-interval-container'}>
                    <div className={'time-box container'}>
                        <div className={'time-box interval'} />
                    </div>
                    <div className={'red-dot'} />
                </div>
                <div className={'scrubber-container'}>
                    <div className={'scrubber-bar'}>
                        <div className={`scrubber-red`} />
                        <div className={`scrubber-white`} />
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                              SCRUBBER REACT
 * ====================================================================================================
 * Manager for scrubber bar.
 */
class ScrubberManager {
    /**
     * Constructor.
     */
    constructor() {
        this.mouseDown = false;
    }
    /**
     * On mouse move for scrubber panel.
     */
    move(e) {
        const true_left = Math.floor(e.pageX - $('.scrubber-panel')[0].getBoundingClientRect().left);
        // 1. Set video preview to mouse position.
        interfaceManager.previewManager.setPosition(true_left, 'scrubber');
        e.stopPropagation();
        // 2. If mouse is not held down return.
        if (!this.mouseDown) return;
        // 3. Else seek video as mouse move.
        const time_ratio = true_left / $('.scrubber-panel')[0].getBoundingClientRect().width;
        processManager.seekScroll(time_ratio * $('.video-main')[0].duration, 'instant');
    }
    /**
     * On click for scrubber panel to jump to a time.
     */
    seek(e) {
        // 1. If not left click return.
        if (e.button != 0) return;
        if (!interfaceManager.readyState) return;
        this.mouseDown = true;
        // 2. Set current preview video to mouse position time.
        const true_left = Math.floor(e.pageX - $('.scrubber-panel')[0].getBoundingClientRect().left);
        const time_ratio = true_left / $('.scrubber-panel')[0].getBoundingClientRect().width;
        processManager.seekScroll(time_ratio * $('.video-main')[0].duration, 'fast');
    }
    /**
     * Update display post interval changes.
     */
    updateDisplay() {
        // 1. Update time box width based on window width coverage of frame canvas and video duration.
        const coverage = document.documentElement.clientWidth / variableManager.CONFIG_PIXEL_PER_INTERVAL;
        const percentage = coverage / $('.video-main')[0].duration * 100;
        $('.time-box.container').css('width', `${percentage}%`);
        // 2. Update scrubber bar display.
        this.updateScrubberDisplay($('.video-main')[0].currentTime / $('.video-main')[0].duration)
    }
    /**
     * Update scrubber display.
     * @param {number} ratio Time ratio.
     */
    updateScrubberDisplay(ratio) {
        // 1. Update scrubber red bar width per ratio.
        $('.scrubber-red').css('width', `${100 * ratio}%`);
        // 2. Update video interval container left per ratio.
        $('.video-interval-container').css('left', `${ratio * 100}%`)
    }
}