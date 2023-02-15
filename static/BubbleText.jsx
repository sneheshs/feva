/**
 * ====================================================================================================
 *                                          BUBBLE TEXT REACT
 * ====================================================================================================
 * Bubble Text React Object.
 */
class BubbleTextReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         */
        super(props)
        /**
         * Display  : Text box display.
         * Text     : In-text bubble text.
         */
        this.state = {
            display: 'none',
            text: [''],
            left: 0,
            top: 0
        }
        interfaceManager.bubbleTextManager.addReact(this);
    }
    /**
     * Show text.
     */
    show(text) {
        this.setState({
            display: '',
            text: text,
        }, () => {
            this.setState({
                left: (variableManager.windowWidth - parseInt($('.bubble-text').css('width'))) / 2,
                top: (variableManager.windowHeight - parseInt($('.bubble-text').css('height'))) / 2
            })
        })
    }
    /**
     * Toggle click button to hide.
     */
    click() {
        this.setState({
            display: 'none'
        })
    }
    /**
     * Render Main screen display.
     */
    render() {
        let text = [this.state.text[0]];
        for (let i = 1; i < this.state.text.length; i++) {
            text.push(<br key={i.toString()} />)
            text.push(this.state.text[i]);
        }
        return (
            <div
                /**
                 * Height       : Container height.
                 * Left         : Container left position.
                 * Position     : Absolute.
                 * Top          : Container top position
                 * Width        : Container width.
                 */
                style={{
                    display: this.state.display,
                    left: `${this.state.left}px`,
                    position: 'absolute',
                    top: `${this.state.top}px`,
                }}>
                <div
                    className={'bubble-text'}
                    /**
                     * Background   : Text box background.
                     * Border       : Text box border.
                     * Border Radius: Text box corner radius.
                     * Color        : Text box font color.
                     * Font Size    : Text box font size.
                     * Height       : Text box height.
                     * Padding      : Padding.
                     * Position     : Absolute.
                     * Text Align   : Vertical alignment.
                     * Width        : Text box width.
                     * Z Index      : 1000
                     */
                    style={{
                        background: 'black',
                        border: 'white 1px solid',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '12px',
                        padding: '4px',
                        position: 'relative',
                        textAlign: 'left',
                        zIndex: 650
                    }}>
                    {text}
                </div>
                <button
                    /**
                     * Bottom       : Bottom position.
                     * Border Radius: Corner radius.
                     * Height       : Button height.
                     * Line Height  : Horizontal Alignment.
                     * Left         : Left position.
                     * Position     : Absolute.
                     * Text Align   : Vertical Alignment.
                     * Width        : Button width.
                     * Z Index      : 1001
                     */
                    style={{
                        borderRadius: '10px',
                        height: '15px',
                        lineHeight: 1,
                        position: 'absolute',
                        textAlign: 'center',
                        width: '-webkit-fill-available',
                        zIndex: 650
                    }}
                    onClick={this.click.bind(this)}>
                    {'OK'}
                </button>
            </div>
        );
    }
};

/**
 * ====================================================================================================
 *                                          BUBBLE TEXT MANAGER
 * ====================================================================================================
 * Manager for bubble text.
 */
class BubbleTextManager {
    /**
     * Constructor.
     */
    constructor() {
        this.bubbleTextReact = undefined
    }
    /**
     * Add react object.
     * @param {React.Component} reactObject React object.
     */
    addReact(reactObject) {
        this.bubbleTextReact = reactObject;
    }
    /**
     * Show bubble text.
     */
    showMessage(text) {
        // this.bubbleTextReact.show(text);
    }
    /**
     * Render bubble text.
     */
    render() {
        ReactDOM.render(
            <BubbleTextReact />,
            $('.root-bubble-text')[0]
        )
    }
}
