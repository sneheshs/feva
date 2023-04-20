
/**
 * ====================================================================================================
 *                                          GHOST PANEL REACT
 * ====================================================================================================
 * Ghost panel React object.
 */
class GhostPanelReact extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Render ghost panel.
     */
    render() {
        return (
            <div className={'ghost-panel'}
                onMouseDown={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.down(e) }}
                onMouseUp={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.up(e) }}
                onMouseMove={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.move(e) }}
                onMouseEnter={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.enter(e) }}
                onMouseOut={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.out(e) }}
                onDoubleClick={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.doubleclick(e) }}
                onWheel={(e) => { interfaceManager.dataDisplayManager.ghostPanelManager.wheel(e); }}>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          GHOST PANEL MANAGER
 * ====================================================================================================
 * Manager for ghost panel.
 */
class GhostPanelManager {
    /**
     * Constructor
     */
    constructor() {
        this.dragstate = {
            dragging: false,
            prevscroll: 0,
            x: 0
        }
        this.scrolling = undefined;
    }
    /**
     * On mouse double click for ghost panel.
     */
    doubleclick(e) {
        if (!interfaceManager.readyState) return;
        // 1. Get double click position time for video.
        const scroll_left = $('.data-display-panel')[0].scrollLeft + (e.clientX - document.documentElement.clientWidth / 2);
        processManager.seekScroll(scroll_left / variableManager.CONFIG_PIXEL_PER_INTERVAL, "slow");
    }
    /**
     * On mouse down for ghost panel.
     */
    down(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!interfaceManager.readyState) return;
        // 1. Set state to dragging.
        this.dragstate.dragging = true;
        // 2. Save original scroll left position.
        this.dragstate.prevscroll = $('.data-display-panel')[0].scrollLeft;
        // 3. Save original click position.
        this.dragstate.x = e.pageX;
        // 4. Make panel full screen.
        $('.ghost-panel').addClass('fullscreen');
    }
    /**
     * On mouse enter for ghost panel.
     */
    enter(e) {
        if (!interfaceManager.readyState) return;
        // 1. Move preview element to Data Display panel.
        $('.preview-mouse-move').detach().appendTo('.data-display-panel')
        // 2. Set preview position.
        interfaceManager.previewManager.setPosition(e.pageX, 'ghost');
    }
    /**
     * On mouse move for ghost panel.
     */
    move(e) {
        e.stopPropagation();
        if (!interfaceManager.readyState) return;
        // 1. Set preview position
        interfaceManager.previewManager.setPosition(e.pageX, 'ghost');
        // 2. If not dragging, return
        if (!this.dragstate.dragging) return;
        // 3. Else scroll display panel.
        $('.data-display-panel')[0].scrollLeft = this.dragstate.prevscroll + this.dragstate.x - e.pageX;
        // 4. Update video info display.
        interfaceManager.updateVideoInfo($('.data-display-panel')[0].scrollLeft / variableManager.CONFIG_PIXEL_PER_INTERVAL);
    }
    /**
     * On mouse out for ghost panel.
     */
    out(e) {
        if (!interfaceManager.readyState) return;
        // 1. Return preview to video current info as mouse left panel.
        $('.preview-mouse-move').detach().appendTo('.video-current-info');
    }
    /**
     * On mouse up for ghost panel.
     */
    up(e) {
        e.stopPropagation();
        if (!interfaceManager.readyState) return;
        // 1. Set dragging to false as mouse up.
        this.dragstate.dragging = false;
        // 2. Set panel out of fullscreen.
        $('.ghost-panel').removeClass('fullscreen');
        // 3. Set video main time to match with scroll.
        $('.video-main')[0].currentTime = $('.data-display-panel')[0].scrollLeft / variableManager.CONFIG_PIXEL_PER_INTERVAL;
    }
    /**
     * On mouse wheel for ghost panel.
     */
    wheel(e) {
        // Source: https://stackoverflow.com/questions/10744645/detect-touchpad-vs-mouse-in-javascript
        // 0. Source device? Mouse? TrackPad?
        let isTouchPad = e.nativeEvent.wheelDeltaY ? e.nativeEvent.wheelDeltaY === -3 * e.nativeEvent.deltaY : e.nativeEvent.deltaMode === 0;

        // 1. If video is not ready return.
        if (!interfaceManager.readyState) return
        // 2. Else remove scrolling timout for video sync.
        window.clearTimeout(this.scrolling);
        // 3. If CTRL is held
        if (e.ctrlKey) {
            // Check for min and max
            if (e.deltaY > 0 && Math.pow(2, parseInt(variableManager.config.VALUE_INTERVAL) - 1) < 0.5)
            {}
            else if( e.deltaY < 0 && Math.pow(2, parseInt(variableManager.config.VALUE_INTERVAL) + 1) > 128)
            {}
            else
            {
                console.log(e.deltaY);
                // 3.1. Scroll up 
                if (e.deltaY < 0) {
                    // 3.1.1. Increase interval
                    variableManager.configs('VALUE_INTERVAL', parseInt(variableManager.config.VALUE_INTERVAL) + 1);
                } else {
                    // 3.1.2. Decrease interval
                    variableManager.configs('VALUE_INTERVAL', parseInt(variableManager.config.VALUE_INTERVAL) - 1);
                }
                
                // 3.2. Change option text.
                $('.option-font.value.interval').text(Math.pow(2, parseInt(variableManager.config.VALUE_INTERVAL)));
                // 3.3. Change slider value.
                $('.slider-interval').val(variableManager.config.VALUE_INTERVAL);
                // 3.4. Run slider function.
                interfaceManager.toolbarManager.sliders.interval.func();
            }
        }
        // 4. Else if not
        else {
            let sign = "+";

            if (isTouchPad)
            {
                // 4.1.1 Find dominant scroll up/down or left/right
                if(Math.abs(e.deltaY) > Math.abs(e.deltaX))
                {
                    // 4.1.2 Get scroll direction sign.
                    sign = e.deltaY < 0 ? "+" : '-';
                }
                else
                {
                    // 4.1.2 Get scroll direction sign.
                    sign = e.deltaX < 0 ? "-" : '+';
                }
            }
            else
            {
                // 4.1 Get scroll up or down sign.
                sign = e.deltaY < 0 ? "+" : '-';
            }

            // 4.2. Scroll data display to appropriate scroll.
            $('.data-display-panel')[0].scrollLeft += parseInt(sign + 50);
            const c_time = $('.data-display-panel')[0].scrollLeft / variableManager.CONFIG_PIXEL_PER_INTERVAL;
            // 4.3. Update video display info
            interfaceManager.updateVideoInfo(c_time);
            // 4.4. Set timeout for scrolling to prevent video update every scroll clicks.
            this.scrolling = window.setTimeout(function () {
                $('.video-main')[0].currentTime = c_time;
            }, 500);
        }
    }
}
