/**
 * ====================================================================================================
 *                                          NOTIFICATION PANEL REACT
 * ====================================================================================================
 * Notification panel React object.
 */

class NotificationPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className={'notification-message'}>
                    {this.props.message}
                </div>
                <button className={'confirmation-btn'} 
                    type={'button'}
                    onClick={(e) => {
                        interfaceManager.notificationManager.clearTimeout();
                        interfaceManager.notificationManager.hide(); 
                    }}>{'OK'}</button>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          Notification MANAGER
 * ====================================================================================================
 * Manager for notification box at bottom right
 */

class NotificationManager {
    constructor() {
        this.notifyHideTimer = null;
        this.fgcolors = {
            info : 'black',
            error: 'white',
            success: 'white',
            warning: 'black'
        };
        this.bgcolors = {
            info : 'white',
            error: 'red',
            success: 'green',
            warning: 'yellow'
        }
        this.param = {
            type : null, 
            bgcolor : 'white', 
            fgcolor : 'black', 
            timeout : 1500, 
            dontShowButton : false, 
            buttonText : 'OK'
        }
        this.render("");
    }
    
    hide() {
        $('.notifications')[0].style.opacity = 0;
    }

    /**
     * Display notification by custom background and foreground color
     * @param {string} bgcolor - background color of notification box
     * @param {string} fgcolor - foreground/text color of notification box
     */
    displayByColor(bgcolor = 'white', fgcolor = 'black') {
        $('.notifications')[0].style['background-color'] = bgcolor;
        $('.notifications')[0].style['color'] = fgcolor;
        $('.confirmation-btn')[0].style.color = 'black';
        $('.notifications')[0].style.opacity = 1;
    }

    /**
     * 
     * @param {string} type - sets color of message based on type of message
     */
    displayByType(type = 'info') {
        this.displayByColor(this.bgcolors[type], this.fgcolors[type])
    }

    remove() {
        $('.notifications')[0].innerHTML = '';
    }

    /**
     * 
     * @param {string} message - notification message
     * @param {Object} param - contains optional parameters: type, bgcolor, fgcolor, button text, dontShowButton, and timeout time
     */
    show(message, param) {
        this.clearTimeout();

        this.render(message);
        if (param.type) {
            this.displayByType(param.type);
        } else {
            let _bgcolor = param.bgcolor ? param.bgcolor : this.param.bgcolor;
            let _fgcolor = param.fgcolor ? param.fgcolor : this.param.fgcolor;
            this.displayByColor(_bgcolor, _fgcolor);
        }

        let _buttonText = param.buttonText ? param.buttonText : this.param.buttonText;
        let _dontShowButton = param.dontShowButton ? param.dontShowButton : this.param.dontShowButton;
        let _timeout = param.timeout ? param.timeout : this.param.timeout;

        $('.confirmation-btn')[0].innerHTML = _buttonText;
        $('.confirmation-btn')[0].style.display = _dontShowButton ? 'none' : 'block';

        this.notifyHideTimer = setTimeout(interfaceManager.notificationManager.hide, _timeout);
    }

    clearTimeout() {
        if(this.notifyHideTimer) clearTimeout(this.notifyHideTimer);
    }

    render(message) {
        ReactDOM.render(
            <NotificationPanel message={message} />,
            $('.notifications')[0]
        )
    }
}