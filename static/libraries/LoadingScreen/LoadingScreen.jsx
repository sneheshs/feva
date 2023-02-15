/**
 * ====================================================================================================
 *                                          LOADING SCREEN REACT
 * ====================================================================================================
 */
const LoadingScreen = ({ info }) => {
    const children = info.map((id) => {
        return (<ProgressBarReact key={id.toString()} id={id} />);
    });
    return (
        <div className={'loading-screen'}>
            {children}
        </div>
    )
};

const ProgressBarReact = ({ id }) => {
    return (
        <div className={`progress-bar-container`}>
            <div className={`progress-bar ${id}`} />
        </div>
    );
};

/**
 * ====================================================================================================
 *                                  LOADING SCREEN JAVASCRIPT OBJECTS
 * ====================================================================================================
 * Progress Bar object.
 */
class ProgressBar {
    /**
     * Progress Bar Object constructor
     * @param {String} id Progress bar ID.
     */
    constructor(id) {
        this.id = id;
        this.done = false;
    }
    /**
     * Check if progress is done.
     */
    checkDone() {
        return this.done;
    };
    /**
     * Reset current progress back to 0.
     */
    resetCompletion() {
        this.done = false;
        $(`.progress-bar.${this.id}`).css({
            background: '',
            width: '0%'
        })
        $(`.progress-bar.${this.id}`)[0].innerText = '';
    };
    /**
     * Set the completion of the specified progress bar ID.
     * @param {String} tag Progress Bar ID.
     * @param {number} progress Progress Bar progress.
     * @param {String} msg Progress completion text.
     */
    setCompletion(percent, msg) {
        if (percent == 100) {
            this.done = true;
            $(`.progress-bar.${this.id}`).css({
                background: '#4CAF50',
                width: '100%'
            })
            $(`.progress-bar.${this.id}`)[0].innerText = msg;
        } else if (percent == 50) {
            this.done = true;
            $(`.progress-bar.${this.id}`).css({
                background: '#D40000',
                width: '100%'
            })
            $(`.progress-bar.${this.id}`)[0].innerText = msg;
        } else {
            throw new LoadingException(
                `No valid percentage value for loading screen found. ` +
                `Please contact developer if this problem persists. `
            );
        };
    };
};
/**
 * ====================================================================================================
 *                                      LOADING SCREEN MANAGERS
 * ====================================================================================================
 * Manager for displaying loading screen and progress screen.
 */
class LoadingScreenManager {
    /**
     * Constructor.
     * @param {Array} load Loading screen data.
     * @param {Array} process Processing screen data.
     */
    constructor(load, process) {
        this.loadingscreendata = load;
        this.processingscreendata = process;
        this.progresses = {};
        this.screenState = {
            loading: 0,
            process: 0
        };
        this.safetyBounds = 60;
        this.initializeProgressBars();
    };

    // CORE
    /**
     * Create progress bar objects for every ids.
     */
    initializeProgressBars() {
        for (let i in this.loadingscreendata) {
            this.progresses[this.loadingscreendata[i]] = new ProgressBar(this.loadingscreendata[i]);
        }
        for (let i in this.processingscreendata) {
            this.progresses[this.processingscreendata[i]] = new ProgressBar(this.processingscreendata[i]);
        }
    };
    /**
     * Set the completion of the specified progress bar ID.
     * @param {String} tag Progress Bar ID.
     * @param {number} progress Progress Bar progress.
     * @param {String} msg Progress completion text.
     */
    setCompletion(tag, progress, msg) {
        this.progresses[tag].setCompletion(progress, msg);
    };

    // FUNCTIONS
    /**
     * Check loading screen and remove if it is completed.
     */
    processLoadingScreen() {
        if (
            this.progresses['progress-toolbar'].checkDone() &&
            this.progresses['progress-mainscreen'].checkDone()
        ) {
            this.screenState.loading = 0;
            window.setTimeout(() => {
                $('.root-loading-screen').remove();
            }, 1000);
        } else if (this.screenState.loading >= this.safetyBounds) {
            throw new LoadingException(
                `Loading screen stuck. Please refresh the page and try again. ` +
                `Please contact developer if this problem persists. `
            );
        } else {
            window.setTimeout(() => {
                this.screenState.loading += 1;
                this.processLoadingScreen();
            }, 1000);
        };
    };
    /**
    * Check processing screen and hide it if it is completed.
    */
    processProcessingScreen() {
        if (
            this.progresses['progress-fetch-video'].checkDone() &&
            this.progresses['progress-fetch-generator'].checkDone() &&
            this.progresses['progress-fetch-keypoints'].checkDone()
        ) {
            this.screenState.process = 0;
            window.setTimeout(function () {
                $('.root-processing-screen').hide();
            }, 1000);
        } else if (this.screenState.process >= this.safetyBounds) {
            throw new LoadingException(
                `Loading screen stuck. Please refresh the page and try again. ` +
                `Please contact developer if this problem persists. `
            );
        } else {
            window.setTimeout(() => {
                this.screenState.process += 1;
                this.processProcessingScreen();
            }, 1000);
        };
    };
    /**
     * Reset all progress to 0 for processing screen.
     */
    resetProcessingScreen() {
        this.screenState.process = 0;
        this.progresses['progress-fetch-video'].resetCompletion();
        this.progresses['progress-fetch-generator'].resetCompletion();
        this.progresses['progress-fetch-keypoints'].resetCompletion();
        $('.root-processing-screen').show();
    };

    // RENDER
    /**
     * Render screen progress via React and video progress.
     * Set video progress screen to be hidden.
     */
    render() {
        ReactDOM.render(
            <LoadingScreen info={this.loadingscreendata} />,
            $('.root-loading-screen')[0]
        );
        ReactDOM.render(
            <LoadingScreen info={this.processingscreendata} />,
            $('.root-processing-screen')[0]
        );
        $('.root-processing-screen').hide();
    };
};