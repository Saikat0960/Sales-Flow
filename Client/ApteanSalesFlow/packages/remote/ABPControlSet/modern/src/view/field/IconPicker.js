/**
 * Convenience picker field for icons in ABP.
 */
Ext.define('ABPControlSet.view.field.IconPicker', {
    extend: 'Ext.field.ComboBox',
    xtype: 'abpiconcombo',
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Field",
        'ABPControlSet.view.picker.Icon'
    ],

    mixins: [
        "ABPControlSet.base.mixin.Field"
    ],
    displayField: "icon",
    valueField: "icon",
    triggers: {
        iconTrigger: {
            xclass: "ABPControlSet.view.form.trigger.Trigger"
        }
    },

    constructor: function (config) {
        config = config || {};
        var iconStore = ABPControlSet.common.Common.getIconStore();
        config.store = iconStore;
        config.picker = 'floated';

        config.floatedPicker = {
            xtype: "abpiconpicker",
            store: iconStore
        };

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    setValue: function (value) {
        var me = this;
        me.callParent(arguments);

        var iconTrigger = me.getTriggers()["iconTrigger"];
        if (iconTrigger) {
            iconTrigger.setIcon(value);
        }
    },
});
