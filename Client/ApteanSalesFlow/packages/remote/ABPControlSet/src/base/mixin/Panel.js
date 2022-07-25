/**
 * @private
 *  Base panel mixin class.
 *
 */
Ext.define("ABPControlSet.base.mixin.Panel", {
    extend: "ABPControlSet.base.mixin.Component",

    /**
     * @cfg {String} headerTitle
     *
     * A string value to set as the panel title.
     */
    headerTitle: null,

    config: {
        /**
         * @cfg {String} headerForegroundColor
         *
         * The color of the text in the panel header.
         */
        headerForegroundColor: null,

        /**
         * @cfg {String} headerBackgroundColor
         *
         * The color of the background of the panel header.
         */
        headerBackgroundColor: null,

        /**
         * @cfg {String} bodyBackgroundColor
         *
         * The color of the background of the panel body.
         */
        bodyBackgroundColor: null,
    },

    setHeaderTitle: function (value) {
        this.setTitle(value);
    },

    getHeaderTitle: function () {
        var me = this;

        var title = me.getTitle();
        if (title) {
            return title;
        } else {
            // Otherwise best we can do is return the headerTitle's config value.
            return me.callParent();
        }
    },

    updateForegroundColor: function (color) {
        ABP.util.Logger.logWarn('Setting an abppanel\'s foregroundColor is not defined.');
    },

    updateBodyForegroundColor: function (color) {
        ABP.util.Logger.logWarn('Setting an abppanel\'s bodyForegroundColor is not defined.');
    },

    getForegroundColor: function () {
        ABP.util.Logger.logWarn('Getting an abppanel\'s foregroundColor is not defined.');
    },

    getBodyForegroundColor: function () {
        ABP.util.Logger.logWarn('Getting an abppanel\'s bodyForegroundColor is not defined.');
    }
});
