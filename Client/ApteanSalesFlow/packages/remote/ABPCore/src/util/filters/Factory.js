/**
 * Factory class to create instances of specific period based filter objects. Clients should call the factory instead of directly creating
 * instances
 *
 * @since ABP 3.0.0
 */
Ext.define('ABP.util.filters.Factory', {
    singleton: true,
    requires: [
        'ABP.util.filters.text.TextFilter'
    ],

    /**
     * Creates text-based filter objects based on the id.
     *
     *  store.removeFilter('TextFilter');
     *
     *  // Get the text filter object based on the selection
     *  var filterFunction = ABP.util.filters.Factory.createStringFilter(newValue, [
     *       {name:'firstName'},
     *       {name:'surname', useSoundEx: true},
     *       {name:'postCode', useSoundEx: false}
     *   ]);

     *  // filter the store passing the bound filter function
     *  store.filter({id: 'TextFilter', filterFn: filterFunction});
     *
     * @param {String} searchText the value to search for
     * @param {Array[String]} fieldsToSearch the field names to query
     * @param {Boolean} matchAllValues whether to filter records that contain all the filter values
     * @param {Number} minLengthThreshold The minimum length before the search kicks in
     */
    createStringFilter: function (searchText, fieldsToSearch, matchAllValues, minLengthThreshold) {
        var config = {
            searchText: searchText,
            searchFields: fieldsToSearch,
            matchAllValues: matchAllValues
        }

        if (minLengthThreshold) {
            config.minLengthThreshold = minLengthThreshold;
        }


        var textFilter = Ext.create('ABP.util.filters.text.TextFilter', config);
        return textFilter.filter.bind(textFilter);
    },

    /**
     * Creates top n-based filter .
     *
     *  store.removeFilter('TopNFilter');
     *
     *  // Get the text filter object based on the selection
     *  var filterFunction = ABP.util.filters.Factory.createStringFilter(10);
     *
     *  // filter the store passing the bound filter function
     *  store.filter({id: 'TopNFilter', filterFn: filterFunction});
     *
     * @param {Number} maxResults The maximum number of items to keep in the store
     */
    createTopNFilter: function (maxResults) {
        var config = { maxResults: maxResults }
        var filter = Ext.create('ABP.util.filters.misc.TopNFilter', config);
        return filter.filter.bind(filter);
    },

    /**
     * Creates duplication filter .
     *
     *  store.removeFilter('DuplicationFilter');
     *
     *  // Get the text filter object based on the selection
     *  var filterFunction = ABP.util.filters.Factory.createDuplicationFilter(['name']);
     *
     *  // filter the store passing the bound filter function
     *  store.filter({id: 'DuplicationFilter', filterFn: filterFunction});
     *
     * @param {Array} fields A list of the fields to use as keys for checking  duplicates
     */
    createDuplicationFilter: function (fields) {
        if (Ext.isString(fields)) {
            fields = ABP.util.String.toArray(fields);
        }

        var config = { fields: fields }
        var filter = Ext.create('ABP.util.filters.misc.DuplicateFilter', config);
        return filter.filter.bind(filter);
    }
})
