/**
 * ABPControlSet ag-grid.
 */
Ext.define("ABPControlSet.view.grid.AGGrid", {
    extend: "ABPControlSet.base.view.grid.AGGrid",
    xtype: "abpaggrid",
    requires: [
        "ABPControlSet.base.view.grid.AGGrid",
        "ABPControlSet.base.mixin.Component"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Component"
    ],

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    /** @private @ignore */
    initComponent: function () {
        this.callParent(arguments);

        // Add the "afterrender" listener so we can embed HTML, and know when to allow the subclass to hook into embedding process.
        this.on({
            afterrender: {
                fn: this.beginEmbed,
                scope: this,
                priority: 999
            }
        });
    }
});