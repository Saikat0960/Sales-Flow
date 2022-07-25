/**
 * The global store for URLs entered in the login settings.
 * @private
 * @ignore
 */
Ext.define('ABP.store.ABPServerUrlStore', {
    extend: 'Ext.data.Store',

    requires: [
        'ABP.model.ServerUrlModel',
        'Ext.data.proxy.LocalStorage'
    ],

    storeId: 'ABPServerUrlStore',

    model: 'ABP.model.ServerUrlModel',

    autoLoad: true, // Start off by loading the previously used URLs from local storage.
    autoSync: true, // Flush any changes to local storage.

    proxy: {
        type: 'localstorage',
        id: 'ABP_SavedServerUrls'
    }
});