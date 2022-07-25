/**
 * ABPControlSet combobox component.
 */
Ext.define("ABPControlSet.view.field.ComboBox", {
    extend: "Ext.field.ComboBox",
    xtype: "abpcombobox",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.ComboBox"
    ],
    mixins: [
        "ABPControlSet.base.mixin.ComboBox"
    ],

    constructor: function (config) {
        config = config || {};

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    /**
     * Set listValue if enabled and this value comes from a store record, 
     * otherwise set listValue to undefined.
     * @param {*} value 
     */
    setValue: function (value) {
        if (this.getPublishListValue()) {
            var storeRec = this.findRecordByValue(value);
            if (storeRec && !storeRec.phantom) {
                this.setListValue(value);
            } else {
                this.setListValue(undefined);
            }
        }
        this.callParent(arguments);
    },

    onFocus: function () {
        // If the store is empty and the field is editable, skip default behavior which "shows" the empty list.
        // Instead, go straight into keyboard edit of the text field.
        var store = this.getStore(),
            count = store.getCount(),
            editable = this.getEditable();
        if (count === 0 && editable) {
            return;
        } else {
            this.callParent(arguments);
        }
    }
});
