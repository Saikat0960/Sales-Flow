/**
 * ABPControlSet text area component.
 */
Ext.define("ABPControlSet.view.field.TextArea", {
    extend: "Ext.field.TextArea",
    xtype: "abptextarea",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Field"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Field"
    ],

    grow: true,

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});