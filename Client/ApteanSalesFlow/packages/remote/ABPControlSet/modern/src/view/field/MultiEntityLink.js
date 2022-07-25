/**
 * Modern link field. Multiple values.
 *
 * This field expects an array of objects to be set as its value. Within each object should be the values of the displayField and the valueField configured on this component.
 * If a displayField value is not found, the valueField value will be displayed.
 *
 * A store can be bound to this field, when updated, it will pull the records of the store and set them as the value. Likewise, when the value is directly set, it will update the stores records with the array of objects.
 *
 * Configured on this component is also the delimeter which splits multiple record display values. (Defaults as ', ')
 */
Ext.define('ABPControlSet.view.field.MultiEntityLink', {
    extend: 'ABPControlSet.view.field.EntityLink',
    xtype: 'abpmultientitylinkfield',
    config: {
        /**
         * @cfg {String} delimeter
         * The string used to separate the values.
         */
        delimeter: ', ',

        /**
         * @cfg {Ext.data.Store} store
         * The store containing the entity link records.
         */
        store: null
    },

    /**
     * Because entity links are updated by the user using a separate form from the control, 
     * it is possible to know when the user is updating the entity link. 
     * Call this method in that case instead of the normal setValue.
     * @param {Object[]/Ext.data.Model[]} values The new entity link value. 
     * Can be either a simple array of objects that will become records in the store, or an array of model records.
     * Each object should contain at least the properties for the key and descriptor. Example:
     * 
     *    [
     *      {
     *        "PROSPECT_CODE": "PRO234",
     *        "CONTACT_ID": "001",
     *        "PROSPECT_NAME": "Macrosoft",
     *        "id": "extModel70-1"
     *      },
     *      {
     *        "PROSPECT_CODE": "PRO435",
     *        "CONTACT_ID": "002",
     *        "PROSPECT_NAME": "Spacebook",
     *        "id": "extModel70-2"
     *      },
     *      {
     *        "PROSPECT_CODE": "PRO456",
     *        "CONTACT_ID": "003",
     *        "PROSPECT_NAME": "Foogle",
     *        "id": "extModel70-3"
     *      }
     *    ]
     */
    setUserValue: function (values) {
        var me = this;
        this.__userChange = true;
        me.setValue(values);
        this.__userChange = null;
    },

    /**
     * Updates the store associated with this abpmultientitylinkfield and fires the userchanged event
     * if this is the user changing the value.
     * @param {Object[]/Ext.data.Model[]} values Can be either a simple array of objects that will become records in the store, or an array of model records.
     * Each object should contain at least the properties for the key and descriptor. Example:
     * 
     *    [
     *      {
     *        "PROSPECT_CODE": "PRO234",
     *        "CONTACT_ID": "001",
     *        "PROSPECT_NAME": "Macrosoft",
     *        "id": "extModel70-1"
     *      },
     *      {
     *        "PROSPECT_CODE": "PRO435",
     *        "CONTACT_ID": "002",
     *        "PROSPECT_NAME": "Spacebook",
     *        "id": "extModel70-2"
     *      },
     *      {
     *        "PROSPECT_CODE": "PRO456",
     *        "CONTACT_ID": "003",
     *        "PROSPECT_NAME": "Foogle",
     *        "id": "extModel70-3"
     *      }
     *    ]
     * @param {Object[]/Ext.data.Model[]} oldValues The previous values for the control.
     */
    updateValue: function (values, oldValues) {
        values = values || [];
        var me = this,
            store = me.getStore(),
            inputValue = me.getEntityDisplayValue(values);

        me.setInputValue(inputValue);
        if (store) {
            // Update the store, throwing away update events.
            store.suspendEvents();
            store.removeAll();
            store.add(values);
            store.resumeEvents(true);
        }
        // Ensure clear icon is synced 
        me.syncEmptyState();

        // Fire userchanged if this the change is from the user and the value is different from the previous.
        if (this.__userChange && !me.valuesEqual(values, oldValues)) {
            this.fireEvent(ABPControlSet.common.types.Events.UserChanged, this, values, oldValues);
        }
    },

    /**
     * Compare two sets of entity link values. The values are arrays of either records from a store or simple objects.
     * It does not matter which - the data is compared.
     * @param {Object[]} values1 Can be either a simple array of objects that will become records in the store, or model records.
     * @param {Object[]} values2 Can be either a simple array of objects that will become records in the store, or model records.
     * @returns {Boolean} true if the values are the same, else false.
     */
    valuesEqual: function (values1, values2) {
        // Both empty is equal (also catches empty array).
        if (Ext.isEmpty(values1) && Ext.isEmpty(values2)) {
            return true;
        }
        // If one is not an array then not equal.
        if (!Ext.isArray(values1) || !Ext.isArray(values2)) {
            return false;
        }
        // Array length tests.
        if (values1.length !== values2.length) {
            return false;
        }
        // Compare data objects.
        var equalCount = 0; // Keep a count of the number of objects that have matched up.
        values1.forEach(function (item1, index1) {
            var data1 = item1 instanceof Ext.data.Model ? item1.data : item1;
            // See if this data object is in value2.
            Ext.Array.every(values2, function (item2, index2) {
                var data2 = item2 instanceof Ext.data.Model ? item2.data : item2;
                // Should be comparing data objects now.
                if (Ext.Object.equals(data1, data2)) {
                    equalCount++;
                    return false; // Stop the compare.
                }
                return true; // Keep going to next values2 item.
            });
        });
        return equalCount === values1.length;
    },

    getEntityDisplayValue: function (values) {
        var me = this,
            item,
            length = values.length,
            inputValue = '',
            delimeter = me.getDelimeter(),
            value,
            descriptor,
            vf = me.getValueField(),
            df = me.getDisplayField();

        for (var i = 0; i < length; i++) {
            item = values[i];
            value = item.get ? item.get(vf) : item[vf];
            descriptor = (item.get ? item.get(df) : item[df]) || value;
            inputValue += i !== 0 ? delimeter + descriptor : descriptor;
        }
        return inputValue;
    },

    updateStore: function (store) {
        var me = this;
        if (store) {
            store.clearManagedListeners();
            me.mon(store, 'endupdate', me.doUpdateStore, me);
        }
        me.doUpdateStore(store);
    },

    doUpdateStore: function (store) {
        if (!store) {
            store = this.getStore();
        }
        var items = store && store.getRange ? store.getRange() : null;
        if (items) {
            this.setValue(items);
        }
    }
});