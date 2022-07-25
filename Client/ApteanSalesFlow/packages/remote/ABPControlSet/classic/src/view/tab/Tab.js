/**
 * ABPControlSet tab button.
 */
Ext.define("ABPControlSet.view.tab.Tab", {
    extend: "Ext.tab.Tab",
    xtype: "abptab",
    requires: [
        "ABPControlSet.base.mixin.Button"
    ],
    mixins: [
        "ABPControlSet.base.mixin.Button"
    ],
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});