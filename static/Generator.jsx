
/**
 * ====================================================================================================
 *                                      GENERATOR JAVASCRIPT OBJECT
 * ====================================================================================================
 * Generator object.
 */
class Generator {
    /**
     * Constructor
     */
    constructor() {
        this.generator = undefined;
        this.cycle = 0;
        this.context = undefined;
        this.flag = [];
        this.pos = 0;
        this.done = false;
    }
    /**
     * Play generator to draw.
     */
    generate() {
        var promise = this.generator.play();
        if (promise !== undefined) {
            promise.then(function () {
                // Automatic playback started!
            }).catch(function (error) {
                // Automatic playback failed.
            });
        }
    }
    /**
     * Get generator from path.
     * @param {String} path URL path.
     */
    getGenerator(path) {
        $.ajax({
            url: `${path}_generator.mp4`,
            type: 'HEAD',
            error: () => {
                this.generator.src = interfaceManager.pinpointFrameManager.pinpointGenerator.src = `${path}.mp4`;
            },
            success: () => {
                this.generator.src = interfaceManager.pinpointFrameManager.pinpointGenerator.src = `${path}_generator.mp4`;
            }
        });
    }
    /**
     * Get X and Y coordinates of selected canvas and update video offsets.
     * @param {number} angle Canvas number selected.
     */
    getXY(angle) {
        const preview_width = variableManager.config.IMAGE_WIDTH * variableManager.config.VALUE_PREVIEW;
        const preview_height = variableManager.CONFIG_IMAGE_HEIGHT * variableManager.config.VALUE_PREVIEW;
        const px = ((angle - 1) % variableManager.config.COL) * preview_width;
        const py = Math.floor((angle - 1) / variableManager.config.COL) * preview_height;
        // 1. Sets px and py value to preview video.
        $('.video-preview').css({
            left: -px,
            top: -py
        });
        // 2. Sets x and y value based on number of columns, rows, and generator video dimensions.
        return {
            x: ((angle - 1) % variableManager.config.COL) * this.generator.videoWidth / variableManager.config.COL,
            y: Math.floor((angle - 1) / variableManager.config.COL) * this.generator.videoHeight / variableManager.config.ROW
        }
    }
    /**
     * Initialize generator after video html loads.
     */
    initializeGenerator() {
        this.generator = $('.video-generator')[0];
    }
    /**
     * Resets generator to starting position.
     */
    resetGenerator() {
        return new Promise(res => {
            this.generator.pause();
            this.done = false;
            this.generator.currentTime = 0;
            this.cycle = 0;
            this.context = $(`.canvas_0`)[0].getContext('2d');
            this.flag = [];
            this.pos = 0;
            for (let i = 0; i < Math.floor(this.generator.duration / variableManager.CONFIG_INTERVAL); i++) {
                this.flag.push(false);
            }
            res(true)
        })
    }
    /**
     * Set generator drawer.
     * @param {number} x X position of image to be drawn at.
     * @param {number} y Y position of image to be drawn at.
     */
    setGeneratorDrawer(x, y) {
        this.generator.ontimeupdate = () => {
            // 1. If generator current time is still behind duration.
            if (this.generator.currentTime < this.generator.duration) {
                // 1.1. If user navigates away from browser, pause the generator.
                if (document.hidden) {
                    this.generator.pause();
                    return
                };
                // 1.2. If current time is a multiple of CONFIG_INTERVAL, and hasn't been drawn
                if (
                    Math.floor(this.generator.currentTime) % variableManager.CONFIG_INTERVAL == 0 &&
                    !this.flag[Math.floor(this.generator.currentTime / variableManager.CONFIG_INTERVAL)]
                ) {
                    // 1.2.1. Draw image from generator.
                    this.context.drawImage(
                        this.generator,
                        x,
                        y,
                        this.generator.videoWidth / variableManager.config.COL,
                        this.generator.videoHeight / variableManager.config.ROW,
                        this.pos,
                        25,
                        variableManager.config.IMAGE_WIDTH,
                        variableManager.CONFIG_IMAGE_HEIGHT
                    )
                    // 1.2.2. Set section has been drawn.
                    this.flag[Math.floor(this.generator.currentTime / variableManager.CONFIG_INTERVAL)] = true;
                    // 1.2.3. Increase position to be drawn
                    this.pos += variableManager.config.IMAGE_WIDTH;
                    // 1.2.4. If position goes beyond canvas length
                    if (this.pos >= interfaceManager.dataDisplayManager.canvas_length) {
                        // 1.2.4.1. Reset position.
                        this.pos = 0;
                        // 1.2.4.2. Increase canvas cycle.
                        this.cycle++;
                        // 1.2.4.3. Set context to new cycle.
                        this.context = $(`.canvas_${this.cycle}`)[0].getContext('2d');
                    }
                    // 1.2.5. Play generator in case user returned from navigation.
                    var promise = this.generator.play();
                    if (promise !== undefined) {
                        promise.then(function () {
                            // Automatic playback started!
                        }).catch(function (error) {
                            // Automatic playback failed.
                        });
                    }
                }
                // 1.3. Generator current time is increased by half of CONFIG_INTERVAL to prevent skipping interval frame.
                this.generator.currentTime += variableManager.CONFIG_INTERVAL / 2;
                // 1.4. Update grey scrubber bar to indicate progress.
                $(`.scrubber-white`).css({ width: `${this.generator.currentTime / this.generator.duration * 100}%` })
            }
        };
        // 2. Pause generator on video end and set generating to completed.
        this.generator.onended = () => { this.generator.pause(); this.done = true; };
    }
    /**
     * Run generator when angle changes.
     * @param {number} angle Angle.
     */
    async setNewGeneratorAngle(angle) {
        // 1. Get X and Y position.
        const { x, y } = this.getXY(angle);
        // 2. Reset generator
        let res = await this.resetGenerator();
        if (res) {
            // 3. Set generator drawer on reset finish.
            this.setGeneratorDrawer(x, y);
            // 4. Draw.
            this.generate();
        }
    }
}

/**
 * ====================================================================================================
 *                                          GENERATOR MANAGER
 * ====================================================================================================
 * Manager for generator.
 */
class GeneratorManager {
    /**
    * Constructor.
    */
    constructor() {
        this.generator = new Generator();
    }
    /**
     * Set generating.
     * @param {number} angle Canvas angle.
     */
    generateFrames(angle) {
        this.generator.setNewGeneratorAngle(angle);
    }
    /**
     * Render hidden Generator via React.
     */
    render() {
        ReactDOM.render(
            <video className={'video-generator config-generator'} muted={true} />,
            $('.root-generator')[0]
        );
        this.generator.initializeGenerator();
    }
}

