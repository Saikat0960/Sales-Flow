/**
 * The logger utility class should be used to record events that can be recalled by the user from the log user interface
 */
Ext.define('ABP.util.Logger', {
    singleton: true,
    alternateClassName: 'ABPLogger',

    requires: [
        'ABP.store.ABPLoggingStore'
    ],

    initialized: false,

    _store: undefined,

    _enabled: false,

    MAX_RECORDS: 500,

    /**
     * Initialises a new instance of the Logger class
     *
     * @private
     */
    constructor: function () {
        this._store = Ext.create('ABP.store.ABPLoggingStore');

        // Handle uncaught JavaScript exceptions.
        //        window.onerror = this.handleException;

        // Handle Ext.Error being raised.
        //        Ext.Error.handle = this.handleError;
    },


    /**
     * Gets the current date and time as a ISO string
     *
     * @returns [String] The ISO formatted string containing the current date and time
     */
    getCurrentTime: function () {
        var date = new Date();
        return date.toISOString();
    },

    store: function (log) {
        if (this._enabled) {
            if (!this._initialized) {
                this.initialize();
            }
            this._store.add(log);

            if (this._store.getCount() > this.MAX_RECORDS) {
                this._store.removeAt(0);
            }
        }
    },

    initialize: function () {
        this._initialized = true;
        this.logInfo('Logger', navigator.userAgent);
    },

    enable: function () {
        this._enabled = true;
    },

    disable: function () {
        this._enabled = false;
    },

    log: function (message, detail, level, logStack) {
        // Save message to store.
        this.store({ level: level, time: this.getCurrentTime(), message: message, detail: detail });

        // Output to console.
        var consoleMessage = Ext.isEmpty(detail) ? message : message + "\n" + detail; // Include detail (stack) in output to log.
        if (level === 'FATAL' || level === 'ERROR') {
            level = 'error';
        }
        else if (level === 'WARNING' || level === "ARIA") {
            level = 'warn';
        }
        else if (level === 'INFO') {
            level = 'info';
        }
        else if (level === 'DEBUG' || level === 'TRACE') {
            level = 'log';
        }
        Ext.log({ msg: consoleMessage, level: level, stack: !!logStack });
    },

    /**
     * Log fatal application messages
     *
     * @param {String} message The message describing the fatal event.
     * @param {String} detail Any other optional details to be included in the log.
     */
    logFatal: function (message, detail) {
        this.log(message, detail, 'FATAL');
    },

    /**
     * Log application error messages
     *
     * @param {String} message The message describing the error.
     * @param {String} detail Any other optional details to be included in the log.
     */
    logError: function (message, detail) {
        this.log(message, detail, 'ERROR');
    },

    /**
     * Log application warning messages
     *
     * @param {String} message The message describing the warnings.
     * @param {String} detail Any other optional details to be included in the log.
     */
    logWarn: function (message, detail) {
        this.log(message, detail, 'WARNING');
    },

    /**
     * Log application information messages
     *
     * @param {String} message The message describing the information.
     * @param {String} detail Any other optional details to be included in the log.
     */
    logInfo: function (message, detail) {
        this.log(message, detail, 'INFO');
    },

    /**
     * Log application debug messages
     *
     * @param {String} message The message describing the debug hints.
     * @param {String} detail Any other optional details to be included in the log.
     */
    logDebug: function (message, detail) {
        this.log(message, detail, 'DEBUG');
    },

    /**
     * Log application trace messages
     *
     * @param {String} message The message describing the debug hints.
     * @param {String} detail Any other optional details to be included in the log.
     */
    logTrace: function (message, detail) {
        this.log(message, detail, 'TRACE');
    },

    /**
     * Log application exceptions into the log store
     *
     * @param {Object} ex The exception object or text describing the exception.
     * @param {String} level The level to report the exception as.
     * @param {Boolean} show optional, whether to show the exception
     */
    logException: function (ex, level, show) {
        var text = "";
        var details = "";
        if (Ext.isObject(ex) || ex.stack) { // Some exception objects are not recognized as proper objects.
            text = ex.message || ex.description;
            details = ex.stack !== null ? ex.stack : "No stack trace available.";
        } else {
            text = ex;
        }
        show = (show === false) ? show : true;

        this.log(text, details, level, true);

        // If any layouts are suspeneded, we resume them.
        if (Ext.AbstractComponent.layoutSuspendCount !== 0) {
            Ext.resumeLayouts();
        }

        return false;
    },

    /**
     * Log ARIA warnings into the log store
     *
     * @param {String} ex The exception object or text describing the exception.
     * @param {String} level The ARIA requirement.
     * @param {Object} target The component that failed ARIA checks
     */
    logAria: function (msg, level, target) {
        this.log("ARIA" + level + ": " + msg, target, 'ARIA');
    },

    /**
     * handle exceptions
     *
     * @param {String} msg The exception object or text describing the exception.
     * @param {String} url The level to report the exception as.
     * @param {Number} line optional, whether to show the exception
     * @param {Number} column optional, whether to show the exception
     * @param {Object} error The exception object or text describing the exception.
     */
    handleException: function (msg, url, line, column, error) {
        var errorLocation;

        try {
            error = error || {}; // Not all browsers supply this object (e.g. IE)
            errorLocation = (error.fileName || url) + ":" + (error.lineNumber || line) + ":" + (error.columnNumber || column);
            error.message = (error.message || msg) + "\n  at " + errorLocation;
            // Not all browsers supply the stack property (e.g. IE).
            if (!error.stack && (error.fileName || url)) {
                error.stack = "Error: " + error.message + "\n  at " + errorLocation;
            }

            // Call with this lib scope, so called functions can use this lib function as normal.
            Ext.bind(ABP.view.util.Logger.logException, ABP.view.util.Logger, [error, 'ERROR', false]).call();
        } catch (ignore) {
            // Prevent error handling errors getting into a loop;
        }

        // Don't let the exception bubble up.
        return true;
    },

    // Handles Ext.Error being raised.
    handleError: function (err) {
        // As an example, err will have the following base properties:
        // {
        //   msg: "The string provided in the call to Ext.Error.raise("the msg string"),
        //   sourceClass: "Uxc.lib.SystemClient",
        //   sourceMethod: "executeServerTask"
        // }
        //
        // It will also have any additional properties added by the caller. Example:
        // Caller: Ext.Error.raise({ msg: "My problem is this.", moreInfo: "Some more info." });
        // err will look like this:
        // {
        //   msg: "My problem is this.",
        //   moreInfo: "Some more info.",
        //   sourceClass: "Uxc.lib.SystemClient",
        //   sourceMethod: "executeServerTask"
        //
        // All information in err is logged to the app log.
        //
        // Note: If that this method returns false then Ext treats the error as if it was not handled. This forces Ext to throw the error as an exception, which is caught by handleException, above.
        // Before the exception is thrown, Ext will also log all it can to the console.
        // Any additional properties (like "moreInfo" above, are not available to the windows.onerror handler, if the Error is re-thrown and caught.
        // Note: Ext.Error does not include a stack trace.
        // Note: Each browser varies in what gets through to the exception handler. For example, IE10 can lose details of the error. The console is the place to go to see as much about a problem as possible.

        if (err) {
            try {
                var errMsg = Ext.JSON.encode(err);
                // Call with this lib scope, so called functions can use this lib function as normal.
                Ext.bind(ABP.view.util.Logger.logException, ABP.view.util.Logger, ["Error raised.", errMsg, 'ERROR']).call();
            } catch (ignore) {
                // Prevent error handling errors getting into a loop;
            }
        }

        // Returns false, telling Ext to throw the error as exception. Ext treats the eror as if it was not handled. This forces Ext to throw the error as an exception, which is caught by handleException, above.
        // This function can be replaced by one that handles Ext errors differently if needed.
        return false;
    },



    getLogs: function (delimeter) {
        if (!delimeter) {
            delimeter = ',';
        }
        var data = '';
        var i;
        var record, detail;


        for (i = 0; i < this._store.getCount(); i++) {
            record = this._store.getAt(i);
            data = data + record.get('time') + delimeter + record.get('level') + delimeter + record.get('message');
            detail = record.get('detail');
            if (detail) {
                data = data + delimeter + detail;
            }
            data = data + '\r\n';
        }

        return data;
    },

    /**
     * Clear all the log items from the store
     */
    clearLogs: function () {
        this._store.removeAll();
    }
}, function (ABPLogger) {
    ABPLogger.aria = function () {
        ABPLogger.logAria.apply(ABPLogger, arguments);
    }
}
);