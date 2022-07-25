/**
 * ABPControlSet date component.
 */
Ext.define("ABPControlSet.view.field.Date", {
    extend: "Ext.field.Date",
    xtype: "abpdate",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Field"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Field"
    ],
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});