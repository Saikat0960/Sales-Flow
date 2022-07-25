/**
 * Convenience picker field for icons in ABP.
 */
Ext.define('ABPControlSet.view.field.IconPicker', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'abpiconcombo',
    requires: [
        'ABPControlSet.base.view.field.plugin.LinkedLabel',
        'ABPControlSet.base.view.field.plugin.Field',
        'ABPControlSet.base.mixin.Field',
        'ABPControlSet.view.picker.Icon',
        'ABPControlSet.view.form.trigger.Trigger'
    ],

    mixins: [
        'ABPControlSet.base.mixin.Field'
    ],

    displayField: 'icon',
    valueField: 'icon',

    triggers: {
        iconTrigger: {
            xclass: 'ABPControlSet.view.form.trigger.Trigger'
        }
    },

    constructor: function (config) {
        config = config || {};
        config.store = ABPControlSet.common.Common.getIconStore();
        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    onSelect: function (boundList, record) {
        var me = this,
            value = record.get('icon');

        var iconTrigger = me.getTriggers()['iconTrigger'];
        if (iconTrigger) {
            iconTrigger.setIcon(value);
        }
    },
    setValue: function (value) {
        var me = this;
        me.callParent(arguments);

        var iconTrigger = me.getTriggers()['iconTrigger'];
        if (iconTrigger) {
            iconTrigger.setIcon(value);
        }
    },

    createPicker: function () {
        var me = this,
            picker,
            pickerCfg = Ext.apply({
                xtype: 'abpiconpicker',
                id: me.id + '-picker',
                pickerField: me,
                selectionModel: me.pickerSelectionModel,
                floating: true,
                hidden: true,
                store: me.getPickerStore(),
                displayField: me.displayField,
                preserveScrollOnRefresh: true,
                ariaSelectable: me.ariaSelectable
            }, me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.widget(pickerCfg);

        // We limit the height of the picker to fit in the space above
        // or below this field unless the picker has its own ideas about that.
        if (!picker.initialConfig.maxHeight) {
            picker.on({
                beforeshow: me.onBeforePickerShow,
                scope: me
            });
        }

        picker.getSelectionModel().on({
            beforeselect: me.onBeforeSelect,
            beforedeselect: me.onBeforeDeselect,
            focuschange: me.onFocusChange,
            select: me.onSelect,
            scope: me
        });

        picker.getNavigationModel().navigateOnSpace = false;

        return picker;
    }
});
