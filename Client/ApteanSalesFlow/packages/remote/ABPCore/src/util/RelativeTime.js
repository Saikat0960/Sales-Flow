/**
 * Utility functions that help transform date + time values into text labels that are relative to now
 * i.e. 'about an hour ago' or 'about 5 minutes from now'
 *
 * for example:
 *
 *      To format a date into a time relevant label, call the format method
 *
 *        var now = new Date();
 *        var label = ABP.util.RelativeTime.format(now)
 *
 *      To format a date used within an XTemplate use the formatRelativeTime formatter
 *
 *        tpl: [
 *            '<ul class="alerts">',
 *            '<tpl for=".">',
 *               '<li>',
 *                   '<span class="time abp-time-ago" data-time="{time}">{time:formatRelativeTime}</span>',
 *                   '<span class="text">{text:htmlEncode}</span>',
 *               '</li>',
 *           '</tpl>',
 *           '</ul>',
 *         ]
 *
 *
 *      To build your own UI component ensure the class and data-time attributes are set, and start the relative time updater
 *
 *         <div class="time abp-time-ago" data-time="{time}">{time:formatRelativeTime}</div>
 *
 *         ABP.util.RelativeTime.start();
 *
 */
Ext.define('ABP.util.RelativeTime', {
    singleton: true,

    requires: [
        'ABP.util.Logger',
        'ABP.util.Date'
    ],

    config: {
        /**
         * @cfg {Number} refreshInterval
         * The number of seconds between each UI update
         */
        refreshInterval: 60,

        /**
         * @cfg {String} itemSelector
         * The CSS selector used to identify the relative time labels within the dom
         */
        itemSelector: '.abp-time-ago',

        /**
         * @cfg {Object} offsets
         * The object respresentation of the offsets used in the approximations.
         * The values are exclusive, they will be evaluated as date < now or date < oneYear
         *
         * @cfg {Number} offsets.now
         Maximum number of seconds a date is considered less than a minute, defaults to 45 seconds
         *
         * @cfg {Number} offsets.minuteOffset
         * Maximum number of seconds a date is consedred about a minute, defaults to 90 seconds
         *
         * @cfg {Number} offsets.xminutes
         * Maximum number of minutes a date should be represented as x minutes, defaults to 50
         *
         * @cfg {Number} offsets.oneHour
         * Number of minutes a date should be represented as one hour, default 80
         *
         * @cfg {Number} offsets.xHours
         * Maximum number of hours a date should be represented as x hours, defaults to 24
         *
         * @cfg {Number} offsets.oneDay
         * maximum number of hours a date shuld be respresented as one day, default 48 hours
         *
         * @cfg {Number} offsets.xDays
         * Maximum number of days a date should be represented as X days, default 30 days
         *
         * @cfg {Number} offsets.oneMonth
         * maximum number of days a date should be represented as one month, default 60 days
         *
         * @cfg {Number} offsets.xMonths
         * Maximum number of days a date should be representas as x months, defaults to 365 days
         *
         * @cfg {Number} offsets.oneYear
         * Maximum number of years a date should be represented as one year, defaults to 2 years
         */
        offsets: {
            now: 45,
            minuteOffset: 120,
            xminutes: 50,
            oneHour: 80,
            xHours: 24,
            oneDay: 48,
            xDays: 30,
            oneMonth: 60,
            xMonths: 365,
            oneYear: 2
        },

        /**
         * @cfg {String} toolTipFormat
         * The format to use for the timeabo tooltips
         */
        toolTipFormat: 'l jS F, Y, H:i'
    },

    updateRunner: null,
    updateTask: null,

    constructor: function (config) {
        var me = this;
        me.initConfig(config);

        me.updateRunner = new Ext.util.TaskRunner();

        me.updateTask = me.updateRunner.newTask({
            run: me.updateElements,
            interval: me.getRefreshInterval() * 1000,
            scope: me
        });

        me.start();
    },

    /**
     * Starts the automatic refreshing of the UI labels.
     *
     * NOTE: the elements containing the date labels must be selectable by using the itemSelector and contain the data-time attribute
     */
    start: function () {
        var me = this;
        me.updateTask.start();
    },

    /**
     * Stops the automatic refreshing of the UI labels.
     */
    stop: function () {
        var me = this;
        me.updateTask.stop();
    },

    /**
     * Format the date / time value into a user friendly message relative to the current time.
     *
     * @param {String} original the date / time value to be formatted
     * @param {Boolean} compressed (optional) whether to use a shortened version of the string, usually removing the 'about'
     * @return {String} The formatted value representing the relative time
     */
    format: function (original, compressed) {
        if (Ext.isString(original)) {
            var _initialString = original;
            original = new Date(original);
            if (original instanceof Date && isNaN(original)) {
                ABP.util.Logger.logWarn('Could not create relative time, failed to parse value: ' + _initialString);
                return;
            }
        }
        if (!isNaN(parseInt(original, 10))) {
            // on second update, original time comes in as ""
            original = parseInt(original, 10);
        }
        compressed = (typeof compressed !== 'undefined') ? compressed : false;

        var originalTime = new Date(original);

        var me = this;
        var now = new Date();
        var offset = Ext.Date.diff(originalTime, now, Ext.Date.SECOND);
        var offsets = me.getOffsets();

        var keyPrefix = 'abp_time_';
        if (compressed) {
            keyPrefix = 'abp_short_time_'
        }

        var prefix = ABP.util.Common.geti18nString(keyPrefix + 'prefix_ago');
        var suffix = ABP.util.Common.geti18nString(keyPrefix + 'suffix_ago');

        if (offset < 0) {
            prefix = ABP.util.Common.geti18nString(keyPrefix + 'prefix_from_now');
            suffix = ABP.util.Common.geti18nString(keyPrefix + 'suffix_from_now');
        }

        var seconds = Math.abs(offset);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var years = Math.floor(days / 365);

        var text = '';

        if (seconds < offsets.now) {
            text = ABP.util.Common.geti18nString(keyPrefix + 'seconds'); // 'less than a minute'
        }
        else if (seconds < offsets.minuteOffset) {
            text = ABP.util.Common.geti18nString(keyPrefix + 'minute'); // 'about a minute'
        }
        else if (minutes < offsets.xminutes) {
            text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'minutes'), Math.round(minutes)); // '{0} minutes'
        }
        else if (minutes < offsets.oneHour) {
            text = ABP.util.Common.geti18nString(keyPrefix + 'hour'); // 'about an hour'
        }
        else if (hours < offsets.xHours) {
            text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'hours'), Math.round(hours)); // 'about {0} hours'
        }
        else if (hours < offsets.oneDay) {
            text = ABP.util.Common.geti18nString(keyPrefix + 'day'); // 'about a day'
        }
        else if (days < offsets.xDays) {
            text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'days'), Math.floor(days)); // 'about {0} days'
        }
        else if (days < offsets.oneMonth) {
            text = ABP.util.Common.geti18nString(keyPrefix + 'month'); // 'about a month'
        }
        else if (days < offsets.xMonths) {
            text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'months'), Math.floor(days / 30)); // 'about {0} months'
        }
        else if (years < offsets.oneYear) {
            text = ABP.util.Common.geti18nString(keyPrefix + 'year'); // 'about a year'
        }
        else {
            text = Ext.String.format(ABP.util.Common.geti18nString(keyPrefix + 'years'), Math.floor(years)); // 'about {0} years'
        }

        if (prefix.length > 0) {
            text = prefix + ' ' + text;
        }

        if (suffix.length > 0) {
            text = text + ' ' + suffix;
        }

        return Ext.String.htmlEncode(text);
    },

    /**
     * Format the date / time value so it can be used in the relateive time tooltip
     * @param {String/Number} time the date time value to format
     */
    formatTooltip: function (time) {
        if (!isNaN(parseInt(time, 10))) {
            // on second update, original time comes in as ""
            time = parseInt(time, 10);
        }

        var dt = new Date(time);
        return Ext.Date.format(dt, this.getToolTipFormat());
    },

    privates: {
        updateElements: function () {
            var me = this;

            var timeElements = Ext.dom.Element.query(me.getItemSelector());
            timeElements.forEach(function (element) {
                if (element.dataset && element.dataset.time) {
                    element.innerText = me.format(element.dataset.time)
                }
            });
        }
    }

});

Ext.apply(Ext.util.Format, {
    formatRelativeTime: function (v) {
        return ABP.util.RelativeTime.format(v);
    },
    formatRelativeShortTime: function (v) {
        return ABP.util.RelativeTime.format(v, true);
    },
    formatRelativeTool: function (v) {
        return ABP.util.RelativeTime.formatTooltip(v);
    }
});
