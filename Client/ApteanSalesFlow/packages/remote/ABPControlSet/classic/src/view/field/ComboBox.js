/**
 * ABPControlSet combobox component.
 */
Ext.define("ABPControlSet.view.field.ComboBox", {
    extend: "Ext.form.field.ComboBox",
    xtype: "abpcombobox",
    requires: [
        "ABPControlSet.base.view.field.plugin.LinkedLabel",
        "ABPControlSet.base.view.field.plugin.Field",
        "ABPControlSet.base.mixin.Field",
        'ABPControlSet.view.picker.ComboList',
        "ABPControlSet.base.mixin.ComboBox"
    ],

    /**
     * @cfg {Object[]} listActions
     *
     * An array of component configurations to display within the drop down list of the combo field. By default, the item will always show. 
     * However, if it is desired to only show the item when the list is empty, configure the item with onlyShowWhenEmpty set to true.
     */

    mixins: [
        "ABPControlSet.base.mixin.ComboBox"
    ],

    constructor: function (config) {
        config = config || {};

        this.mixins.abpcomponent.constructor.call(this, config);
        this.callParent([config]);
    },

    // Create the abpcombolist picker to allow for listActions to be shown at the bottom of the list.
    createPicker: function () {
        var me = this;
        me.listConfig = me.listConfig || {};
        Ext.apply(me.listConfig, {
            xtype: 'abpcombolist',
            listActions: me.listActions
        });

        return me.callParent(arguments);
    },

    // Once a query is ran, evaluare which actions should be shown, and if none, hide the toolbar as well.
    afterQuery: function () {
        var me = this,
            visibleItems = 0,
            store = me.getStore(),
            count = store.getCount(),
            picker = me.getPicker(),
            actionToolbar = picker ? picker.down('#actiontoolbar') : null,
            actionItems = actionToolbar ? actionToolbar.items.getRange() || [] : [],
            length = actionItems.length;

        // Start at 1 since the first item is the '->' push right toolbar item.
        for (var i = 1; i < length; i++) {
            action = actionItems[i];
            // Check onlyShowWhenEmpty.
            if (action && action.onlyShowWhenEmpty) {
                if (count === 0) {
                    action.show();
                    visibleItems++;
                } else {
                    action.hide();
                }
            } else {
                action.show();
                visibleItems++;
            }
        }
        if (actionToolbar) {
            actionToolbar[visibleItems ? 'show' : 'hide']();
        }

        me.callParent(arguments);
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
    }
});