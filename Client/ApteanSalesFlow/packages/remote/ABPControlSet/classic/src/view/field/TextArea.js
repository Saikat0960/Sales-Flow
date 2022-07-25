/**
 * ABPControlSet text area component.
 */
Ext.define("ABPControlSet.view.field.TextArea", {
    extend: "Ext.form.field.TextArea",
    xtype: "abptextarea",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.TextArea"
    ],

    mixins: [
        "ABPControlSet.base.mixin.TextArea"
    ],
    grow: true,

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});