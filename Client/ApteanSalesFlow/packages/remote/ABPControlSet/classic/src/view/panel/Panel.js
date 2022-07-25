/**
 * ABPControlSet panel.
 */
Ext.define("ABPControlSet.view.panel.Panel", {
    extend: "Ext.panel.Panel",
    xtype: "abppanel",
    requires: [
        "ABPControlSet.base.mixin.Panel"
    ],
    border: true,
    mixins: [
        "ABPControlSet.base.mixin.Panel"
    ],
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});