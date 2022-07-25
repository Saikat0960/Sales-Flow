/**
 * Common stop watch utility functions for ABP based applications.
 * The stop watch should be started whenever you want to record the timing of an event.
 * Use the lap function to record the split times for any sub steps.
 *
 * for example:
 *
 *      ABP.util.Stopwatch.start();
 *
 *      store.filter({id: 'TextFilter', filterFn: filterFunction});
 *
 *      ABP.util.Stopwatch.lap('Filter Applied');
 *
 *      store.sort('_relevance', 'DESC');
 *
 *      ABP.util.Stopwatch.lap('Store Sorted');
 *      ABP.util.Stopwatch.stop();
 *
 */
Ext.define('ABP.util.Stopwatch', {
    singleton: true,

    startTime: undefined,
    stopTime: undefined,
    laps: [],
    isRunning: false,
    trace: true,
    info: '',

    /**
     * Start the stop watch
     *
     * @param {String} tag The name or tag that will be displayed in the log against the stop watch times
     */
    start: function (tag) {
        if (this.isRunning) {
            return;
        }

        this.laps = [];
        this.startTime = new Date();
        this.stopTime = null;
        this.isRunning = true;
        this.info = tag ? tag : '';
    },

    /**
     * Stop the stop watch and write the output to the trace
     *
     * @returns {Number} the elapsed number of milli seconds the stop watch was running for
     */
    stop: function () {
        if (!this.isRunning) {
            return;
        }

        this.stopTime = new Date();
        this.isRunning = false;

        if (this.trace) {
            ABP.util.Logger.logTrace('[STOP] ' + this.info + ' Elapsed Time(ms): ' + this.elapsed())
        }

        return this.elapsed();
    },

    /**
     * Reset the stopwatch to its initial state, clears all times and lap info
     */
    reset: function () {
        this.laps = [];
        this.startTime = this.isRunning ? new Date() : null;
        this.stopTime = null;
    },

    /**
     * Restarts the stopwatch
     */
    restart: function () {
        this.isRunning = true;
        this.reset();
    },

    /**
     * Returns the number of milli-seconds for the current stop watch.
     * If the stopwatch is running will return the current elapsed value
     *
     * @returns {Number} The number of milli seconds the stop watch is running for or has run for.
     */
    elapsed: function () {
        return (this.isRunning ? new Date() : this.stopTime) - this.startTime;
    },

    /**
     * Write the elapsed time to the ABP trace log
     *
     * @param {String} info any additional information that is to be included in the trace log
     */
    lap: function (info) {
        if (!info) {
            info = 'Lap ' + this.laps.length;
        }

        this.laps.push({ name: info, elapsed: this.elapsed });

        if (this.trace) {
            ABP.util.Logger.logTrace('[' + info + '] ' + this.elapsed() + 'ms')
        }
    }
})
