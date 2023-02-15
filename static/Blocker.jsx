
/**
 * ====================================================================================================
 *                                          BLOCKER REACT
 * ==================================================================================================== 
 * Blocker React Object.
 */
class BlockerReact extends React.Component {
    constructor(props) {
        /**
         * Props
         * #####
         */
        super(props);
    }
    /**
     * Render blocker.
     */
    render() {
        return (
            <div
                className={'blocker hidden'}>
                <span className={'text-info blocker-text'}>
                    {'Select Camera'}
                </span>
            </div>
        )
    }
}

/**
 * ====================================================================================================
 *                                          BLOCKER MANAGER
 * ==================================================================================================== 
 * Manager for blocker.
 */
class BlockerManager {
    /**
     * Constructor
     */
    constructor() {
    }
    /**
     * Render blocker via React.
     */
    render() {
        ReactDOM.render(
            <BlockerReact />,
            $('.root-blocker')[0]
        );
    }
}