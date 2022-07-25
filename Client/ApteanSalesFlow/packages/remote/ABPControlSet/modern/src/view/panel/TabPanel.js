/**
 * ABPControlSet tab panel.
 */
Ext.define("ABPControlSet.view.panel.TabPanel", {
    extend: "Ext.tab.Panel",
    xtype: "abptabpanel",
    requires: [
        "ABPControlSet.base.mixin.TabPanel"
    ],
    mixins: [
        "ABPControlSet.base.mixin.TabPanel"
    ],
    tabBar: {
        scrollable: 'horizontal'
    },
    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});