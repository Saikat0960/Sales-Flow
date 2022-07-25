/**
 * Modern link field. Multiple values.
 *
 * This field expects an array of objects to be set as its value. Within each object should be the values of the displayField and the valueField configured on this component.
 * If a displayField value is not found, the valueField value will be displayed.
 *
 * A store can be bound to this field, when updated, it will pull the records of the store and set them as the value. Likewise, when the value is directly set, it will update the stores records with the array of objects.
 *
 * Configured on this component is also the delimeter which splits multip       le record display values. (Defaults as ', ')
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

    // Grows to the configured growMax
    growMax: 1000,

    setValue: function (values) {
        values = values || [];
        var me = this,
            item,
            store = me.getStore(),
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

        if (store) {
            store.removeAll();
            store.add(values);
        }

        me.setRawValue(inputValue);
    },

    updateStore: function (store) {
        var items = store && store.getRange ? store.getRange() : null;
        if (items) {
            this.setValue(items);
        }
    }
});