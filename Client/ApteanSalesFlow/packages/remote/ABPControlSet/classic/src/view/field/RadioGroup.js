/**
 * ABPControlSet radio group component.
 */
Ext.define("ABPControlSet.view.field.RadioGroup", {
    extend: "Ext.form.RadioGroup",
    xtype: "abpradiogroup",
    requires: [
        "ABPControlSet.base.view.field.plugin.RadioGroup",
        "ABPControlSet.base.mixin.RadioGroup"
    ],

    mixins: [
        "ABPControlSet.base.mixin.RadioGroup"
    ],

    simpleValue: true,

    constructor: function (config) {
        // Assert config and defaults.
        config = config || {};
        config.defaults = config.defaults || {};
        Ext.applyIf(config.defaults, {
            readOnly: config.readOnly,
            // Default a padding on the right of each item to ensure they are spaced well by default.
            padding: "0 5 0 0"
        });
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    setReadOnly: function (readOnly) {
        var me = this;
        if (me.rendered) {
            this.callParent(arguments);
        } else {
            var boxes = me.items && me.items.getRange ? me.items.getRange() : me.items || [],
                b,
                bLen = boxes.length;

            for (b = 0; b < bLen; b++) {
                boxes[b].readOnly = readOnly;
            }

            this.readOnly = readOnly;
        }
    },

    onStoreUpdate: function () {
        if (this.rendered) {
            this.updateRadioItems();
        } else {
            this.on('render', this.updateRadioItems, this);
        }
    }
});