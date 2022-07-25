/**
 * Top N filtering class used to reduce the number of models in a store.
 *
 * @since ABP 3.0.0
 */
Ext.define('ABP.util.filters.misc.TopNFilter', {
    itemId: 'TopNFilter',
    config: {
        /**
         * The maximum number of results to show
         */
        maxResults: 10
    },

    /**
    * Initialises a new instance of the filter.
    */
    constructor: function (config) {
        this.initConfig(config);

        return this;
    },

    /**
     * public function for filtering based on period values. Subclasses to override this
     * @param {String/Number} item The model instance to check for a match
     * @return {Boolean} whether the model matches the filter criteria
     */
    filter: function (item) {
        var me = this;
        // console.log("item", item)
        if (item.store) {
            var i = item.store.indexOf(item);

            return i < me.getMaxResults();
        }

        // Unable to check, assume the item is hidden
        return false;
    }
})
