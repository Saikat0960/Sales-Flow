/**
 * A singleton file to monitor the User Activity for the application.
 *
 * UserActivityMonitor() watches the application for user movements(keystroke, tap events etc) - a realistic way to judge if the user is actively viewing your application.
 *
 * Usage:
 *
 *  =====
 *
 *  ABP.util.UserActivityMonitor.init({ verbose : true });
 *  ABP.util.UserActivityMonitor.start();
 *
 *  =====
 *
 * Configs:
 *
 *  - verbose (Boolean): Whether or not the UserActivityMonitor() should output messages to the ABP logger.
 *  - interval (Integer): How often (in millseconds) the monitorUI() method is executed after calling start()
 *  - maxInactive (Integer): The longest amount of time to consider the user "active" without regestering any user activities.
 *  - warningTime (Integer): Warning Time to alert the user with a popup that he is about to be logged out due to inactivity.
 *
 * Event:
 *  - retain_session: Event raised when the user decides to retain the session on the warning popup(To be handled in the main application).
 *  - onInactive: Event raised when the user becomes inactive and is about to be signed out.
 *
 */

Ext.define('ABP.util.UserActivityMonitor', {
    singleton: true,
    ui: null,
    runner: null,
    task: null,
    lastActive: null,
    running: false,
    verbose: false,
    interval: (1000 * 1), //1 second
    maxInactive: (1000 * 60 * 0), // inactive
    warning: (1000 * 30 * 0), // inactive

    /**
     * Initializes the Activity monitor
     *
     * @param {Object} config Initialize the config values
     */
    init: function (config) {
        if (!config) { config = {}; }

        this.maxInactive = (1000 * 60 * ABP.util.Config.getSessionConfig().settings.inactiveTimeout);
        this.warning = (1000 * 60 * ABP.util.Config.getSessionConfig().settings.inactiveWarningTime);

        if (this.maxInactive <= 0) {
            return;
        }

        Ext.apply(this, config, {
            runner: new Ext.util.TaskRunner(),
            ui: Ext.getBody(),
            task: {
                run: this.monitorUI,
                interval: this.interval,
                scope: this
            }
        });

        this.running = true;
    },

    /**
     * Indicates whether the activity monitor is running
     */
    isRunning: function () {
        return this.running;
    },

    /**
     * Starts monitoring user activity
     */
    start: function () {
        var me = this;

        if (!me.isRunning()) {
            return false;
        }

        me.ui.on('keydown', this.onUpdateActivity, this);
        me.ui.on('tap', this.onUpdateActivity, this);
        me.ui.on('swipe', this.onUpdateActivity, this);
        me.ui.on('pinch', this.onUpdateActivity, this);
        me.lastActive = new Date();

        me.logTrace('User activity monitor has been started.');

        me.runner.start(this.task);
    },

    /**
     * Stops the activity monitor
     *
     */
    stop: function () {
        var me = this;

        if (!me.isRunning()) {
            return false;
        }

        me.runner.stop(this.task);
        me.lastActive = null;

        me.ui.un('keydown', this.onUpdateActivity);
        me.ui.un('tap', this.onUpdateActivity);
        me.ui.un('swipe', this.onUpdateActivity);
        me.ui.un('pinch', this.onUpdateActivity);

        me.logTrace('User activity monitor has been stopped.');
    },

    /**
     * Handles the user interacting with the application
     */
    onUpdateActivity: function () {
        this.lastActive = new Date();
        this.logTrace('User activity detected (' + this.lastActive + ')');
    },

    /**
     * Monitors user activity based on the interval mentioned on the config
     */
    monitorUI: function () {
        var now = new Date(),
            inactive = (now - this.lastActive);
        var timeout_me = this;
        var controller = Ext.getApplication().getController("ABP.view.ApplicationController");
        var time = Math.round((this.maxInactive - inactive) / 1000);
        var date = new Date(null);
        date.setSeconds(time);

        if (inactive >= this.warning && this.warning > 0) {
            if (time >= 0) {
                var message = ABP.util.Common.geti18nString('inactive_timeout');
                var title = ABP.util.Common.geti18nString('timeout_title');
                ABP.view.base.popUp.PopUp.customPopup(message + date.toISOString().substr(14, 5), title, '?', [{ text: 'session_retain', args: false }, { text: 'session_signoff', args: true }], confirmFunction);
                function confirmFunction(btn) {
                    if (btn === true) {
                        controller.fireEvent('onInactive');
                        controller.fireEvent('main_fireAppEvent', 'container', 'signout', ['user init', false]);
                    }
                    else {
                        controller.fireEvent('retain_session');
                        timeout_me.start();
                    }
                }
            }
        }

        if (inactive >= this.maxInactive) {
            this.logInfo('MAXIMUM INACTIVE TIME HAS BEEN REACHED');
            this.stop(); //remove event listeners
            controller.fireEvent('onInactive');
            var timeout = ABP.util.Common.geti18nString('session_timeout');
            controller.fireEvent('main_fireAppEvent', 'container', 'signout', [timeout, false]);
        }
        else {
            this.logTrace('CURRENTLY INACTIVE FOR ' + inactive + ' (ms)');
        }
    },

    privates: {
        /**
         * Write the message to the trace log
         * @private
         *
         * @param {String} msg Message displayed in the logs
         */
        logTrace: function (msg) {
            if (this.verbose) {
                ABP.util.Logger.logTrace(msg);
            }
        },

        /**
         * Write the message to the info log
         * @private
         *
         * @param {String} msg Message displayed in the logs
         */
        logInfo: function (msg) {
            ABP.util.Logger.logInfo(msg);
        }
    }
});