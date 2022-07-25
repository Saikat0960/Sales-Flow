/**
 * Modern link field. Single value.
 *
 * This field expects an object to be set as its value. Within this object should be the values of the displayField and the valueField configured on this component.
 * If a displayField value is not found, the valueField value will be displayed.
 */
Ext.define('ABPControlSet.view.field.EntityLink', {
    extend: 'ABPControlSet.view.field.TextArea',
    xtype: 'abpentitylinkfield',
    // Special styles for this field.
    cls: 'abp-link-field',
    // Not free text editable
    editable: false,
    // Grows to the configured maxRows
    maxRows: 1,

    config: {
        /**
         * @cfg {String/Number} valueField
         * The underlying {@link Ext.data.Field#name data value name} to bind to this
         * Select control. If configured as `null`, the {@link #cfg!displayField} is
         * used.
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {String/Number} displayField
         * The underlying {@link Ext.data.Field#name data value name} to bind to this
         * Select control.  If configured as `null`, the {@link #cfg!valueField} is used.
         *
         * This resolved value is the visibly rendered value of the available selection
         * options.
         * @accessor
         */
        displayField: 'text'
    },

    /**
     * Because entity links are updated by the user using a separate form from the control, 
     * it is possible to know when the user is updating the entity link. 
     * Call this method in that case instead of the normal setValue.
     * @param {Object} value The new entity link value. Should contain properties for the key and descriptor. Example:
     * 
     *     {MANAGER_CONTACT_CODE: "ext-1110", MANAGER_CONTACT_DESCRIPTOR: "Livvyy"}
     */
    setUserValue: function (value) {
        var me = this;
        this.__userChange = true;
        me.setValue(value);
        this.__userChange = null;
    },

    /**
     * Ensure the display value is shown and userchanged fires when this is a user change.
     * @param {Object} value The new entity link value. Should contain properties for the key and descriptor. Example:
     * 
     *     {MANAGER_CONTACT_CODE: "ext-1110", MANAGER_CONTACT_DESCRIPTOR: "Livvyy"}
     * @param {Object[]/Ext.data.Model[]} oldValue The previous value for the control.
     */
    updateValue: function (value, oldValue) {
        value = value || {};
        var me = this,
            displayValue = me.getEntityDisplayValue(value);

        me.setInputValue(displayValue);

        // Ensure clear icon is synced 
        me.syncEmptyState();

        // Fire userchanged if this the change is from the user and the value is different from the previous.
        if (this.__userChange && !me.valuesEqual(value, oldValue)) {
            this.fireEvent(ABPControlSet.common.types.Events.UserChanged, this, value, oldValue);
        }
    },

    /**
     * Compare two sets of entity link values. The values are arrays of either records from a store or simple objects.
     * It does not matter which - the data is compared.
     * @param {Object} values1 A simple object.
     * @param {Object} values2 A simple object.
     * @returns {Boolean} true if the properties of the two objects are the same, else false.
     */
    valuesEqual: function (value1, value2) {
        // Both empty is equal.
        if (Ext.isEmpty(value1) && Ext.isEmpty(value2)) {
            return true;
        }
        // If one is not an object then not equal.
        if (!Ext.isObject(value1) || !Ext.isObject(value2)) {
            return false;
        }
        // Compare data objects.
        return Ext.Object.equals(value1, value2);
    },

    /**
     * @override
     * Overrides the completeEdit to ensure the input value is updated correct for the entity field.
     */
    completeEdit: function () {
        var me = this,
            value = me.getInputValue(),
            parsedValue = me.parseValue(value);
        if (parsedValue !== null) {
            me.setInputValue(me.getEntityDisplayValue(me.getValue()));
        }
    },

    /**
     * Used to get the proper display value to show in the input.
     * Called on updateValue and completeEdit
     */
    getEntityDisplayValue: function (value) {
        var me = this,
            df = me.getDisplayField(),
            vf = me.getValueField(),
            displayValue = value[df],
            valueValue = value[vf];

        if (Ext.isEmpty(displayValue)) {
            displayValue = valueValue;
        }
        return displayValue;
    }
});