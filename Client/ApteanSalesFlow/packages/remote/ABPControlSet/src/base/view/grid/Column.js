/**
 * ABPControlSet grid column.
 */
Ext.define("ABPControlSet.base.view.grid.Column", {
    extend: "Ext.grid.column.Column",
    xtype: "abpcolumn",
    requires: [
        "ABPControlSet.base.mixin.Column"
    ],
    mixins: [
        "ABPControlSet.base.mixin.Column"
    ],

    constructor: function (config) {
        config = config || {};
        this.callParent([config]);
        this.mixins.abpcolumn.constructor.call(this);
    }
});