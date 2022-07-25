/**
 * @private
 *  Base field mixin class.
 */
Ext.define("ABPControlSet.base.mixin.RadioGroup", {
    extend: "ABPControlSet.base.mixin.Field",

    config: {
        /**
         * @cfg {Ext.data.Store} store
         *
         * (Optional) A store of items which will be used to update the items in the group. When set, the labelField and valueField will need to be set in order to properly digest the records into radio fields.
         */
        store: null,

        /**
         * @cfg {String} labelField
         *
         * The field to pull out of the record to be the label to display for the radio item.
         */
        labelField: null,

        /**
         * @cfg {String} valueField
         *
         * The field to pull out of the record to be the backing value to the radio field.
         */
        valueField: null
    },

    /**
     * @cfg {String} backgroundColor
     *
     * A valid color value in css to set as the background color.
     *
     * For a RadioGroup, the backgroundColor is the color behind each radio button icon.
     */

    /**
     * @cfg {String} foregroundColor
     *
     * A valid color value in css to set as the foreground color.
     *
     * For a RadioGroup, the foregroundColor is the color of each radio button icon.
     */
    constructor: function (config) {
        config = config || {};

        /*
            Note: Plugins added during construction will wipe out any plugins defined on a class prototype definition.
            In order for multiple plugins to be used on a component, add them through the addCSPlugin method.
        */
        this.removeCSPlugin(config, "abpfield");
        this.addCSPlugin(config, "abpradiogroup");

        this.callParent([config]);
    },

    updateStore: function (store) {
        if (Ext.isString(store)) {
            var form = this.up('form'),
                vm = form.getViewModel();
            store = vm.getStore(store);
        }

        if (Ext.isObject(store)) {
            if (store.getCount() > 0) {
                this.onStoreUpdate();
            } else {
                store.on('datachanged', this.onStoreUpdate, this)
            }
        }
    },

    updateRadioItems: function () {
        var me = this,
            labelField = me.getLabelField(),
            valueField = me.getValueField(),
            store = me.getStore(),
            radioFields = [],
            record,
            radioRecords = store.getRange(),
            length = radioRecords.length;

        me.removeAll();
        for (var i = 0; i < length; i++) {
            record = radioRecords[i];
            radioFields.push({
                inputValue: record.get(valueField),
                boxLabel: record.get(labelField)
            });
        }
        me.add(radioFields);
    }
});