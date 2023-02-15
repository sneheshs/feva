/**
 * ====================================================================================================
 *                                          VIDEO PANEL REACT
 * ====================================================================================================
 * Video panel React Object.
 */
class VideoPanel extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         */
        super(props);
        processManager.intervalManager.addInterval('scroll');
    };
    /**
     * Render Video panel display.
     */
    render() {
        return (
            <div className={'video-panel'}>
                <div className={'pad-vertical main-panel-elements'}></div>
                <div className={'central-pad main-panel-elements'}>
                    <VideoUIReact />
                    <div className={'pad-horizontal main-panel-elements'}></div>
                    <div key={'cropper'} className={'cropper config-general main-panel-elements'}>
                        <SelectorPanel />
                        <div key={'keypoints-container'} className={'keypoints-container main-panel-elements'} />
                        <video key={'video-main'} className={'video-main main-panel-elements'}
                            onPlay={() => {
                                processManager.intervalManager.set(
                                    'scroll',
                                    interfaceManager.mainScreenManager.videoPanelManager.onplay,
                                    1000 / variableManager.config.FRAMES_PER_SECOND
                                );
                            }}
                            onPause={() => { processManager.intervalManager.stopInterval('scroll'); }}
                            onEnded={() => { processManager.intervalManager.stopInterval('scroll'); }} />
                    </div>
                    <div className={'pad-horizontal main-panel-elements'}></div>
                </div>
                <div className={'pad-vertical main-panel-elements'}></div>
            </div>
        )
    }
}

/**
 * Video UI React Object.
 */
class VideoUIReact extends React.Component {
    constructor(props) {
        super(props);
    };
    /**
     * Render Video UI display.
     */
    render() {
        let selector_image = [], count = 1;
        // 1. For every ROW
        for (let i = 1; i <= variableManager.config.ROW; i++) {
            let row = [];
            // 1.1. And for every COL
            for (let j = 1; j <= variableManager.config.COL; j++) {
                // 1.1.1. Create selector block.
                row.push(<div key={`col${j.toString()}`} className={`selector-image-content ${count++}`}></div>)
            }
            selector_image.push(<div key={`row${i.toString()}`} className={'selector-image-row'}>{row}</div>)
        }
        return (
            <div>
                <div className={'video-controls-container'}>
                    <div key={"video-current-info"} className={"video-current-info"}>
                        <ScrubberPanel />
                        <PreviewReact />
                        <div className={'video-current time'}>
                            <span className={'text-info time'}></span>
                        </div>
                        <div className={'video-current frame'}>
                            <span className={'text-info frame'}></span>
                        </div>
                        <div key={'selector-image'} className={'selector-image'}
                            onClick={interfaceManager.mainScreenManager.videoPanelManager.displaySelector}>{selector_image}</div>
                    </div>
                    <div className={'video-buttons main-panel-elements'}>
                        <div key={'playrate-display'} className={'playrate-display'}>
                            {`${$('.video-main')[0] != undefined ? $('.video-main')[0].playbackRate : 1}x`}
                        </div>
                        <button className={`video-button rewind`} key={`video-button rewind`}
                            onClick={() => { processManager.buttons['change-rate']($('.video-main')[0].playbackRate - 0.25); }}
                            onKeyDown={(e) => { if (e.nativeEvent.code == 'Enter' || e.nativeEvent.code == 'NumpadEnter') e.preventDefault(); }} />
                        <button className={`video-button fast-forward`} key={`video-button fast-forward`}
                            onClick={() => { processManager.buttons['change-rate']($('.video-main')[0].playbackRate + 0.25); }}
                            onKeyDown={(e) => { if (e.nativeEvent.code == 'Enter' || e.nativeEvent.code == 'NumpadEnter') e.preventDefault(); }} />
                        <button className={`video-button big play`} key={`video-button play-pause`}
                            onClick={processManager.buttons['play-pause']}
                            onKeyDown={(e) => { if (e.nativeEvent.code == 'Enter' || e.nativeEvent.code == 'NumpadEnter') e.preventDefault(); }} />
                        <button className={`video-button skip-previous`} key={`video-button skip-previous`}
                            onClick={() => { processManager.buttons['shift-video-time'](-5); }}
                            onKeyDown={(e) => { if (e.nativeEvent.code == 'Enter' || e.nativeEvent.code == 'NumpadEnter') e.preventDefault(); }} />
                        <button className={`video-button skip-next`} key={`video-button skip-next`}
                            onClick={() => { processManager.buttons['shift-video-time'](5); }}
                            onKeyDown={(e) => { if (e.nativeEvent.code == 'Enter' || e.nativeEvent.code == 'NumpadEnter') e.preventDefault(); }} />
                    </div>

                    
                </div>
                <div className={'playrate-change'}>
                        {`${$('.video-main')[0] != undefined ? $('.video-main')[0].playbackRate : 1}x`}
                </div>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          VIDEO PANEL MANAGER
 * ====================================================================================================
 * Manager for video panel.
 */
class VideoPanelManager {
    /**
     * Constructor
     */
    constructor() {
        this.onplay = () => {
            const main = $('.video-main')[0];
            // 1. Check if video is available.
            if (main.readyState != 4) return;
            // 2. Else scroll data displayer following video current time.
            $('.data-display-panel')[0].scrollLeft = main.currentTime * variableManager.CONFIG_PIXEL_PER_INTERVAL;
            // 3. Update info display per main current time.
            interfaceManager.updateVideoInfo(main.currentTime);
            // 4. If current time goes beyond duration, stop the interval.
            if (main.currentTime >= main.duration) processManager.intervalManager.stopInterval('scroll');
        }
    }
    /**
     * Display selector section.
     */
    displaySelector() {
        // 1. Selects main video, padders, cropper, and center for zoom.
        $('.main-panel-elements').addClass('zoom-out');
        // 2. Reset main video positioning.
        $('.video-main').css({ left: 0, top: 0 });
    }
    /**
     * Reset video source post new project.
     */
    reset() {
        // 1. Remove all active angle.
        $('.active.selector-image-content').removeClass('active');
        // 2. Remove video source
        $('.video-main')[0].src = $('.video-preview')[0].src = $('.video-generator')[0].src = "";
        // 3. Reset inner texts.
        $('.text-info.frame')[0].innerText = $('.text-info.time')[0].innerText = "";
        // 4. Reset playrate display text.
        $('.playrate-display')[0].innerText = "1x";
        $('.playrate-change')[0].innerText = "1x";
        // 5. Reset video positioning to zoom-out
        this.displaySelector();
        // 6. Set video panel z-index.
        $('.video-panel').css('z-index', 200);
    }
    /**
     * Update display time.
     * @param {number} time Video current time.
     */
    updateDisplay(time) {
        // 1. Write frame number to display.
        $('.text-info.frame')[0].innerText =
            `${processManager.processes['current-video-frame'](time)}` +
            ` / ` +
            `${Math.round($('.video-main')[0].duration * variableManager.config.FRAMES_PER_SECOND)}`
        // 2. Write current video time to display.
        $('.text-info.time')[0].innerText =
            `${processManager.processes['s-to-string-ms'](time)}` +
            ` / ` +
            `${processManager.processes['s-to-string-ms']($('.video-main')[0].duration)}`
    }
}