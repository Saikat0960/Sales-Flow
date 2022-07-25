/**
 * ABPControlSet date time component. Uses a date picker with a built in time field.
 */
Ext.define("ABPControlSet.view.field.DateTime", {
    extend: "Ext.field.Date",
    xtype: "abpdatetime",
    requires: [
        'ABPControlSet.view.panel.DateTime',
        'ABPControlSet.view.picker.DateTime',
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Field"
    ],

    mixins: [
        "ABPControlSet.base.mixin.Field"
    ],

    config: {
        dateFormat: Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat
    },

    floatedPicker: {
        xtype: 'abpdatetimepanel',
        autoConfirm: true,
        floated: true,
        listeners: {
            tabout: 'onTabOut',
            select: 'onPickerChange',
            scope: 'owner'
        },
        keyMap: {
            ESC: 'onTabOut',
            scope: 'owner'
        }
    },

    edgePicker: {
        xtype: 'abpdatetimepicker',
        cover: true
    },

    constructor: function (config) {
        config = config || {};
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    applyPicker: function (picker, oldPicker) {
        var me = this;

        picker = me.callParent([picker, oldPicker]);

        me.pickerType = picker.xtype === 'abpdatetimepicker' ? 'edge' : 'floated';
        picker.ownerCmp = me;

        return picker;
    }
});