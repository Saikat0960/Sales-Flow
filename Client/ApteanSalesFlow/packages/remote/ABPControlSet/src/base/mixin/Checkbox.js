/**
 * @private
 *  Base checkbox mixin.
 */
Ext.define("ABPControlSet.base.mixin.Checkbox", {
    extend: "ABPControlSet.base.mixin.Field",

    config: {
        /**
         * @cfg {String} fieldLabel
         *
         * A string to be shown as the label. This is for modern support of the fieldLabel property - original property for modern is label.
         */
        fieldLabel: null
    },

    lastClickTime: null, // Tracks when the user last clicked.
    IOS_USER_CLICK_IS_CHANGE_SOURCE_TIMEOUT: 300, // In milliseconds. A sanity timeout that prevents any future change beign associated with a click from a long time ago.

    constructor: function (config) {
        config = config || {};

        if (config.linkedLabel) {
            this.addCSPlugin(config, "abplinkedlabel");
        }

        this.callParent([config]);
    }
});
