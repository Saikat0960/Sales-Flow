/**
 * @private
 * Base column mixin.
 */
Ext.define("ABPControlSet.base.mixin.Column", {
    extend: "Ext.Mixin",

    mixinConfig: {
        id: 'abpcolumn'
    },

    config: {
        /**
        * @cfg {Function} fieldFormatter
        *
        * A method to be executed when the cell determining the value to display.
        */
        fieldFormatter: null,
        /**
        * @cfg {String} fieldFormat
        *
        * A format string to include when the formatter is executed.
        */
        fieldFormat: null
    },

    constructor: function () {
        this.callParent(arguments);
        this.hookFormatRenderer();
    },
    // Overridden by toolkit specific class.
    hookFormatRenderer: Ext.EmptyFn,
    columnFormatRenderer: Ext.emptyFn
});