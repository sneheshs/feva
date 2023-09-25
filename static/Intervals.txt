/**
 * Manager for Intervals.
 */
class IntervalManager {
    /**
     * Constructor.
     */
    constructor() {
        this.intervals = {}
    }
    /**
     * Add new interval.
     * @param {String} tag Interval type.
     */
    addInterval(tag) {
        this.intervals[tag] = null;
    }
    /**
     * Clears the interval
     * @param {String} tag Interval type.
     */
    stopInterval(tag) {
        window.clearInterval(this.intervals[tag]);
        this.intervals[tag] = null;
    }
    /**
     * Set functionality of tagged interval.
     * @param {String} tag Target.
     * @param {Function} func Function.
     * @param {number} interval Interval timer.
     */
    set(tag, func, interval) {
        this.intervals[tag] = window.setInterval(func, interval)
    }
}