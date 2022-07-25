/**
 * ABPControlSet time component.
 */
Ext.define("ABPControlSet.view.field.Time", {
    extend: "Ext.form.field.Time",
    xtype: "abptime",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        'ABPControlSet.base.view.field.plugin.RelativeDateTime',
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