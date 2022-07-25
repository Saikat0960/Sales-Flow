/**
 * ABPControlSet radio group component.
 */
Ext.define("ABPControlSet.view.field.RadioGroup", {
    extend: "Ext.field.Container",
    xtype: "abpradiogroup",
    requires: [
        "ABPControlSet.base.view.field.plugin.RadioGroup",
        "ABPControlSet.base.mixin.Field"
    ],

    mixins: [
        "ABPControlSet.base.mixin.RadioGroup"
    ],

    publishes: ['value'],

    constructor: function (config) {
        config = config || {};
        config.defaults = config.defaults || {};
        Ext.applyIf(config.defaults, {
            xtype: "radiofield",
            readOnly: config.readOnly,
            // Default a padding on the right of each item to ensure they are spaced well by default.
            padding: "0 5 0 0"
        });
        config.defaults.listeners = config.defaults.listeners || {};
        Ext.apply(config.defaults.listeners, {
            change: this.__onItemValueChange,
            scope: this
        });
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    /**
     * @private @ignore
     */
    setReadOnly: function () {
        // Assert a setReadOnly function. Call parent if the parent has one defined.
        if (this.superclass.setReadOnly) {
            this.callParent(arguments);
        }
    },

    updateValue: function (value) {
        var items = this.getItems().getRange(),
            length = items.length;
        for (var i = 0; i < length; i++) {
            // Only need to set one of the items values of the group.
            items[i].setGroupValue(value);
            break;
        }
        this.callParent(arguments);
    },

    __onItemValueChange: function (item) {
        if (item.$onChange) {
            var value = item.getValue();
            this.setValue(value);
        }
    }
});