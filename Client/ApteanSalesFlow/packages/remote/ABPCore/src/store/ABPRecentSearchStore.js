Ext.define('ABP.store.ABPRecentSearchStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ABP.model.RecentModel'
    ],

    model: 'ABP.model.RecentModel',

    storeId: 'ABPRecentSearchStore',

    // Load the store when the search bar is first shown to
    // help speed up inital load times
    autoLoad: false,

    proxy: {
        type: 'localstorage',
        id: 'ABP_RecentSearches'
    },

    sorters: [{
        property: 'timestamp',
        direction: 'DESC'
    }
    ],

    /**
     * Append the search results to the provider
     */
    append: function (searchProvider, searchText, info, instanceId) {
        if (!searchText || searchText.length === 0) {
            return;
        }

        var maxRecents = searchProvider.get('recents');
        if (maxRecents === 0) {
            // If the search provider has no recent limit then do not store the recent searchs.
            return;
        }

        var me = this;
        var model = me.lookup(searchProvider.data.appId, searchProvider.data.id, searchText);

        if (model) {
            model.beginEdit();
            model.set('timestamp', Date.now());
            model.set('count', model.data.count + 1);
            model.endEdit();
        }
        else {
            model = Ext.create('ABP.model.RecentModel');
            model.set('appId', searchProvider.data.appId);
            model.set('searchId', searchProvider.data.id);
            model.set('timestamp', Date.now());
            model.set('count', 1);
            model.set('text', searchText);
            model.set('hierarchy', info);
            model.set('instanceId', instanceId);

            me.add(model);
        }

        me.truncate(searchProvider);

        me.sync();
    },

    privates: {
        /**
         * Find the record that matches the app if, search id and search text
         */
        lookup: function (appId, searchId, text) {
            var record = null;
            text = text.toLowerCase();

            this.each(function (item) {
                if (item.data.appId === appId && item.data.searchId === searchId && item.data.text.toLowerCase() === text) {
                    record = item;
                    return false;
                }
            })

            return record;
        },

        /**
         * Truncate the recent store so we don't say searches indefinatley. As a rule we'll only store 10x the number of recent items
         */
        truncate: function (search) {
            search.data.appId, search.data.id

            var me = this;
            var maxCount = search.get('recents') * 10;

            var toRemove = [];
            var count = 0;
            me.each(function (item) {
                if (item.data.appId === search.data.appId && item.data.searchId === search.data.id) {
                    count++;
                }

                if (count > maxCount) {
                    toRemove.push(item);
                }
            })

            me.remove(toRemove);
        }
    }
});