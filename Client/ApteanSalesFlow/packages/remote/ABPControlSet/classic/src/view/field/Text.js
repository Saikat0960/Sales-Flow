/**
 * ABPControlSet text component.
 */
Ext.define("ABPControlSet.view.field.Text", {
    extend: "Ext.form.field.Text",
    xtype: "abptext",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Text"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Text"
    ],

    setReadOnly: function (readOnly) {
        // Only do the set logic if the property is updating.
        // This is needed since the readOnly property is now being used as a config property.
        // Previously the property was purely a property without a true get/set configuration so a set was always used, rather than an update method.
        if (readOnly !== this.readOnly) {
            this.callParent(arguments);
        }
    },

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    }
});