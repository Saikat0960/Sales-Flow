/**
 * ABPControlSet time component. Extends the Ext JS v6.6 Time field which is currently included via modern overrides.
 */
Ext.define('ABPControlSet.view.field.Time', {
    extend: 'Ext.field.Time',
    xtype: 'abptime',
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
