/**
 * Duplicate filtering class used to reduce the number of duplicate models in a store.
 *
 * @since ABP 3.0.0
 */
Ext.define('ABP.util.filters.misc.DuplicateFilter', {
    itemId: 'DuplicateFilter',
    config: {
        /**
         * The fields to use in the duplication check
         */
        fields: []
    },

    // Internal structure to store the keys already processed by the filter
    keys: [],

    /**
    * Initialises a new instance of the filter.
    */
    constructor: function (config) {
        this.initConfig(config);
        this.keys = [];

        return this;
    },

    /**
     * public function for filtering based on key properties values. Subclasses to override this
     * @param {String/Number} item The model instance to check for a match
     * @return {Boolean} whether the model matches the filter criteria
     */
    filter: function (item) {
        var me = this;

        var key = me.generateKey(item);

        // If a key could not be generated for the item, then show it
        if (!key) {
            return true;
        }

        if (Ext.Array.contains(me.keys, key)) {
            // Key already exists in the array of keys so hide it
            return false;
        }

        // Key does not exist alredy, lets add and show this item
        me.keys.push(key);

        // Unable to check, assume the item is visible
        return true;
    },

    privates: {
        generateKey: function (item) {
            var me = this;
            var key = '';
            var fields = me.getFields()
            Ext.Array.forEach(fields, function (field) {
                var value = item.get(field);
                if (value) {
                    key += value.toString();
                }
            });
            return key;
        }
    }
})