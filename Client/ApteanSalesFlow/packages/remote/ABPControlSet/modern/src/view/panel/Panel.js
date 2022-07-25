/**
 * ABPControlSet panel.
 */
Ext.define("ABPControlSet.view.panel.Panel", {
    extend: "Ext.field.Panel",
    xtype: "abppanel",
    requires: [
        "ABPControlSet.base.mixin.Panel"
    ],
    border: true,
    mixins: [
        "ABPControlSet.base.mixin.Panel"
    ],

    config: {
        readOnly: null
    },

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    updateReadOnly: function (newReadOnly) {
        this.getFields(false).forEach(function (field) {
            if (field.setReadOnly) {
                field.setReadOnly(newReadOnly);
            }
        });
        return this;
    }
});